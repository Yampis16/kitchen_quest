# app/schemas/weekly_menu.py
from pydantic import BaseModel
from typing import Optional, Dict, Any

class WeeklyMenuSave(BaseModel):
    data:     Dict[str, Any]
    group_id: Optional[int] = None

class WeeklyMenuResponse(BaseModel):
    id:       int
    user_id:  Optional[int]
    group_id: Optional[int]
    data:     Dict[str, Any]

    class Config:
        from_attributes = True