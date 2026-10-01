# app/routers/recipes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.recipe import Recipe
from app.models.user import User
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.auth import get_current_user
from typing import List

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("/", response_model=List[RecipeResponse])
def get_recipes(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    return db.query(Recipe).filter(Recipe.user_id == current_user.id).all()

@router.post("/", response_model=RecipeResponse)
def create_recipe(
    recipe:       RecipeCreate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    data = recipe.model_dump()
    db_recipe = Recipe(**data, user_id=current_user.id)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id:    int,
    recipe:       RecipeUpdate,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    db_recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id,
        Recipe.user_id == current_user.id
    ).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    for key, value in recipe.model_dump().items():
        setattr(db_recipe, key, value)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user)
):
    db_recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id,
        Recipe.user_id == current_user.id
    ).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    db.delete(db_recipe)
    db.commit()
    return { "message": "Receta eliminada" }