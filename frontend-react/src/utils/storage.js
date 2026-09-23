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

const emptyWeek = () => {
  const days  = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
  const meals = ['desayuno','almuerzo','cena','snack']
  return Object.fromEntries(days.map(day => [
    day,
    Object.fromEntries(meals.map(meal => [meal, null]))
  ]))
}

export function loadWeeklyMenu() {
  const saved = localStorage.getItem('kq-weekly-menu')
  if (saved) {
    try { return JSON.parse(saved) }
    catch { return emptyWeek() }
  }
  return emptyWeek()
}

export function saveWeeklyMenu(menu) {
  localStorage.setItem('kq-weekly-menu', JSON.stringify(menu))
}