/**
 * Register mutation hook — wraps authApi.register with TanStack Query.
 */
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@api/endpoints/auth'

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }) => authApi.register(email, password),
  })
}
