# app/routers/weekly_menu.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.weekly_menu import WeeklyMenu
from app.models.group import GroupMember
from app.models.user import User
from app.schemas.weekly_menu import WeeklyMenuSave, WeeklyMenuResponse
from app.auth import get_current_user

router = APIRouter(prefix="/weekly-menu", tags=["weekly-menu"])

def verify_group_member(group_id: int, user_id: int, db: Session):
    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id  == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="No eres miembro de este grupo")
    return member

@router.get("/personal", response_model=WeeklyMenuResponse)
def get_personal_menu(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    menu = db.query(WeeklyMenu).filter(
        WeeklyMenu.user_id  == current_user.id,
        WeeklyMenu.group_id == None
    ).first()
    if not menu:
        menu = WeeklyMenu(user_id=current_user.id, data={})
        db.add(menu)
        db.commit()
        db.refresh(menu)
    return menu

@router.post("/personal", response_model=WeeklyMenuResponse)
def save_personal_menu(
    body:         WeeklyMenuSave,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    menu = db.query(WeeklyMenu).filter(
        WeeklyMenu.user_id  == current_user.id,
        WeeklyMenu.group_id == None
    ).first()
    if menu:
        menu.data = body.data
    else:
        menu = WeeklyMenu(user_id=current_user.id, data=body.data)
        db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu

@router.get("/group/{group_id}", response_model=WeeklyMenuResponse)
def get_group_menu(
    group_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    verify_group_member(group_id, current_user.id, db)
    menu = db.query(WeeklyMenu).filter(
        WeeklyMenu.group_id == group_id
    ).first()
    if not menu:
        menu = WeeklyMenu(group_id=group_id, data={})
        db.add(menu)
        db.commit()
        db.refresh(menu)
    return menu

@router.post("/group/{group_id}", response_model=WeeklyMenuResponse)
def save_group_menu(
    group_id:     int,
    body:         WeeklyMenuSave,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    verify_group_member(group_id, current_user.id, db)
    menu = db.query(WeeklyMenu).filter(
        WeeklyMenu.group_id == group_id
    ).first()
    if menu:
        menu.data = body.data
    else:
        menu = WeeklyMenu(group_id=group_id, data=body.data)
        db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu