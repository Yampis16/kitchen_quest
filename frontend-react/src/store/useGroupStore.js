// src/store/useGroupStore.js
import { create } from 'zustand'
import { api } from '../utils/api'

const useGroupStore = create((set, get) => ({
  groups:        [],
  groupRecipes:  [],
  activeGroup:   null,
  loading:       false,
  error:         null,

  fetchGroups: async () => {
    set({ loading: true })
    try {
      const groups = await api.getMyGroups()
      set({ groups, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  createGroup: async (nombre) => {
    try {
      const group = await api.createGroup({ nombre })
      set(state => ({ groups: [...state.groups, group] }))
      return group
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  joinGroup: async (codigo) => {
    try {
      const group = await api.joinGroup({ codigo })
      set(state => ({ groups: [...state.groups, group] }))
      return group
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  leaveGroup: async (id) => {
    try {
      await api.leaveGroup(id)
      set(state => ({ groups: state.groups.filter(g => g.id !== id) }))
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  fetchGroupRecipes: async (groupId) => {
    set({ loading: true, activeGroup: groupId })
    try {
      const recipes = await api.getGroupRecipes(groupId)
      set({ groupRecipes: recipes, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  toggleShare: async (recipeId) => {
    try {
      const result = await api.toggleShare(recipeId)
      return result.compartida
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },
}))

export default useGroupStore