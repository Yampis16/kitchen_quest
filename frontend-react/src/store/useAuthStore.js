// src/store/useAuthStore.js
import { create } from 'zustand'
import { api } from '../utils/api'

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('kq-user') || 'null'),
  token: localStorage.getItem('kq-token') || null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const data = await api.login({ email, password })
      localStorage.setItem('kq-token', data.access_token)
      localStorage.setItem('kq-user',  JSON.stringify(data.user))
      set({ user: data.user, token: data.access_token, loading: false })
      return true
    } catch (e) {
      set({ error: e.message, loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('kq-token')
    localStorage.removeItem('kq-user')
    set({ user: null, token: null })
  },
}))

export default useAuthStore