// src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { loadRecipes, saveRecipes, loadIngredients, saveIngredients } from './utils/storage'
import RecipesPage      from './pages/RecipesPage'
import WeeklyMenuPage   from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__icon">🍳</span>
        <span className="navbar__name">Kitchen Quest</span>
      </div>
      <div className="navbar__links">
        {[
          { to: '/recetas',      label: 'Recetas'      },
          { to: '/menu-semanal', label: 'Menú semanal' },
          { to: '/mercado',      label: 'Mercado'      },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function App() {
  const [recipes,     setRecipes]     = useState(loadRecipes)
  const [ingredients, setIngredients] = useState(loadIngredients)

  function handleSaveRecipe(newRecipe) {
    const updated = [...recipes, newRecipe]
    setRecipes(updated)
    saveRecipes(updated)
  }

  function handleAddIngredient(newIngredient) {
    const updated = [...ingredients, newIngredient]
    setIngredients(updated)
    saveIngredients(updated)
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={
            <RecipesPage
              recipes={recipes}
              ingredients={ingredients}
              onSaveRecipe={handleSaveRecipe}
              onAddIngredient={handleAddIngredient}
            />
          }/>
          <Route path="/recetas" element={
            <RecipesPage
              recipes={recipes}
              ingredients={ingredients}
              onSaveRecipe={handleSaveRecipe}
              onAddIngredient={handleAddIngredient}
            />
          }/>
          <Route path="/menu-semanal"  element={<WeeklyMenuPage  recipes={recipes} ingredients={ingredients} />} />
          <Route path="/mercado"       element={<ShoppingListPage recipes={recipes} ingredients={ingredients} />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App