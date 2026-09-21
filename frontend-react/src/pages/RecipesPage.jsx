import { useState } from 'react'
import RecipeCard   from '../components/RecipeCard'
import RecipeModal  from '../components/RecipeModal'
import useKitchenStore from '../store/useKitchenStore'

function RecipesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const recipes     = useKitchenStore(state => state.recipes)
  const ingredients = useKitchenStore(state => state.ingredients)
  const addRecipe   = useKitchenStore(state => state.addRecipe)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Recetas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {recipes.length} receta{recipes.length !== 1 ? 's' : ''} guardada{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: 'var(--color-primary)' }}
        >
          + Nueva receta
        </button>
      </div>

      <div className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} ingredients={ingredients} />
        ))}
        <article
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 min-h-[200px] cursor-pointer transition-all duration-200 hover:border-[#728d6a] hover:bg-[#bed5cf]/20"
        >
          <span className="text-3xl text-gray-300">+</span>
          <p className="text-sm text-gray-400">Agregar receta</p>
        </article>
      </div>

      {isModalOpen && (
        <RecipeModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => { addRecipe(data); setIsModalOpen(false) }}
        />
      )}
    </>
  )
}

export default RecipesPage