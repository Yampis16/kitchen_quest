# app/models/recipe.py
from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean
from app.database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String, nullable=False)
    porciones        = Column(Integer, nullable=False)
    tag              = Column(String, nullable=False)
    ingredientes     = Column(JSON, nullable=False, default=list)
    user_id          = Column(Integer, ForeignKey("users.id"), nullable=False)
    compartida       = Column(Boolean, default=False)