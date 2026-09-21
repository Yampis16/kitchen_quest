// src/components/RecipeCard.jsx
import { calcularNutricionReceta } from '../utils/nutrition'

function MacroBar({ nutrition }) {
  const total = nutrition.prot + nutrition.carbs + nutrition.grasas
  if (total === 0) return <div className="h-1.5 rounded-full bg-gray-100" />

  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
      <div className="rounded-full bg-[#457B9D]" style={{ flex: nutrition.prot   / total }} />
      <div className="rounded-full bg-[#E9C46A]" style={{ flex: nutrition.carbs  / total }} />
      <div className="rounded-full bg-[#A8DADC]" style={{ flex: nutrition.grasas / total }} />
    </div>
  )
}

function MacroItem({ value, label, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold leading-none" style={{ color }}>{value}</span>
      <span className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
  )
}

function RecipeCard({ recipe, ingredients }) {
  const nutrition = calcularNutricionReceta(recipe, ingredients)

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer min-h-[200px]">

      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold leading-snug">{recipe.nombre}</h2>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
          style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}>
          {recipe.porciones} porciones
        </span>
      </div>

      <MacroBar nutrition={nutrition} />

      <div className="grid grid-cols-4 gap-2 text-center">
        <MacroItem value={nutrition.kcal}         label="kcal"     color="#E76F51" />
        <MacroItem value={`${nutrition.prot}g`}   label="proteína" color="#457B9D" />
        <MacroItem value={`${nutrition.carbs}g`}  label="carbos"   color="#E9C46A" />
        <MacroItem value={`${nutrition.grasas}g`} label="grasa"    color="#A8DADC" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">{recipe.tag}</span>
        <button className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-200 transition-colors duration-200 hover:bg-[#bed5cf]"
          style={{ color: 'var(--color-primary)' }}>
          Ver receta →
        </button>
      </div>

    </article>
  )
}

export default RecipeCard