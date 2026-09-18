// src/utils/nutrition.js

export function calcularMacrosIngrediente(recetaIngrediente, banco) {
  const ing = banco.find(i => i.id === recetaIngrediente.ingredienteId)
  if (!ing) return null

  const factor = recetaIngrediente.grams / 100
  return {
    nombre: ing.nombre,
    tag:    ing.tag,
    grams:  recetaIngrediente.grams,
    kcal:   Math.round(ing.kcal   * factor * 10) / 10,
    prot:   Math.round(ing.prot   * factor * 10) / 10,
    carbs:  Math.round(ing.carbs  * factor * 10) / 10,
    grasas: Math.round(ing.grasas * factor * 10) / 10,
  }
}

export function calcularNutricionReceta(recipe, banco) {
  const totals = { kcal: 0, prot: 0, carbs: 0, grasas: 0 }

  for (const ri of recipe.ingredientes) {
    const macros = calcularMacrosIngrediente(ri, banco)
    if (!macros) continue
    totals.kcal   += macros.kcal
    totals.prot   += macros.prot
    totals.carbs  += macros.carbs
    totals.grasas += macros.grasas
  }

  const round = n => Math.round(n / recipe.porciones * 10) / 10

  return {
    kcal:   round(totals.kcal),
    prot:   round(totals.prot),
    carbs:  round(totals.carbs),
    grasas: round(totals.grasas),
  }
}