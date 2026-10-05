// src/pages/GroupsPage.jsx
import { useState, useEffect } from 'react'
import useGroupStore    from '../store/useGroupStore'
import useKitchenStore  from '../store/useKitchenStore'
import useAuthStore     from '../store/useAuthStore'

// ── Modal crear/unirse ───────────────────────────────────────
function GroupModal({ onClose }) {
  const [mode, setMode]     = useState('create')
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const { createGroup, joinGroup } = useGroupStore()

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      if (mode === 'create') {
        await createGroup(nombre)
      } else {
        await joinGroup(codigo.toUpperCase())
      }
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-[#fdf4e5] focus:outline-none focus:border-[#023d5b] transition-colors"

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Grupo Familiar</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1 gap-1">
            {['create','join'].map(m => (
              <button key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === m
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={mode === m ? { background: 'var(--color-primary)' } : {}}
              >
                {m === 'create' ? 'Crear grupo' : 'Unirse a grupo'}
              </button>
            ))}
          </div>

          {mode === 'create' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Nombre del grupo</label>
              <input className={inputCls} type="text" placeholder="Ej: Familia García"
                value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Código de invitación</label>
              <input className={inputCls} type="text" placeholder="Ej: XT5MN9I5"
                value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
                maxLength={8} style={{ letterSpacing: '0.15em', fontFamily: 'monospace' }} />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}>
            {loading ? 'Cargando...' : mode === 'create' ? 'Crear' : 'Unirse'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tarjeta de grupo ─────────────────────────────────────────
function GroupCard({ group, onViewRecipes, onLeave }) {
  const { user } = useAuthStore()
  const isAdmin  = group.admin_id === user?.id

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{group.nombre}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {group.members.length} miembro{group.members.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}>
            Admin
          </span>
        )}
      </div>

      {/* Código de invitación */}
      {isAdmin && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Código de invitación</p>
            <p className="font-mono font-bold tracking-widest text-lg"
              style={{ color: 'var(--color-primary)' }}>
              {group.codigo}
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(group.codigo)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            Copiar
          </button>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onViewRecipes(group.id)}
          className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: 'var(--color-primary)' }}
        >
          Ver recetas del grupo
        </button>
        {!isAdmin && (
          <button
            onClick={() => onLeave(group.id)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            Salir
          </button>
        )}
      </div>
    </div>
  )
}

// ── Vista de recetas del grupo ───────────────────────────────
function GroupRecipesView({ groupId, groupName, onBack }) {
  const { groupRecipes, fetchGroupRecipes, loading } = useGroupStore()
  const ingredients = useKitchenStore(state => state.ingredients)

  useEffect(() => {
    fetchGroupRecipes(groupId)
  }, [groupId])

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Volver
        </button>
        <div>
          <h1 className="text-3xl font-bold">Recetas de {groupName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {groupRecipes.length} receta{groupRecipes.length !== 1 ? 's' : ''} compartida{groupRecipes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando recetas...</p>
      ) : groupRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
          <span className="text-5xl">🍳</span>
          <h2 className="text-xl font-semibold">Sin recetas compartidas todavía</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Los miembros del grupo pueden compartir sus recetas desde la vista de Recetas.
          </p>
        </div>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {groupRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{recipe.nombre}</h2>
              <p className="text-sm text-gray-500 mt-1">{recipe.tag} · {recipe.porciones} porciones</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ── Vista principal ──────────────────────────────────────────
function GroupsPage() {
  const [showModal, setShowModal]       = useState(false)
  const [viewingGroup, setViewingGroup] = useState(null)

  const { groups, fetchGroups, leaveGroup } = useGroupStore()

  useEffect(() => { fetchGroups() }, [])

  if (viewingGroup) {
    const group = groups.find(g => g.id === viewingGroup)
    return (
      <GroupRecipesView
        groupId={viewingGroup}
        groupName={group?.nombre}
        onBack={() => setViewingGroup(null)}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Grupos Familiares</h1>
          <p className="text-sm text-gray-500 mt-1">
            {groups.length} grupo{groups.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
          style={{ background: 'var(--color-primary)' }}
        >
          + Grupo
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
          <span className="text-5xl">👨‍👩‍👧</span>
          <h2 className="text-xl font-semibold">Sin grupos todavía</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Crea un grupo familiar e invita a tus familiares con el código de invitación.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            Crear mi primer grupo
          </button>
        </div>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onViewRecipes={setViewingGroup}
              onLeave={leaveGroup}
            />
          ))}
        </div>
      )}

      {showModal && <GroupModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default GroupsPage