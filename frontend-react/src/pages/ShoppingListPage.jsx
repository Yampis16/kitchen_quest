// src/pages/ShoppingListPage.jsx
function ShoppingListPage() {
  return (
    <>
      <header className="section-header">
        <div>
          <h1 className="section-header__title">Lista del Mercado</h1>
          <p className="section-header__subtitle">Generada automáticamente</p>
        </div>
      </header>

      <div className="empty-state">
        <span className="empty-state__icon">🛒</span>
        <h2 className="empty-state__title">Tu lista aparecerá aquí</h2>
        <p className="empty-state__text">
          Cuando planifiques tu menú semanal, generaremos la lista de mercado automáticamente.
        </p>
      </div>
    </>
  )
}

export default ShoppingListPage