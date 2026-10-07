# app/models/weekly_menu.py
from sqlalchemy import Column, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class WeeklyMenu(Base):
    __tablename__ = "weekly_menus"

    id       = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    data     = Column(JSON, nullable=False, default=dict)