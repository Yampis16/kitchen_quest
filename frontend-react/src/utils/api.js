// src/utils/api.js
const BASE_URL = 'http://localhost:8000'

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Ingredients
  getIngredients:    ()       => request('GET',    '/ingredients/'),
  createIngredient:  (data)   => request('POST',   '/ingredients/', data),
  updateIngredient:  (id, data) => request('PUT',  `/ingredients/${id}`, data),
  deleteIngredient:  (id)     => request('DELETE', `/ingredients/${id}`),

  // Recipes
  getRecipes:    ()         => request('GET',    '/recipes/'),
  createRecipe:  (data)     => request('POST',   '/recipes/', data),
  updateRecipe:  (id, data) => request('PUT',    `/recipes/${id}`, data),
  deleteRecipe:  (id)       => request('DELETE', `/recipes/${id}`),
}