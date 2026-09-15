import { useState } from 'react'
import RecipeCard from './components/RecipeCard'
import RecipeModal from './components/RecipeModal'

const initialRecipes = [
  {
    id: 1,
    name: "Avena Proteica Matutina",
    portions: 2,
    tag: "🌅 Desayuno",
    ingredients: [
      { name: "Avena en hojuelas",  grams: 80,  cal: 389, protein: 17,  carbs: 66, fat: 7   },
      { name: "Proteína en polvo",  grams: 30,  cal: 380, protein: 75,  carbs: 8,  fat: 5   },
      { name: "Leche deslactosada", grams: 200, cal: 42,  protein: 3.4, carbs: 5,  fat: 1   },
      { name: "Banano",             grams: 100, cal: 89,  protein: 1.1, carbs: 23, fat: 0.3 },
    ]
  },
  {
    id: 2,
    name: "Comida Clásica",
    portions: 3,
    tag: "🍽️ Almuerzo",
    ingredients: [
      { name: "Arroz blanco",  grams: 150, cal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      { name: "Pechuga pollo", grams: 200, cal: 165, protein: 31,  carbs: 0,  fat: 3.6 },
      { name: "Brócoli",       grams: 100, cal: 34,  protein: 2.8, carbs: 7,  fat: 0.4 },
      { name: "Aguacate",      grams: 80,  cal: 160, protein: 2,   carbs: 9,  fat: 15  },
    ]
  },
]

function App() {
  const [recipes, setRecipes]         = useState(initialRecipes)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleSaveRecipe(newRecipe) {
    setRecipes(prev => [...prev, newRecipe])
    setIsModalOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand">
          <span className="navbar__icon">🍳</span>
          <span className="navbar__name">Kitchen Quest</span>
        </div>
        <div className="navbar__links">
          <a href="#" className="navbar__link navbar__link--active">Recetas</a>
          <a href="#" className="navbar__link">Menú semanal</a>
          <a href="#" className="navbar__link">Mercado</a>
        </div>
      </nav>

      <main className="main">
        <header className="section-header">
          <div>
            <h1 className="section-header__title">Mis Recetas</h1>
            <p className="section-header__subtitle">
              {recipes.length} receta{recipes.length !== 1 ? 's' : ''} guardada{recipes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Nueva receta
          </button>
        </header>

        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}

          <article
            className="recipe-card recipe-card--empty"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="recipe-card__empty-icon">+</span>
            <p className="recipe-card__empty-text">Agregar receta</p>
          </article>
        </div>
      </main>

      {isModalOpen && (
        <RecipeModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRecipe}
        />
      )}
    </>
  )
}

export default App