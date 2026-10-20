# 🍳 Kitchen Quest

App de meal prep y alimentación saludable con planificación semanal,
cálculo nutricional automático y listas de mercado colaborativas.

**[Ver demo en vivo →](https://kitchen-quest-blush.vercel.app)**

---

## ✨ Features

- **Recetas con cálculo nutricional** — macros por porción calculados automáticamente
- **Banco de ingredientes** — modelo relacional, sin duplicar datos
- **Menú semanal** — planificación por día y comida con porciones configurables
- **Lista de mercado automática** — generada desde el menú, ingredientes mergeados
- **Grupos familiares** — menú colaborativo compartido entre miembros
- **Autenticación JWT** — usuarios con recetas privadas y compartidas
- **PWA** — instalable en móvil desde el navegador

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Estado | Zustand |
| Routing | React Router |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL + SQLAlchemy |
| Auth | JWT + bcrypt |
| Despliegue | Vercel (frontend) + Railway (backend) |
| CI/CD | GitHub Actions |

---

## 🏗 Arquitectura

frontend-react/ # React + Vite
├── src/
│ ├── components/ # RecipeCard, RecipeModal
│ ├── pages/ # RecipesPage, WeeklyMenuPage...
│ ├── store/ # Zustand (useKitchenStore, useAuthStore)
│ └── utils/ # api.js, nutrition.js, shoppingList.js

backend/ # FastAPI + Python
├── app/
│ ├── models/ # SQLAlchemy models
│ ├── routers/ # Endpoints REST
│ └── schemas/ # Pydantic validation
└── main.py

---

## 🚀 Correr localmente

```bash
# Backend
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend-react
npm install
npm run dev
```

Variables de entorno necesarias — ver `backend/.env.example`.

---

## 📖 Sobre este proyecto

Kitchen Quest es mi proyecto de aprendizaje y portfolio como arquitecto
en transición al desarrollo de software. Construido desde cero durante
el proceso de aprender programación — cada feature representa una
habilidad nueva adquirida.

**Desarrollado por:** Juan Mendoza — [LinkedIn] https://www.linkedin.com/in/juan-pablo-mendoza-4b12192b1/ · [GitHub] https://github.com/Yampis16

## 📸 Screenshots

![Recetas](docs/screenshots/recetas.png)
![Menú semanal](docs/screenshots/menu.png)
