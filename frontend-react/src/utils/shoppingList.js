// src/utils/shoppingList.js

export function generarListaMercado(weeklyMenu, recipes, ingredients) {
  const acumulado = {}

  for (const day of Object.values(weeklyMenu)) {
    for (const slot of Object.values(day)) {
      if (!slot) continue

      const recipe = recipes.find(r => r.id === slot.recipeId)
      if (!recipe) continue

      const factor = slot.porciones / recipe.porciones

      for (const ri of recipe.ingredientes) {
        const gramsEscalados = Math.round(ri.grams * factor * 10) / 10
        const ing = ingredients.find(i => i.id === ri.ingredienteId)
        if (!ing) continue

        if (acumulado[ri.ingredienteId]) {
          acumulado[ri.ingredienteId].grams += gramsEscalados
        } else {
          acumulado[ri.ingredienteId] = {
            ingredienteId: ri.ingredienteId,
            nombre: ing.nombre,
            tag:    ing.tag,
            grams:  gramsEscalados
          }
        }
      }
    }
  }

  // Redondear totales y ordenar por tag
  return Object.values(acumulado)
    .map(item => ({ ...item, grams: Math.round(item.grams * 10) / 10 }))
    .sort((a, b) => a.tag.localeCompare(b.tag) || a.nombre.localeCompare(b.nombre))
}

export function agruparPorTag(lista) {
  return lista.reduce((grupos, item) => {
    if (!grupos[item.tag]) grupos[item.tag] = []
    grupos[item.tag].push(item)
    return grupos
  }, {})
}