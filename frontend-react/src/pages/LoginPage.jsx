// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore    from '../store/useAuthStore'
import useKitchenStore from '../store/useKitchenStore'
import { api } from '../utils/api'

function LoginPage() {
  const [mode, setMode]       = useState('login') // 'login' | 'register'
  const [nombre, setNombre]   = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')

  const { login, error, loading } = useAuthStore()
  const fetchAll = useKitchenStore(state => state.fetchAll)
  const navigate = useNavigate()

  async function handleSubmit() {
    if (mode === 'register') {
      try {
        await api.register({ nombre, email, password })
      } catch (e) {
        return
      }
    }
    const ok = await login(email, password)
    if (ok) {
      await fetchAll()
      navigate('/recetas')
    }
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#023d5b] transition-colors"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf4e5] px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍳</span>
          <h1 className="text-2xl font-bold mt-3" style={{ color: 'var(--color-primary)' }}>
            Kitchen Quest
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </p>
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <input className={inputCls} type="text" placeholder="Tu nombre"
                value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <input className={inputCls} type="email" placeholder="tu@email.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-500">Contraseña</label>
            <input className={inputCls} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ background: 'var(--color-primary)' }}
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </div>

        {/* Toggle login/register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          {' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>

      </div>
    </div>
  )
}

export default LoginPage