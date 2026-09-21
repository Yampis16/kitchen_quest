// src/pages/RecipesPage.jsx
import { useState } from 'react'
import RecipeCard  from '../components/RecipeCard'
import RecipeModal from '../components/RecipeModal'

function RecipesPage({ recipes, ingredients, onSaveRecipe, onAddIngredient }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
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

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ingredients={ingredients}
          />
        ))}
        <article
          className="recipe-card recipe-card--empty"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="recipe-card__empty-icon">+</span>
          <p className="recipe-card__empty-text">Agregar receta</p>
        </article>
      </div>

      {isModalOpen && (
        <RecipeModal
          ingredients={ingredients}
          onClose={() => setIsModalOpen(false)}
          onSave={onSaveRecipe}
          onAddIngredient={onAddIngredient}
        />
      )}
    </>
  )
}

export default RecipesPage