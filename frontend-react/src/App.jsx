// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import useKitchenStore from './store/useKitchenStore'
import useAuthStore    from './store/useAuthStore'
import RecipesPage      from './pages/RecipesPage'
import WeeklyMenuPage   from './pages/WeeklyMenuPage'
import ShoppingListPage from './pages/ShoppingListPage'
import IngredientsPage  from './pages/IngredientsPage'
import LoginPage        from './pages/LoginPage'
import GroupsPage from './pages/GroupsPage'

function Navbar() {
  const { user, logout } = useAuthStore()

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
            { to: '/grupos', label: 'Grupos' },
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.nombre}</span>
          <button
            onClick={logout}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex md:hidden">
      {[
        { to: '/recetas',      icon: '🍳', label: 'Recetas'   },
        { to: '/menu-semanal', icon: '📅', label: 'Menú'      },
        { to: '/mercado',      icon: '🛒', label: 'Mercado'   },
        { to: '/ingredientes', icon: '🥕', label: 'Ingredientes' },
        { to: '/grupos',       icon: '👥', label: 'Grupos'    },
      ].map(({ to, icon, label }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-[#023d5b] font-medium' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function ProtectedApp() {
  const fetchAll = useKitchenStore(state => state.fetchAll)
  const loading  = useKitchenStore(state => state.loading)
  const error    = useKitchenStore(state => state.error)

  useEffect(() => { fetchAll() }, [])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex flex-col gap-4">
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-4">
        <span className="text-4xl animate-spin">⚙️</span>
        <p className="text-sm text-gray-500">Conectando con Kitchen Quest...</p>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-10">
        <Routes>
          <Route path="/"             element={<RecipesPage />} />
          <Route path="/recetas"      element={<RecipesPage />} />
          <Route path="/menu-semanal" element={<WeeklyMenuPage />} />
          <Route path="/mercado"      element={<ShoppingListPage />} />
          <Route path="/ingredientes" element={<IngredientsPage />} />
          <Route path="/grupos" element={<GroupsPage />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  )
}

function App() {
  const user = useAuthStore(state => state.user)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/recetas" replace /> : <LoginPage />
        }/>
        <Route path="/*" element={
          user ? <ProtectedApp /> : <Navigate to="/login" replace />
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App