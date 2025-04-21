from datetime import datetime, timedelta
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt # type: ignore
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.schemas.auth import CreateUserRequest, Token, TokenData, UserResponse, UpdateUserRequest, HistoryItem, RegisterResponse
from app.models.user import User
from core.database import get_db
from core.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY doit être une variable d'environnement")

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Fonction de création de token qui prend l'email, l'id et le bool admin d'un utilisateur + temps d'expiration du token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM) # Création du token avec les infos fournis
    return encoded_jwt

# Fonction qui récupère le token dans le header (oauth2_scheme) + la session de la base de donnée SQAlchemy
# Depends s'assure que le modèle est bien chargé avant d'initialiser l'endpoint
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM]) # Décode le token
        user_id: str = payload.get("id")
        email: str = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        if email is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(id=user_id, email=email, is_admin=is_admin)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == token_data.id).first() # Vérifie si un utilisateur correspond à l'id récupéré du token
    if user is None:
        raise credentials_exception
    return user

# Prend un groupe d'infos correspondant au model User: RegisterResponse + la session de la base de donnée SQLAlchemy
@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: CreateUserRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first() # Vérifie si un utilisateur existe déja avec l'email donnée
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déja enregistré")

    try: # Ajoute le nouvel utilisateur dans la db
        new_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            password=user_data.password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": f"Utilisateur enregistré avec succès !"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email déja enregistré")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Prend les infos demandées par le formulaire OAuth2 (username (email) & password) + la session de la base de données SQLAlchemy
# Depends s'assure que le modèle est bien chargé avant d'initialiser l'endpoint
@router.post("/login", response_model=Token)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first() # Vérifie l'existence d'un utilisateur correspondant à email donné (username)

    if not user or not user.verify_password(form_data.password): # Si aucun utilisateur ou que le mot de passe utilisé n'est pas le bon
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    # Créer un token en appelant la fonction create_access_token
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "is_admin": user.is_admin},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"} # Retourne le token et son type

# Retourne les infos de l'utilisateur s'il est connecté (en passant par la fonction get_current_user)
@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user.to_dict_history()

# Renvoie la liste des users
@router.get("/get_all")
def get_all_user(db: Session = Depends(get_db)):
    list_of_users = []
    users = db.query(User).all()
    for user in users:
        user_dict = user.to_dict_history()
        list_of_users.append(user_dict)
    return list_of_users

# Prend un id d'utilisateur, et vérifie que l'utilisateur est connecté (get_current_user)
@router.delete("/delete/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):

    # Vérifier si l'utilisateur existe
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Vérifie si l'utilisateur est admin ou si l'id du token récupéré est le même que celui donné (la condition s'éxecute si elle est fausse dans les deux cas)
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )

    db.delete(user_to_delete)
    db.commit()

    return {"message": f"Utilisateur supprimé avec succès"}

# Prend un id, les infos du modèle UpdateUserRequest, le token de l'utilisateur connecté (si c'est le cas) et la session de la db
@router.put("/update/{user_id}", status_code=status.HTTP_200_OK)
def update_user(user_id: str, user_data: UpdateUserRequest, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):

    # l'utilisateur existe ?
    user_to_update = db.query(User).filter(User.id == user_id).first()
    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Vérifie si l'utilisateur est admin ou si l'id du token récupéré est le même que celui donné (la condition s'éxecute si elle est fausse dans les deux cas)
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )

    # Vérifie que l'email n'existe pas déja sur un autre compte
    if user_data.email != user_to_update.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet email est déjà utilisé par un autre compte"
            )

    # Mettre à jour des infos
    user_to_update.first_name = user_data.first_name
    user_to_update.last_name = user_data.last_name
    user_to_update.email = user_data.email

    # Mettre à jour le mot de passe si fourni
    if user_data.password and user_data.old_password:
        if not user_to_update.verify_password(user_data.old_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ancien mot de passe incorrect"
            )
        user_to_update.hash_password(user_data.password)

    try:
        db.commit()
        return {"message": f"Utilisateur mis à jour avec succès"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erreur lors de la mise à jour de l'utilisateur"
        )


@router.post("/history_add/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def history_add(user_id: str, item: HistoryItem, current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    # l'utilisateur existe ?
    user_to_update = db.query(User).filter(User.id == user_id).first()
    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    # Vérifie si l'utilisateur est admin ou si l'id du token récupéré est le même que celui donné (la condition s'éxecute si elle est fausse dans les deux cas)
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Opération non autorisée"
        )

    if user_to_update.history is None:
        user_to_update.history = []

    current_history = user_to_update.history if user_to_update.history is not None else []
    new_history = current_history + [item.history_item]
    user_to_update.history = new_history
    db.add(user_to_update)
    db.commit()

    return {"message": "Historique mis à jour avec succès"}
