# app/schemas/user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nombre:   str
    email:    EmailStr
    password: str

class UserResponse(BaseModel):
    id:     int
    nombre: str
    email:  str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type:   str
    user:         UserResponse

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str