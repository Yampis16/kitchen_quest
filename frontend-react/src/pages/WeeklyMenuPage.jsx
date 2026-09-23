import { useState } from 'react'
import useKitchenStore from '../store/useKitchenStore'

const DAYS  = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
const MEALS = ['desayuno','almuerzo','cena','snack']

const MEAL_ICONS = {
  desayuno: '🌅',
  almuerzo: '🍽️',
  cena:     '🌙',
  snack:    '🥪',
}

// ── Selector de receta para una comida ──────────────────────
function MealSlot({ day, meal, assignment, recipes, onSet, onClear }) {
  const [isOpen, setIsOpen]       = useState(false)
  const [porciones, setPorciones] = useState(assignment?.porciones || 1)
  const [search, setSearch]       = useState('')

  const recipe = assignment
    ? recipes.find(r => r.id === assignment.recipeId)
    : null

  const filtered = recipes.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(r) {
    onSet(day, meal, r.id, porciones)
    setIsOpen(false)
    setSearch('')
  }

  function handlePortionChange(val) {
    const p = parseInt(val) || 1
    setPorciones(p)
    if (assignment) onSet(day, meal, assignment.recipeId, p)
  }

  if (recipe) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#bed5cf]/20 border border-[#bed5cf] rounded-lg group">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--color-primary)' }}>
            {recipe.nombre}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-gray-400">porciones:</span>
            <input
              type="number" min="1"
              value={porciones}
              onChange={e => handlePortionChange(e.target.value)}
              className="w-10 text-xs px-1 py-0.5 border border-gray-200 rounded text-center bg-white focus:outline-none focus:border-[#023d5b]"
            />
          </div>
        </div>
        <button
          onClick={() => onClear(day, meal)}
          className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none flex-shrink-0"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-[#728d6a] hover:text-[#023d5b] hover:bg-[#bed5cf]/10 transition-all text-left"
      >
        + Agregar
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ minWidth: '220px' }}>
          <div className="p-2 border-b border-gray-100">
            <input
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#023d5b]"
              placeholder="Buscar receta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">Sin resultados</p>
            ) : filtered.map(r => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full px-3 py-2 text-left hover:bg-[#bed5cf]/20 transition-colors"
              >
                <p className="text-xs font-medium">{r.nombre}</p>
                <p className="text-xs text-gray-400">{r.tag} · {r.porciones} porc. base</p>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => { setIsOpen(false); setSearch('') }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Vista principal ──────────────────────────────────────────
function WeeklyMenuPage() {
  const recipes    = useKitchenStore(state => state.recipes)
  const weeklyMenu = useKitchenStore(state => state.weeklyMenu)
  const setMeal    = useKitchenStore(state => state.setMeal)
  const clearDay   = useKitchenStore(state => state.clearDay)
  const clearWeek  = useKitchenStore(state => state.clearWeek)

  function handleClearMeal(day, meal) {
    setMeal(day, meal, null, 1)
  }

  const totalAssigned = DAYS.reduce((acc, day) =>
    acc + MEALS.filter(meal => weeklyMenu[day]?.[meal] !== null).length
  , 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menú Semanal</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalAssigned} comida{totalAssigned !== 1 ? 's' : ''} planificada{totalAssigned !== 1 ? 's' : ''} esta semana
          </p>
        </div>
        <button
          onClick={clearWeek}
          className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
        >
          Limpiar semana
        </button>
      </div>

      {/* Grid semanal */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {DAYS.map(day => (
          <div key={day} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">

            {/* Header del día */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold capitalize">{day}</h2>
              <button
                onClick={() => clearDay(day)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Limpiar
              </button>
            </div>

            {/* Comidas del día */}
            <div className="flex flex-col gap-2">
              {MEALS.map(meal => (
                <div key={meal}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">{MEAL_ICONS[meal]}</span>
                    <span className="text-xs text-gray-400 capitalize">{meal}</span>
                  </div>
                  <MealSlot
                    day={day}
                    meal={meal}
                    assignment={weeklyMenu[day]?.[meal]}
                    recipes={recipes}
                    onSet={setMeal}
                    onClear={handleClearMeal}
                  />
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </>
  )
}

export default WeeklyMenuPage