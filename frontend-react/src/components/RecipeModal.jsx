// src/components/RecipeModal.jsx
import { useState } from 'react'
import { generateId } from '../utils/storage'

function IngredientSearch({ ingredients, onSelect }) {
  const [query, setQuery] = useState('')
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
    <div style={{ position: 'relative' }}>
      <input
        className="form-input"
        type="text"
        placeholder="Buscar ingrediente... (ej: pollo, avena)"
        value={query}
        onChange={e => { setQuery(e.target.value); setShowResults(true) }}
        onFocus={() => setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <div className="ingredient-dropdown">
          {results.map(ing => (
            <button
              key={ing.id}
              className="ingredient-dropdown__item"
              onClick={() => handleSelect(ing)}
            >
              <span className="ingredient-dropdown__name">{ing.nombre}</span>
              <span className="ingredient-dropdown__tag">{ing.tag}</span>
              <span className="ingredient-dropdown__macros">
                {ing.kcal} kcal · {ing.prot}g prot
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RecipeModal({ ingredients, onClose, onSave, onAddIngredient }) {
  const [nombre,   setNombre]   = useState('')
  const [porciones, setPorciones] = useState(1)
  const [tag,      setTag]      = useState('🌅 Desayuno')
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [newIngredientMode, setNewIngredientMode] = useState(false)
  const [newIng, setNewIng] = useState({ nombre: '', tag: 'vegetal', kcal: '', prot: '', carbs: '', grasas: '' })

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
    onAddIngredient(created)
    handleSelectIngredient(created)
    setNewIngredientMode(false)
    setNewIng({ nombre: '', tag: 'vegetal', kcal: '', prot: '', carbs: '', grasas: '' })
  }

  function handleSave() {
    if (!nombre.trim()) { alert('El nombre es obligatorio'); return }
    if (porciones <= 0)  { alert('Las porciones deben ser mayor a 0'); return }

    const ingredientesValidos = selectedIngredients
      .filter(i => i.grams > 0)
      .map(i => ({ ingredienteId: i.ingredienteId, grams: parseFloat(i.grams) }))

    if (ingredientesValidos.length === 0) {
      alert('Agrega al menos un ingrediente con gramos')
      return
    }

    onSave({ id: generateId(), nombre, porciones, tag, ingredientes: ingredientesValidos })
    onClose()
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Nueva Receta</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Nombre de la receta</label>
            <input className="form-input" type="text" placeholder="Ej: Bowl de quinoa"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Porciones</label>
              <input className="form-input" type="number" min="1"
                value={porciones} onChange={e => setPorciones(parseInt(e.target.value) || 1)} />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={tag} onChange={e => setTag(e.target.value)}>
                <option>🌅 Desayuno</option>
                <option>🍽️ Almuerzo</option>
                <option>🌙 Cena</option>
                <option>🥪 Snack</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ingredientes</label>
            <IngredientSearch ingredients={ingredients} onSelect={handleSelectIngredient} />

            {selectedIngredients.length > 0 && (
              <div className="selected-ingredients">
                <div className="selected-ingredients__header">
                  <span>Ingrediente</span>
                  <span>Gramos</span>
                  <span />
                </div>
                {selectedIngredients.map((item, i) => (
                  <div key={i} className="selected-ingredient-row">
                    <span className="selected-ingredient-row__name">{item.nombre}</span>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={item.grams}
                      onChange={e => handleGramsChange(i, e.target.value)}
                    />
                    <button className="remove-btn" onClick={() => handleRemoveIngredient(i)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setNewIngredientMode(!newIngredientMode)}
              style={{ marginTop: 8 }}
            >
              {newIngredientMode ? '— Cancelar nuevo ingrediente' : '+ Ingrediente no encontrado'}
            </button>

            {newIngredientMode && (
              <div className="new-ingredient-form">
                <p className="form-label" style={{ marginBottom: 8 }}>
                  Nuevo ingrediente (valores por 100g)
                </p>
                <div className="new-ingredient-grid">
                  {[
                    { field: 'nombre', placeholder: 'Nombre', type: 'text', span: true },
                    { field: 'tag',    placeholder: 'Categoría', type: 'text' },
                    { field: 'kcal',   placeholder: 'kcal', type: 'number' },
                    { field: 'prot',   placeholder: 'prot g', type: 'number' },
                    { field: 'carbs',  placeholder: 'carbs g', type: 'number' },
                    { field: 'grasas', placeholder: 'grasa g', type: 'number' },
                  ].map(({ field, placeholder, type, span }) => (
                    <input
                      key={field}
                      className={`form-input${span ? ' new-ingredient-grid__full' : ''}`}
                      type={type}
                      placeholder={placeholder}
                      value={newIng[field]}
                      onChange={e => setNewIng(prev => ({ ...prev, [field]: e.target.value }))}
                    />
                  ))}
                </div>
                <button className="btn btn--primary btn--sm" onClick={handleSaveNewIngredient} style={{ marginTop: 8 }}>
                  Agregar al banco y a la receta
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost"   onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleSave}>Guardar receta</button>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal