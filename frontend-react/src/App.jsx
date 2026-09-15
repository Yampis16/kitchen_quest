// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import RecipesPage     from './pages/RecipesPage'
import WeeklyMenuPage  from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__icon">🍳</span>
        <span className="navbar__name">Kitchen Quest</span>
      </div>
      <div className="navbar__links">
        <NavLink
          to="/recetas"
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
        >
          Recetas
        </NavLink>
        <NavLink
          to="/menu-semanal"
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
        >
          Menú semanal
        </NavLink>
        <NavLink
          to="/mercado"
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
        >
          Mercado
        </NavLink>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/"              element={<RecipesPage />} />
          <Route path="/recetas"       element={<RecipesPage />} />
          <Route path="/menu-semanal"  element={<WeeklyMenuPage />} />
          <Route path="/mercado"       element={<ShoppingListPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App