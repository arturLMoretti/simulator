/** Toast notification store using zustand. */
import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],
  idCounter: 0,

  /** Add a new toast. */
  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random()
    set((state) => ({
      idCounter: state.idCounter + 1,
      toasts: [...state.toasts, { id, message, type }],
    }))
    return id
  },

  /** Remove a toast by id. */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  /** Convenience methods. */
  success: (message) => useToastStore.getState().addToast(message, 'success'),
  error: (message) => useToastStore.getState().addToast(message, 'error'),
  info: (message) => useToastStore.getState().addToast(message, 'info'),
  warning: (message) => useToastStore.getState().addToast(message, 'warning'),
}))
