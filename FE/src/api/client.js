/**
 * Axios instance — single configured HTTP client for the entire app.
 *
 * - Base URL from env
 * - Auth token injection via request interceptor
 * - Automatic token refresh on 401 responses
 * - Global error normalisation via response interceptor
 */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:18080'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Store for the getToken function (set after auth store is created)
let getAccessToken = null
export const setGetAccessToken = (fn) => { getAccessToken = fn }

// Request interceptor: inject Authorization header
apiClient.interceptors.request.use((config) => {
  if (getAccessToken) {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor: handle 401 with token refresh
let isRefreshing = false
let failedRequestsQueue = []

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedRequestsQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          // Import dynamically to avoid circular dependency
          const { useAuthStore } = await import('@features/auth/store/authStore')
          const { authApi } = await import('@api/endpoints/auth')
          
          const refreshToken = useAuthStore.getState().refreshToken
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          const response = await authApi.refresh(refreshToken)
          const { access_token, refresh_token } = response.data
          const user = useAuthStore.getState().user

          useAuthStore.getState().setAuth(access_token, refresh_token, user)
          
          processQueue(null, access_token)
          return apiClient(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError)
          const { useAuthStore } = await import('@features/auth/store/authStore')
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Queue the failed request
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve: () => {
            originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`
            resolve(apiClient(originalRequest))
          },
          reject,
        })
      })
    }

    // Normalize error message
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      'Network error'

    return Promise.reject(new Error(message))
  }
)
