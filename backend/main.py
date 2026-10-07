# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import recipes, ingredients, auth, groups, weekly_menu
from app.models  import user, recipe, ingredient, group, weekly_menu as wm_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kitchen Quest API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recipes.router)
app.include_router(ingredients.router)
app.include_router(groups.router)
app.include_router(weekly_menu.router)

@app.get("/")
def root():
    return { "message": "Kitchen Quest API v0.2.0 🍳" }