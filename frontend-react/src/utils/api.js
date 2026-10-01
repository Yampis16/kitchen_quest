// src/utils/api.js
const BASE_URL = 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('kq-token')
}

async function request(method, path, body = null) {
  const token = getToken()

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${path}`, options)

  if (response.status === 401) {
    // Token expirado o inválido — limpia sesión
    localStorage.removeItem('kq-token')
    localStorage.removeItem('kq-user')
    window.location.href = '/login'
    return
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Auth
  register: (data)       => request('POST', '/auth/register', data),
  login:    (data)       => request('POST', '/auth/login', data),
  getMe:    ()           => request('GET',  '/auth/me'),

  // Ingredients
  getIngredients:   ()         => request('GET',    '/ingredients/'),
  createIngredient: (data)     => request('POST',   '/ingredients/', data),
  updateIngredient: (id, data) => request('PUT',    `/ingredients/${id}`, data),
  deleteIngredient: (id)       => request('DELETE', `/ingredients/${id}`),

  // Recipes
  getRecipes:   ()         => request('GET',    '/recipes/'),
  createRecipe: (data)     => request('POST',   '/recipes/', data),
  updateRecipe: (id, data) => request('PUT',    `/recipes/${id}`, data),
  deleteRecipe: (id)       => request('DELETE', `/recipes/${id}`),
}