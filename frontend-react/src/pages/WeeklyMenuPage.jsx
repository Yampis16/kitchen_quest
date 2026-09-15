// src/pages/WeeklyMenuPage.jsx
function WeeklyMenuPage() {
  return (
    <>
      <header className="section-header">
        <div>
          <h1 className="section-header__title">Menú Semanal</h1>
          <p className="section-header__subtitle">Planifica tu semana</p>
        </div>
      </header>

      <div className="empty-state">
        <span className="empty-state__icon">📅</span>
        <h2 className="empty-state__title">Tu menú semanal aparecerá aquí</h2>
        <p className="empty-state__text">
          Próximamente podrás seleccionar recetas para cada día de la semana.
        </p>
      </div>
    </>
  )
}

export default WeeklyMenuPage