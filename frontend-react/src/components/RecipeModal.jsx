import { useState } from 'react'
import { generateId } from '../utils/storage'
import useKitchenStore from '../store/useKitchenStore'

function IngredientSearch({ ingredients, onSelect }) {
  const [query, setQuery]           = useState('')
  const [showResults, setShowResults] = useState(false)

  const results = query.length > 1
    ? ingredients.filter(i =>
        i.nombre.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  function handleSelect(ing) {
    onSelect(ing)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative">
      <input
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b] transition-colors"
        type="text"
        placeholder="Buscar ingrediente... (ej: pollo, avena)"
        value={query}
        onChange={e => { setQuery(e.target.value); setShowResults(true) }}
        onFocus={() => setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(ing => (
            <button
              key={ing.id}
              onClick={() => handleSelect(ing)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#bed5cf]/30 transition-colors"
            >
              <span className="text-sm font-medium flex-1">{ing.nombre}</span>
              <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{ing.tag}</span>
              <span className="text-xs text-gray-500">{ing.kcal} kcal · {ing.prot}g prot</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RecipeModal({ onClose, onSave }) {
  const ingredients    = useKitchenStore(state => state.ingredients)
  const addIngredient  = useKitchenStore(state => state.addIngredient)
  const [nombre,    setNombre]    = useState('')
  const [porciones, setPorciones] = useState(1)
  const [tag,       setTag]       = useState('🌅 Desayuno')
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [newIngredientMode, setNewIngredientMode]     = useState(false)
  const [newIng, setNewIng] = useState({
    nombre: '', tag: 'vegetal', kcal: '', prot: '', carbs: '', grasas: ''
  })

  function handleSelectIngredient(ing) {
    setSelectedIngredients(prev => [
      ...prev,
      { ingredienteId: ing.id, nombre: ing.nombre, grams: '' }
    ])
  }

  function handleGramsChange(index, value) {
    setSelectedIngredients(prev =>
      prev.map((item, i) => i === index ? { ...item, grams: value } : item)
    )
  }

  function handleRemoveIngredient(index) {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index))
  }

  function handleSaveNewIngredient() {
    if (!newIng.nombre.trim()) { alert('El nombre es obligatorio'); return }
    const created = {
      id:     generateId(),
      nombre: newIng.nombre.trim(),
      tag:    newIng.tag,
      kcal:   parseFloat(newIng.kcal)   || 0,
      prot:   parseFloat(newIng.prot)   || 0,
      carbs:  parseFloat(newIng.carbs)  || 0,
      grasas: parseFloat(newIng.grasas) || 0,
    }
    addIngredient(created)
    handleSelectIngredient(created)
    setNewIngredientMode(false)
    setNewIng({ nombre: '', tag: 'vegetal', kcal: '', prot: '', carbs: '', grasas: '' })
  }

  function handleSave() {
    if (!nombre.trim()) { alert('El nombre es obligatorio'); return }
    if (porciones <= 0)  { alert('Las porciones deben ser mayor a 0'); return }

    const ingredientesValidos = selectedIngredients
      .filter(i => parseFloat(i.grams) > 0)
      .map(i => ({ ingredienteId: i.ingredienteId, grams: parseFloat(i.grams) }))

    if (ingredientesValidos.length === 0) {
      alert('Agrega al menos un ingrediente con gramos')
      return
    }

    onSave({ id: generateId(), nombre, porciones, tag, ingredientes: ingredientesValidos })
    onClose()
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b] transition-colors"

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Nueva Receta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-500">Nombre de la receta</label>
            <input className={inputCls} type="text" placeholder="Ej: Bowl de quinoa"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Porciones</label>
              <input className={inputCls} type="number" min="1"
                value={porciones} onChange={e => setPorciones(parseInt(e.target.value) || 1)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Categoría</label>
              <select className={inputCls} value={tag} onChange={e => setTag(e.target.value)}>
                <option>🌅 Desayuno</option>
                <option>🍽️ Almuerzo</option>
                <option>🌙 Cena</option>
                <option>🥪 Snack</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-500">Ingredientes</label>
            <IngredientSearch ingredients={ingredients} onSelect={handleSelectIngredient} />

            {selectedIngredients.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden mt-1">
                <div className="grid grid-cols-[1fr_100px_32px] gap-2 px-4 py-2 bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <span>Ingrediente</span><span>Gramos</span><span />
                </div>
                {selectedIngredients.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_100px_32px] gap-2 px-4 py-2 items-center border-t border-gray-100">
                    <span className="text-sm">{item.nombre}</span>
                    <input
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b]"
                      type="number" placeholder="0" min="0"
                      value={item.grams}
                      onChange={e => handleGramsChange(i, e.target.value)}
                    />
                    <button onClick={() => handleRemoveIngredient(i)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg">×</button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setNewIngredientMode(!newIngredientMode)}
              className="text-sm font-medium mt-1 text-left px-3 py-2 border border-dashed border-gray-200 rounded-lg hover:border-[#728d6a] hover:bg-[#bed5cf]/20 transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              {newIngredientMode ? '— Cancelar nuevo ingrediente' : '+ Ingrediente no encontrado'}
            </button>

            {newIngredientMode && (
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-500">Nuevo ingrediente (valores por 100g)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input className={`${inputCls} col-span-2`} type="text" placeholder="Nombre"
                    value={newIng.nombre} onChange={e => setNewIng(p => ({ ...p, nombre: e.target.value }))} />
                  <input className={inputCls} type="text" placeholder="Categoría (ej: vegetal)"
                    value={newIng.tag} onChange={e => setNewIng(p => ({ ...p, tag: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="kcal"
                    value={newIng.kcal} onChange={e => setNewIng(p => ({ ...p, kcal: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="proteína g"
                    value={newIng.prot} onChange={e => setNewIng(p => ({ ...p, prot: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="carbos g"
                    value={newIng.carbs} onChange={e => setNewIng(p => ({ ...p, carbs: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="grasa g"
                    value={newIng.grasas} onChange={e => setNewIng(p => ({ ...p, grasas: e.target.value }))} />
                </div>
                <button
                  onClick={handleSaveNewIngredient}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ background: 'var(--color-primary)' }}
                >
                  Agregar al banco y a la receta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}>
            Guardar receta
          </button>
        </div>

      </div>
    </div>
  )
}

export default RecipeModal