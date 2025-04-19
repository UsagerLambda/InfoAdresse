from pydantic import BaseModel, EmailStr
from typing import Optional, List

class HistoryItem(BaseModel):
    history_item: str

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    history: List[str] = []

class CreateUserRequest(UserBase):
    password: str

UserCreate = CreateUserRequest

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_admin: bool = False

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    email: Optional[str] = None
    is_admin: Optional[bool] = False

class UpdateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: Optional[str] = None
    old_password: Optional[str] = None
