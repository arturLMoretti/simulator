/// <reference types="vitest/globals" />
import { useAuthStore } from '../store/authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset store state
    useAuthStore.setState({ accessToken: null, refreshToken: null, user: null })
  })

  describe('setAuth', () => {
    it('should set access token, refresh token and user', () => {
      const tokens = { accessToken: 'test-access', refreshToken: 'test-refresh', user: { id: 1, email: 'test@example.com' } }
      
      useAuthStore.getState().setAuth(tokens.accessToken, tokens.refreshToken, tokens.user)
      
      expect(useAuthStore.getState().accessToken).toBe('test-access')
      expect(useAuthStore.getState().refreshToken).toBe('test-refresh')
      expect(useAuthStore.getState().user).toEqual({ id: 1, email: 'test@example.com' })
    })

    it('should persist data to localStorage', () => {
      useAuthStore.getState().setAuth('token', 'refresh', { id: 1, email: 'test@example.com' })
      
      const stored = localStorage.getItem('auth-storage')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.state.accessToken).toBe('token')
      expect(parsed.state.refreshToken).toBe('refresh')
      expect(parsed.state.user).toEqual({ id: 1, email: 'test@example.com' })
    })
  })

  describe('logout', () => {
    it('should clear all auth state', () => {
      // First set some auth data
      useAuthStore.getState().setAuth('token', 'refresh', { id: 1, email: 'test@example.com' })
      
      // Then logout
      useAuthStore.getState().logout()
      
      expect(useAuthStore.getState().accessToken).toBeNull()
      expect(useAuthStore.getState().refreshToken).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('should clear data from localStorage', () => {
      useAuthStore.getState().setAuth('token', 'refresh', { id: 1, email: 'test@example.com' })
      
      useAuthStore.getState().logout()
      
      const stored = localStorage.getItem('auth-storage')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.state.accessToken).toBeNull()
      expect(parsed.state.refreshToken).toBeNull()
      expect(parsed.state.user).toBeNull()
    })
  })

  describe('initial state', () => {
    it('should have null values initially', () => {
      useAuthStore.setState({ accessToken: null, refreshToken: null, user: null })
      
      expect(useAuthStore.getState().accessToken).toBeNull()
      expect(useAuthStore.getState().refreshToken).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
