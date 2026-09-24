# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import recipes, ingredients

# Crea las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kitchen Quest API", version="0.1.0")

# CORS — permite que React hable con la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipes.router)
app.include_router(ingredients.router)

@app.get("/")
def root():
    return { "message": "Kitchen Quest API funcionando 🍳" }