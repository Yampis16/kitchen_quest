import { create } from 'zustand'
import {
  loadRecipes, saveRecipes,
  loadIngredients, saveIngredients,
  loadWeeklyMenu, saveWeeklyMenu,
  generateId
} from '../utils/storage'

const DAYS    = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
const MEALS   = ['desayuno','almuerzo','cena','snack']

const emptyWeek = () =>
  Object.fromEntries(DAYS.map(day => [
    day,
    Object.fromEntries(MEALS.map(meal => [meal, null]))
  ]))

const useKitchenStore = create((set, get) => ({

  // Estado existente
  recipes:     loadRecipes(),
  ingredients: loadIngredients(),

  // Nuevo
  weeklyMenu: loadWeeklyMenu(),

  // Acciones existentes de recetas
  addRecipe: (recipeData) => {
    const recipes = [...get().recipes, { id: generateId(), ...recipeData }]
    set({ recipes })
    saveRecipes(recipes)
  },
  updateRecipe: (updated) => {
    const recipes = get().recipes.map(r => r.id === updated.id ? updated : r)
    set({ recipes })
    saveRecipes(recipes)
  },
  deleteRecipe: (id) => {
    const recipes = get().recipes.filter(r => r.id !== id)
    set({ recipes })
    saveRecipes(recipes)
  },

  // Acciones existentes de ingredientes
  addIngredient: (ingredientData) => {
    const ingredients = [...get().ingredients, { id: generateId(), ...ingredientData }]
    set({ ingredients })
    saveIngredients(ingredients)
  },
  updateIngredient: (updated) => {
    const ingredients = get().ingredients.map(i => i.id === updated.id ? updated : i)
    set({ ingredients })
    saveIngredients(ingredients)
  },
  deleteIngredient: (id) => {
    const ingredients = get().ingredients.filter(i => i.id !== id)
    set({ ingredients })
    saveIngredients(ingredients)
  },

  // Acciones del menú semanal
  setMeal: (day, meal, recipeId, porciones) => {
    const weeklyMenu = {
      ...get().weeklyMenu,
      [day]: {
        ...get().weeklyMenu[day],
        [meal]: recipeId ? { recipeId, porciones } : null
      }
    }
    set({ weeklyMenu })
    saveWeeklyMenu(weeklyMenu)
  },

  clearDay: (day) => {
    const weeklyMenu = {
      ...get().weeklyMenu,
      [day]: Object.fromEntries(MEALS.map(meal => [meal, null]))
    }
    set({ weeklyMenu })
    saveWeeklyMenu(weeklyMenu)
  },

  clearWeek: () => {
    const weeklyMenu = emptyWeek()
    set({ weeklyMenu })
    saveWeeklyMenu(weeklyMenu)
  },

}))

export default useKitchenStore