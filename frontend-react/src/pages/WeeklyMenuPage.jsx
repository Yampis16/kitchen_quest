function WeeklyMenuPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Menú Semanal</h1>
        <p className="text-sm text-gray-500 mt-1">Planifica tu semana</p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
        <span className="text-5xl">📅</span>
        <h2 className="text-xl font-semibold">Tu menú semanal aparecerá aquí</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Próximamente podrás seleccionar recetas para cada día de la semana.
        </p>
      </div>
    </>
  )
}

export default WeeklyMenuPage