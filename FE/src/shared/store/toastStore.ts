/** Toast notification store using zustand. */
import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  idCounter: number
  addToast: (message: string, type?: ToastType) => number
  removeToast: (id: number) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  idCounter: 0,

  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random()
    set((state) => ({
      idCounter: state.idCounter + 1,
      toasts: [...state.toasts, { id, message, type }],
    }))
    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  success: (message) => useToastStore.getState().addToast(message, 'success'),
  error: (message) => useToastStore.getState().addToast(message, 'error'),
  info: (message) => useToastStore.getState().addToast(message, 'info'),
  warning: (message) => useToastStore.getState().addToast(message, 'warning'),
}))
