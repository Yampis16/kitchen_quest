// src/components/RecipeModal.jsx
import { useState } from 'react'

function IngredientRow({ index, ingredient, onChange, onRemove }) {
  const fields = ['name', 'grams', 'cal', 'protein', 'carbs', 'fat']
  const placeholders = ['Nombre', '0', '0', '0', '0', '0']

  return (
    <div className="ingredient-row">
      {fields.map((field, i) => (
        <input
          key={field}
          className="form-input"
          type={field === 'name' ? 'text' : 'number'}
          placeholder={placeholders[i]}
          value={ingredient[field]}
          onChange={e => onChange(index, field, e.target.value)}
          min={field !== 'name' ? 0 : undefined}
        />
      ))}
      <button className="remove-btn" onClick={() => onRemove(index)}>×</button>
    </div>
  )
}

const emptyIngredient = () => ({
  name: '', grams: '', cal: '', protein: '', carbs: '', fat: ''
})

function RecipeModal({ onClose, onSave }) {
  const [name, setName]           = useState('')
  const [portions, setPortions]   = useState(1)
  const [tag, setTag]             = useState('🌅 Desayuno')
  const [ingredients, setIngredients] = useState([emptyIngredient()])

  function handleIngredientChange(index, field, value) {
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  function addIngredient() {
    setIngredients(prev => [...prev, emptyIngredient()])
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    if (!name.trim()) { alert('El nombre es obligatorio'); return }
    if (portions <= 0) { alert('Las porciones deben ser mayor a 0'); return }

    const validIngredients = ingredients
      .filter(ing => ing.name.trim())
      .map(ing => ({
        name:    ing.name,
        grams:   parseFloat(ing.grams)   || 0,
        cal:     parseFloat(ing.cal)     || 0,
        protein: parseFloat(ing.protein) || 0,
        carbs:   parseFloat(ing.carbs)   || 0,
        fat:     parseFloat(ing.fat)     || 0,
      }))

    if (validIngredients.length === 0) {
      alert('Agrega al menos un ingrediente')
      return
    }

    onSave({ id: Date.now(), name, portions, tag, ingredients: validIngredients })
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        <div className="modal__header">
          <h2 className="modal__title">Nueva Receta</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Nombre de la receta</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ej: Bowl de quinoa"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Porciones</label>
            <input
              className="form-input"
              type="number"
              min="1"
              value={portions}
              onChange={e => setPortions(parseInt(e.target.value) || 1)}
            />
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

          <div className="form-group">
            <label className="form-label">Ingredientes</label>

            {ingredients.length > 0 && (
              <div className="ingredient-header">
                <span>Ingrediente</span>
                <span>gramos</span>
                <span>kcal/100g</span>
                <span>prot</span>
                <span>carbs</span>
                <span>grasa</span>
                <span />
              </div>
            )}

            {ingredients.map((ing, i) => (
              <IngredientRow
                key={i}
                index={i}
                ingredient={ing}
                onChange={handleIngredientChange}
                onRemove={removeIngredient}
              />
            ))}

            <button className="btn btn--ghost btn--sm" onClick={addIngredient} style={{ marginTop: 8 }}>
              + Agregar ingrediente
            </button>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleSave}>Guardar receta</button>
        </div>

      </div>
    </div>
  )
}

export default RecipeModal