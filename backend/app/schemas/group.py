# app/schemas/group.py
from pydantic import BaseModel
from typing import List, Optional

class GroupCreate(BaseModel):
    nombre: str

class GroupJoin(BaseModel):
    codigo: str

class MemberResponse(BaseModel):
    user_id:  int
    is_admin: bool

    class Config:
        from_attributes = True

class GroupResponse(BaseModel):
    id:       int
    nombre:   str
    codigo:   str
    admin_id: int
    members:  List[MemberResponse] = []

    class Config:
        from_attributes = True