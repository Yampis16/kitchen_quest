import { useState } from 'react'
import useKitchenStore from '../store/useKitchenStore'
import { generarListaMercado, agruparPorTag } from '../utils/shoppingList'

const TAG_ICONS = {
  vegetal:   '🥦',
  fruta:     '🍎',
  proteína:  '🍗',
  lácteo:    '🥛',
  despensa:  '🫙',
  legumbre:  '🫘',
  grasa:     '🫒',
  otro:      '📦',
}

function ShoppingListPage() {
  const recipes     = useKitchenStore(state => state.recipes)
  const ingredients = useKitchenStore(state => state.ingredients)
  const weeklyMenu  = useKitchenStore(state => state.weeklyMenu)

  const [checked, setChecked] = useState({})

  const lista   = generarListaMercado(weeklyMenu, recipes, ingredients)
  const grupos  = agruparPorTag(lista)
  const total   = lista.length
  const checked_count = Object.values(checked).filter(Boolean).length

  function toggleItem(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleAll() {
    if (checked_count === total) {
      setChecked({})
    } else {
      const all = Object.fromEntries(lista.map(i => [i.ingredienteId, true]))
      setChecked(all)
    }
  }

  if (lista.length === 0) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Lista del Mercado</h1>
          <p className="text-sm text-gray-500 mt-1">Generada desde tu menú semanal</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
          <span className="text-5xl">🛒</span>
          <h2 className="text-xl font-semibold">No hay nada en el menú todavía</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Planifica tu semana en la sección de Menú Semanal y la lista se generará automáticamente.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lista del Mercado</h1>
          <p className="text-sm text-gray-500 mt-1">
            {checked_count} de {total} ingrediente{total !== 1 ? 's' : ''} conseguido{total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={toggleAll}
          className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {checked_count === total ? 'Desmarcar todo' : 'Marcar todo'}
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${total > 0 ? (checked_count / total) * 100 : 0}%`,
            background: 'var(--color-primary)'
          }}
        />
      </div>

      {/* Lista agrupada por tag */}
      <div className="flex flex-col gap-6">
        {Object.entries(grupos).map(([tag, items]) => (
          <div key={tag}>
            {/* Header de grupo */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{TAG_ICONS[tag] || '📦'}</span>
              <h2 className="text-sm font-semibold capitalize text-gray-600">{tag}</h2>
              <span className="text-xs text-gray-400">({items.length})</span>
            </div>

            {/* Items del grupo */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {items.map((item, idx) => (
                <div
                  key={item.ingredienteId}
                  onClick={() => toggleItem(item.ingredienteId)}
                  className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors
                    ${idx !== 0 ? 'border-t border-gray-100' : ''}
                    ${checked[item.ingredienteId] ? 'bg-gray-50' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${checked[item.ingredienteId]
                      ? 'border-[#023d5b] bg-[#023d5b]'
                      : 'border-gray-300'
                    }`}
                  >
                    {checked[item.ingredienteId] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Nombre */}
                  <span className={`flex-1 text-sm transition-all
                    ${checked[item.ingredienteId]
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'
                    }`}
                  >
                    {item.nombre}
                  </span>

                  {/* Cantidad */}
                  <span className={`text-sm font-medium transition-all
                    ${checked[item.ingredienteId] ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {item.grams}g
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ShoppingListPage