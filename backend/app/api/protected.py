from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.models.user import User
from core.database import get_db

router = APIRouter(
    prefix="/api/v1/protected",
    tags=["Protected"]
)

@router.get("/")
def protected_route(current_user: Annotated[User, Depends(get_current_user)]):
    """A protected endpoint that requires a valid JWT token"""
    return {
        "message": f"Hello, {current_user.first_name} {current_user.last_name}",
        "email": current_user.email,
        "user_id": current_user.id
    }

def admin_required(current_user: Annotated[User, Depends(get_current_user)]):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.get("/admin")
def admin_route(current_user: Annotated[User, Depends(admin_required)]):
    """An endpoint that requires admin privileges"""
    return {
        "message": f"Admin access granted for {current_user.email}"
    }
