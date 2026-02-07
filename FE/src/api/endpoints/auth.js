/**
 * Auth API endpoints — maps to BE modules/auth/router.py
 */
import { apiClient } from '../client'

export const authApi = {
  login: (email, password) =>
    apiClient.post('/api/login', { email, password }),

  register: (email, password) =>
    apiClient.post('/api/register', { email, password }),

  refresh: (refreshToken) =>
    apiClient.post('/api/refresh', { refresh_token: refreshToken }),
}
