# app/routers/groups.py
import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.group import Group, GroupMember
from app.models.user import User
from app.models.recipe import Recipe
from app.schemas.group import GroupCreate, GroupJoin, GroupResponse
from app.auth import get_current_user
from typing import List

router = APIRouter(prefix="/groups", tags=["groups"])

def generate_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.post("/", response_model=GroupResponse)
def create_group(
    data:         GroupCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    # Genera código único
    code = generate_code()
    while db.query(Group).filter(Group.codigo == code).first():
        code = generate_code()

    group = Group(nombre=data.nombre, codigo=code, admin_id=current_user.id)
    db.add(group)
    db.flush()

    # El creador es miembro y admin
    member = GroupMember(group_id=group.id, user_id=current_user.id, is_admin=True)
    db.add(member)
    db.commit()
    db.refresh(group)
    return group

@router.post("/join", response_model=GroupResponse)
def join_group(
    data:         GroupJoin,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.codigo == data.codigo).first()
    if not group:
        raise HTTPException(status_code=404, detail="Código de grupo inválido")

    already = db.query(GroupMember).filter(
        GroupMember.group_id == group.id,
        GroupMember.user_id  == current_user.id
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="Ya eres miembro de este grupo")

    member = GroupMember(group_id=group.id, user_id=current_user.id, is_admin=False)
    db.add(member)
    db.commit()
    db.refresh(group)
    return group

@router.get("/mine", response_model=List[GroupResponse])
def get_my_groups(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    memberships = db.query(GroupMember).filter(
        GroupMember.user_id == current_user.id
    ).all()
    group_ids = [m.group_id for m in memberships]
    return db.query(Group).filter(Group.id.in_(group_ids)).all()

@router.get("/{group_id}/recipes")
def get_group_recipes(
    group_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    # Verifica que el usuario es miembro
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id  == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="No eres miembro de este grupo")

    # Trae los user_ids de todos los miembros
    members    = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
    member_ids = [m.user_id for m in members]

    # Recetas compartidas de todos los miembros
    recipes = db.query(Recipe).filter(
        Recipe.user_id.in_(member_ids),
        Recipe.compartida == True
    ).all()
    return recipes

@router.delete("/{group_id}/leave")
def leave_group(
    group_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id  == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="No eres miembro de este grupo")

    group = db.query(Group).filter(Group.id == group_id).first()
    if group.admin_id == current_user.id:
        raise HTTPException(status_code=400, detail="El admin no puede abandonar el grupo")

    db.delete(member)
    db.commit()
    return { "message": "Saliste del grupo" }