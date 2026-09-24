# app/schemas/ingredient.py
from pydantic import BaseModel
from typing import Optional

class IngredientBase(BaseModel):
    nombre: str
    tag:    str
    kcal:   float = 0
    prot:   float = 0
    carbs:  float = 0
    grasas: float = 0

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    id: int

    class Config:
        from_attributes = True