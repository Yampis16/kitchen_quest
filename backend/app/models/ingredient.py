# app/models/ingredient.py
from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id      = Column(Integer, primary_key=True, index=True)
    nombre  = Column(String, nullable=False)
    tag     = Column(String, nullable=False)
    kcal    = Column(Float, default=0)
    prot    = Column(Float, default=0)
    carbs   = Column(Float, default=0)
    grasas  = Column(Float, default=0)