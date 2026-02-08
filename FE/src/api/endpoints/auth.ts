/**
 * Auth API endpoints — maps to BE modules/auth/router.py
 */
import { apiClient } from '../client'
import { User } from '@features/auth/store/authStore'

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

interface RegisterResponse {
  access_token: string
  refresh_token: string
  user: User
}

interface RefreshResponse {
  access_token: string
  refresh_token: string
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/api/login', { email, password }),

  register: (email: string, password: string) =>
    apiClient.post<RegisterResponse>('/api/register', { email, password }),

  refresh: (refreshToken: string) =>
    apiClient.post<RefreshResponse>('/api/refresh', { refresh_token: refreshToken }),
}
