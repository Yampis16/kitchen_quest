# app/models/group.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Group(Base):
    __tablename__ = "groups"

    id       = Column(Integer, primary_key=True, index=True)
    nombre   = Column(String, nullable=False)
    codigo   = Column(String, unique=True, index=True, nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    members  = relationship("GroupMember", back_populates="group")


class GroupMember(Base):
    __tablename__ = "group_members"

    id       = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_admin = Column(Boolean, default=False)

    group    = relationship("Group", back_populates="members")