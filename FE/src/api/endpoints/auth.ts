/**
 * Auth API endpoints — maps to BE modules/auth/router.py
 */
import { apiClient } from '../client'

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: { id: number; email: string }
}

export interface RegisterResponse {
  message: string
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/login', { email, password }),

  register: (email: string, password: string) =>
    apiClient.post<RegisterResponse>('/api/register', { email, password }),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/api/refresh', { refresh_token: refreshToken }),
}
