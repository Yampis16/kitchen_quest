# backend/seed.py
# Migra los ingredientes base a PostgreSQL
import requests

BASE_URL = "http://localhost:8000"

sample_ingredients = [
    { "nombre": "Avena en hojuelas",    "tag": "despensa", "kcal": 389, "prot": 17,  "carbs": 66,  "grasas": 7   },
    { "nombre": "Proteína en polvo",    "tag": "despensa", "kcal": 380, "prot": 75,  "carbs": 8,   "grasas": 5   },
    { "nombre": "Leche deslactosada",   "tag": "lácteo",   "kcal": 42,  "prot": 3.4, "carbs": 5,   "grasas": 1   },
    { "nombre": "Banano",               "tag": "fruta",    "kcal": 89,  "prot": 1.1, "carbs": 23,  "grasas": 0.3 },
    { "nombre": "Arroz blanco",         "tag": "despensa", "kcal": 130, "prot": 2.7, "carbs": 28,  "grasas": 0.3 },
    { "nombre": "Pechuga de pollo",     "tag": "proteína", "kcal": 165, "prot": 31,  "carbs": 0,   "grasas": 3.6 },
    { "nombre": "Brócoli",              "tag": "vegetal",  "kcal": 34,  "prot": 2.8, "carbs": 7,   "grasas": 0.4 },
    { "nombre": "Aguacate",             "tag": "grasa",    "kcal": 160, "prot": 2,   "carbs": 9,   "grasas": 15  },
    { "nombre": "Huevo entero",         "tag": "proteína", "kcal": 155, "prot": 13,  "carbs": 1,   "grasas": 11  },
    { "nombre": "Zanahoria",            "tag": "vegetal",  "kcal": 41,  "prot": 0.9, "carbs": 10,  "grasas": 0.2 },
    { "nombre": "Lentejas cocidas",     "tag": "legumbre", "kcal": 116, "prot": 9,   "carbs": 20,  "grasas": 0.4 },
    { "nombre": "Aceite de oliva",      "tag": "grasa",    "kcal": 884, "prot": 0,   "carbs": 0,   "grasas": 100 },
    { "nombre": "Quinoa cocida",        "tag": "despensa", "kcal": 120, "prot": 4.4, "carbs": 22,  "grasas": 1.9 },
    { "nombre": "Espinaca",             "tag": "vegetal",  "kcal": 23,  "prot": 2.9, "carbs": 3.6, "grasas": 0.4 },
    { "nombre": "Yogur griego natural", "tag": "lácteo",   "kcal": 59,  "prot": 10,  "carbs": 3.6, "grasas": 0.4 },
]

def seed():
    # Verifica que la API está corriendo
    try:
        r = requests.get(f"{BASE_URL}/")
        r.raise_for_status()
    except Exception:
        print("❌ La API no está corriendo. Inicia uvicorn primero.")
        return

    # Verifica si ya hay ingredientes
    existing = requests.get(f"{BASE_URL}/ingredients/").json()
    if existing:
        print(f"⚠️  Ya existen {len(existing)} ingredientes. Omitiendo seed.")
        return

    # Crea los ingredientes
    created = 0
    for ing in sample_ingredients:
        r = requests.post(f"{BASE_URL}/ingredients/", json=ing)
        if r.status_code == 200:
            created += 1
            print(f"✅ {ing['nombre']}")
        else:
            print(f"❌ Error con {ing['nombre']}: {r.text}")

    print(f"\n🍳 Seed completo — {created} ingredientes creados en PostgreSQL")

if __name__ == "__main__":
    seed()