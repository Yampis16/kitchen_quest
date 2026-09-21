// src/store/useKitchenStore.js
import { create } from 'zustand'
import {
  loadRecipes, saveRecipes,
  loadIngredients, saveIngredients,
  generateId
} from '../utils/storage'

const useKitchenStore = create((set, get) => ({

  // ── Estado ────────────────────────────────────────
  recipes:     loadRecipes(),
  ingredients: loadIngredients(),

  // ── Acciones de recetas ───────────────────────────
  addRecipe: (recipeData) => {
    const newRecipe = { id: generateId(), ...recipeData }
    const recipes   = [...get().recipes, newRecipe]
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

  // ── Acciones de ingredientes ──────────────────────
  addIngredient: (ingredientData) => {
    const newIngredient = { id: generateId(), ...ingredientData }
    const ingredients   = [...get().ingredients, newIngredient]
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

}))

export default useKitchenStore