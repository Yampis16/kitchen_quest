// src/components/RecipeCard.jsx
import { calcularNutricionReceta } from '../utils/nutrition'

function MacroBar({ nutrition }) {
  const total = nutrition.prot + nutrition.carbs + nutrition.grasas
  if (total === 0) return <div className="macro-bar" />
  return (
    <div className="macro-bar">
      <div className="macro-bar__segment macro-bar__segment--protein" style={{ flex: nutrition.prot   / total }} />
      <div className="macro-bar__segment macro-bar__segment--carbs"   style={{ flex: nutrition.carbs  / total }} />
      <div className="macro-bar__segment macro-bar__segment--fat"     style={{ flex: nutrition.grasas / total }} />
    </div>
  )
}

function MacroItem({ value, label, colorClass }) {
  return (
    <div className="macro-item">
      <span className={`macro-item__value ${colorClass}`}>{value}</span>
      <span className="macro-item__label">{label}</span>
    </div>
  )
}

function RecipeCard({ recipe, ingredients }) {
  const nutrition = calcularNutricionReceta(recipe, ingredients)

  return (
    <article className="recipe-card">
      <div className="recipe-card__header">
        <h2 className="recipe-card__name">{recipe.nombre}</h2>
        <span className="recipe-card__portions">{recipe.porciones} porciones</span>
      </div>

      <MacroBar nutrition={nutrition} />

      <div className="macro-grid">
        <MacroItem value={nutrition.kcal}          label="kcal"     colorClass="macro-item__value--calories" />
        <MacroItem value={`${nutrition.prot}g`}    label="proteína" colorClass="macro-item__value--protein"  />
        <MacroItem value={`${nutrition.carbs}g`}   label="carbos"   colorClass="macro-item__value--carbs"    />
        <MacroItem value={`${nutrition.grasas}g`}  label="grasa"    colorClass="macro-item__value--fat"      />
      </div>

      <div className="recipe-card__footer">
        <span className="recipe-card__tag">{recipe.tag}</span>
        <button className="btn btn--ghost btn--sm">Ver receta →</button>
      </div>
    </article>
  )
}

export default RecipeCard