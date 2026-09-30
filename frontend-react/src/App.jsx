// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import useKitchenStore from './store/useKitchenStore'
import RecipesPage      from './pages/RecipesPage'
import WeeklyMenuPage   from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import IngredientsPage  from './pages/IngredientsPage'

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-bold"
          style={{ color: 'var(--color-primary)' }}>
          <span className="text-2xl">🍳</span>
          <span>Kitchen Quest</span>
        </div>
        <div className="flex items-center gap-8">
          {[
            { to: '/recetas',      label: 'Recetas'      },
            { to: '/menu-semanal', label: 'Menú semanal' },
            { to: '/mercado',      label: 'Mercado'      },
            { to: '/ingredientes', label: 'Ingredientes' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `text-sm font-medium pb-0.5 border-b-2 transition-colors duration-200 ${
                  isActive
                    ? 'border-[#023d5b] text-[#023d5b]'
                    : 'border-transparent text-gray-500 hover:text-[#023d5b]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

function App() {
  const fetchAll = useKitchenStore(state => state.fetchAll)
  const loading  = useKitchenStore(state => state.loading)
  const error    = useKitchenStore(state => state.error)

  useEffect(() => {
    fetchAll()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center gap-4 flex flex-col">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-semibold">No se pudo conectar con el servidor</h2>
          <p className="text-sm text-gray-500">{error}</p>
          <button onClick={fetchAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white mx-auto"
            style={{ background: 'var(--color-primary)' }}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <span className="text-4xl animate-spin">⚙️</span>
          <p className="text-sm text-gray-500">Conectando con Kitchen Quest...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="max-w-6xl mx-auto px-8 py-10">
        <Routes>
          <Route path="/"             element={<RecipesPage />} />
          <Route path="/recetas"      element={<RecipesPage />} />
          <Route path="/menu-semanal" element={<WeeklyMenuPage />} />
          <Route path="/mercado"      element={<ShoppingListPage />} />
          <Route path="/ingredientes" element={<IngredientsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App