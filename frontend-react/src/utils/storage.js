// src/utils/storage.js
import { sampleIngredients, sampleRecipes } from '../data/sampleData'

export function loadIngredients() {
  const saved = localStorage.getItem('kq-ingredients')
  if (saved) {
    try { return JSON.parse(saved) }
    catch { return sampleIngredients }
  }
  return sampleIngredients
}

export function saveIngredients(ingredients) {
  localStorage.setItem('kq-ingredients', JSON.stringify(ingredients))
}

export function loadRecipes() {
  const saved = localStorage.getItem('kq-recipes')
  if (saved) {
    try { return JSON.parse(saved) }
    catch { return sampleRecipes }
  }
  return sampleRecipes
}

export function saveRecipes(recipes) {
  localStorage.setItem('kq-recipes', JSON.stringify(recipes))
}

export function generateId() {
  return Date.now()
}