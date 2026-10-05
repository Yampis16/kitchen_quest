# app/schemas/recipe.py
from pydantic import BaseModel
from typing import List

class RecipeIngredient(BaseModel):
    ingredienteId: int
    grams:         float

class RecipeBase(BaseModel):
    nombre:      str
    porciones:   int
    tag:         str
    ingredientes: List[RecipeIngredient]

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id:         int
    user_id:    int
    compartida: bool = False

    class Config:
        from_attributes = True