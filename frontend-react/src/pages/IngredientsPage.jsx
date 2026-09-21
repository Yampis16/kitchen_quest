// src/pages/IngredientsPage.jsx
import { useState } from 'react'
import { generateId } from '../utils/storage'
import useKitchenStore from '../store/useKitchenStore'

const TAGS = ['vegetal', 'fruta', 'proteína', 'lácteo', 'despensa', 'legumbre', 'grasa', 'otro']

const emptyIngredient = () => ({
  nombre: '', tag: 'despensa',
  kcal: '', prot: '', carbs: '', grasas: ''
})

// ── Fila editable ────────────────────────────────────────────
function IngredientRow({ ingredient, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft]         = useState(ingredient)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleSave() {
    if (!draft.nombre.trim()) { alert('El nombre es obligatorio'); return }
    onUpdate({
      ...draft,
      kcal:   parseFloat(draft.kcal)   || 0,
      prot:   parseFloat(draft.prot)   || 0,
      carbs:  parseFloat(draft.carbs)  || 0,
      grasas: parseFloat(draft.grasas) || 0,
    })
    setIsEditing(false)
  }

  function handleCancel() {
    setDraft(ingredient)
    setIsEditing(false)
  }

  const cellCls = "px-4 py-3 text-sm"
  const inputCls = "w-full px-2 py-1 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b]"

  if (isEditing) {
    return (
      <tr className="bg-[#bed5cf]/10 border-b border-gray-100">
        <td className={cellCls}>
          <input className={inputCls} value={draft.nombre}
            onChange={e => setDraft(p => ({ ...p, nombre: e.target.value }))} />
        </td>
        <td className={cellCls}>
          <select className={inputCls} value={draft.tag}
            onChange={e => setDraft(p => ({ ...p, tag: e.target.value }))}>
            {TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
        </td>
        {['kcal','prot','carbs','grasas'].map(field => (
          <td key={field} className={cellCls}>
            <input className={inputCls} type="number" min="0"
              value={draft[field]}
              onChange={e => setDraft(p => ({ ...p, [field]: e.target.value }))} />
          </td>
        ))}
        <td className={`${cellCls} flex gap-2`}>
          <button onClick={handleSave}
            className="px-3 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-colors"
            style={{ background: 'var(--color-primary)' }}>
            Guardar
          </button>
          <button onClick={handleCancel}
            className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <td className={`${cellCls} font-medium`}>{ingredient.nombre}</td>
      <td className={cellCls}>
        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">
          {ingredient.tag}
        </span>
      </td>
      <td className={`${cellCls} text-[#E76F51] font-medium`}>{ingredient.kcal}</td>
      <td className={`${cellCls} text-[#457B9D] font-medium`}>{ingredient.prot}g</td>
      <td className={`${cellCls} text-[#E9C46A] font-medium`}>{ingredient.carbs}g</td>
      <td className={`${cellCls} text-[#A8DADC] font-medium`}>{ingredient.grasas}g</td>
      <td className={`${cellCls}`}>
        {showConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">¿Eliminar?</span>
            <button onClick={() => onDelete(ingredient.id)}
              className="px-2 py-1 rounded text-xs font-medium text-white bg-red-400 hover:bg-red-500 transition-colors">
              Sí
            </button>
            <button onClick={() => setShowConfirm(false)}
              className="px-2 py-1 rounded text-xs border border-gray-200 hover:bg-gray-50 transition-colors">
              No
            </button>
          </div>
        ) : (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)}
              className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
              Editar
            </button>
            <button onClick={() => setShowConfirm(true)}
              className="px-3 py-1 rounded-lg text-xs font-medium text-red-400 border border-red-200 hover:bg-red-50 transition-colors">
              Eliminar
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

// ── Fila para nuevo ingrediente ──────────────────────────────
function NewIngredientRow({ onSave, onCancel }) {
  const [draft, setDraft] = useState(emptyIngredient())
  const inputCls = "w-full px-2 py-1 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b]"

  function handleSave() {
    if (!draft.nombre.trim()) { alert('El nombre es obligatorio'); return }
    onSave({
      id:     generateId(),
      nombre: draft.nombre.trim(),
      tag:    draft.tag,
      kcal:   parseFloat(draft.kcal)   || 0,
      prot:   parseFloat(draft.prot)   || 0,
      carbs:  parseFloat(draft.carbs)  || 0,
      grasas: parseFloat(draft.grasas) || 0,
    })
  }

  return (
    <tr className="bg-[#bed5cf]/20 border-b border-gray-100">
      <td className="px-4 py-3">
        <input className={inputCls} placeholder="Nombre del ingrediente"
          value={draft.nombre} onChange={e => setDraft(p => ({ ...p, nombre: e.target.value }))} />
      </td>
      <td className="px-4 py-3">
        <select className={inputCls} value={draft.tag}
          onChange={e => setDraft(p => ({ ...p, tag: e.target.value }))}>
          {TAGS.map(t => <option key={t}>{t}</option>)}
        </select>
      </td>
      {['kcal','prot','carbs','grasas'].map(field => (
        <td key={field} className="px-4 py-3">
          <input className={inputCls} type="number" min="0" placeholder="0"
            value={draft[field]}
            onChange={e => setDraft(p => ({ ...p, [field]: e.target.value }))} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button onClick={handleSave}
            className="px-3 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-colors"
            style={{ background: 'var(--color-primary)' }}>
            Agregar
          </button>
          <button onClick={onCancel}
            className="px-3 py-1 rounded-lg text-xs border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Vista principal ──────────────────────────────────────────
function IngredientsPage() {
  const [showNewRow, setShowNewRow] = useState(false)
  const [search, setSearch]         = useState('')

  const ingredients     = useKitchenStore(state => state.ingredients)
  const addIngredient   = useKitchenStore(state => state.addIngredient)
  const updateIngredient = useKitchenStore(state => state.updateIngredient)
  const deleteIngredient = useKitchenStore(state => state.deleteIngredient)

  const filtered = ingredients.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase()) ||
    i.tag.toLowerCase().includes(search.toLowerCase())
  )

  const thCls = "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide"

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Banco de Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} registrado{ingredients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowNewRow(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: 'var(--color-primary)' }}
        >
          + Nuevo ingrediente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          className="w-full max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#023d5b] transition-colors"
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className={thCls}>Nombre</th>
                <th className={thCls}>Categoría</th>
                <th className={thCls} style={{ color: '#E76F51' }}>Kcal</th>
                <th className={thCls} style={{ color: '#457B9D' }}>Proteína</th>
                <th className={thCls} style={{ color: '#E9C46A' }}>Carbos</th>
                <th className={thCls} style={{ color: '#A8DADC' }}>Grasa</th>
                <th className={thCls}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {showNewRow && (
                <NewIngredientRow
                  onSave={addIngredient}
                  onCancel={() => setShowNewRow(false)}
                />
              )}
              {filtered.map(ing => (
                <IngredientRow
                  key={ing.id}
                  ingredient={ing}
                  onUpdate={updateIngredient}
                  onDelete={deleteIngredient}
                />
              ))}
              {filtered.length === 0 && !showNewRow && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No se encontraron ingredientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota informativa */}
      <p className="text-xs text-gray-400 mt-4">
        💡 Todos los valores nutricionales son por 100g. Los cambios se aplican automáticamente a todas las recetas que usen este ingrediente.
      </p>
    </>
  )
}

export default IngredientsPage