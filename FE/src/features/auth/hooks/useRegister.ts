/**
 * Register mutation hook — wraps authApi.register with TanStack Query.
 */
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@api/endpoints/auth'

interface RegisterCredentials {
  email: string
  password: string
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: RegisterCredentials) => authApi.register(email, password),
  })
}
