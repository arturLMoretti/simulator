/**
 * Login mutation hook — wraps authApi.login with TanStack Query.
 */
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@api/endpoints/auth'
import { useAuthStore } from '@features/auth/store/authStore'

interface LoginCredentials {
  email: string
  password: string
}

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) => authApi.login(email, password),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data
      setAuth(access_token, refresh_token, user)
      navigate('/dashboard', { replace: true })
    },
  })
}
