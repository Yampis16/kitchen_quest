// src/store/useKitchenStore.js
import { create } from 'zustand'
import { api } from '../utils/api'
import { loadWeeklyMenu, saveWeeklyMenu } from '../utils/storage'

const DAYS  = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
const MEALS = ['desayuno','almuerzo','cena','snack']

const emptyWeek = () =>
  Object.fromEntries(DAYS.map(day => [
    day,
    Object.fromEntries(MEALS.map(meal => [meal, null]))
  ]))

const useKitchenStore = create((set, get) => ({

  // ── Estado ────────────────────────────────────────
  recipes:     [],
  ingredients: [],
  weeklyMenu:  loadWeeklyMenu(),
  loading:     true,
  error:       null,

  // ── Carga inicial desde la API ────────────────────
  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [recipes, ingredients] = await Promise.all([
        api.getRecipes(),
        api.getIngredients(),
      ])
      set({ recipes, ingredients, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  // ── Recetas ───────────────────────────────────────
  addRecipe: async (recipeData) => {
    // Optimistic — agrega inmediatamente con id temporal
    const tempId  = `temp_${Date.now()}`
    const optimistic = { id: tempId, ...recipeData }
    set(state => ({ recipes: [...state.recipes, optimistic] }))

    try {
      const saved = await api.createRecipe(recipeData)
      // Reemplaza el temporal con el real
      set(state => ({
        recipes: state.recipes.map(r => r.id === tempId ? saved : r)
      }))
    } catch (e) {
      // Deshace si falla
      set(state => ({ recipes: state.recipes.filter(r => r.id !== tempId) }))
      throw e
    }
  },

  updateRecipe: async (updated) => {
    const previous = get().recipes.find(r => r.id === updated.id)
    set(state => ({ recipes: state.recipes.map(r => r.id === updated.id ? updated : r) }))
    try {
      const saved = await api.updateRecipe(updated.id, updated)
      set(state => ({ recipes: state.recipes.map(r => r.id === saved.id ? saved : r) }))
    } catch (e) {
      set(state => ({ recipes: state.recipes.map(r => r.id === previous.id ? previous : r) }))
      throw e
    }
  },

  deleteRecipe: async (id) => {
    const previous = get().recipes.find(r => r.id === id)
    set(state => ({ recipes: state.recipes.filter(r => r.id !== id) }))
    try {
      await api.deleteRecipe(id)
    } catch (e) {
      set(state => ({ recipes: [...state.recipes, previous] }))
      throw e
    }
  },

  // ── Ingredientes ──────────────────────────────────
  addIngredient: async (ingredientData) => {
    const tempId     = `temp_${Date.now()}`
    const optimistic = { id: tempId, ...ingredientData }
    set(state => ({ ingredients: [...state.ingredients, optimistic] }))
    try {
      const saved = await api.createIngredient(ingredientData)
      set(state => ({
        ingredients: state.ingredients.map(i => i.id === tempId ? saved : i)
      }))
      return saved
    } catch (e) {
      set(state => ({ ingredients: state.ingredients.filter(i => i.id !== tempId) }))
      throw e
    }
  },

  updateIngredient: async (updated) => {
    const previous = get().ingredients.find(i => i.id === updated.id)
    set(state => ({ ingredients: state.ingredients.map(i => i.id === updated.id ? updated : i) }))
    try {
      const saved = await api.updateIngredient(updated.id, updated)
      set(state => ({ ingredients: state.ingredients.map(i => i.id === saved.id ? saved : i) }))
    } catch (e) {
      set(state => ({ ingredients: state.ingredients.map(i => i.id === previous.id ? previous : i) }))
      throw e
    }
  },

  deleteIngredient: async (id) => {
    const previous = get().ingredients.find(i => i.id === id)
    set(state => ({ ingredients: state.ingredients.filter(i => i.id !== id) }))
    try {
      await api.deleteIngredient(id)
    } catch (e) {
      set(state => ({ ingredients: [...state.ingredients, previous] }))
      throw e
    }
  },

  // ── Menú semanal (sigue en localStorage) ─────────
  setMeal: (day, meal, recipeId, porciones) => {
    const weeklyMenu = {
      ...get().weeklyMenu,
      [day]: { ...get().weeklyMenu[day], [meal]: recipeId ? { recipeId, porciones } : null }
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