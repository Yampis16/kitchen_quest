function ShoppingListPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lista del Mercado</h1>
        <p className="text-sm text-gray-500 mt-1">Generada automáticamente</p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
        <span className="text-5xl">🛒</span>
        <h2 className="text-xl font-semibold">Tu lista aparecerá aquí</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Cuando planifiques tu menú semanal, generaremos la lista de mercado automáticamente.
        </p>
      </div>
    </>
  )
}

export default ShoppingListPage