# app/routers/ingredients.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ingredient import Ingredient
from app.schemas.ingredient import IngredientCreate, IngredientUpdate, IngredientResponse
from typing import List

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

@router.get("/", response_model=List[IngredientResponse])
def get_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()

@router.post("/", response_model=IngredientResponse)
def create_ingredient(ingredient: IngredientCreate, db: Session = Depends(get_db)):
    db_ingredient = Ingredient(**ingredient.model_dump())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(ingredient_id: int, ingredient: IngredientUpdate, db: Session = Depends(get_db)):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not db_ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    for key, value in ingredient.model_dump().items():
        setattr(db_ingredient, key, value)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.delete("/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not db_ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    db.delete(db_ingredient)
    db.commit()
    return { "message": "Ingrediente eliminado" }