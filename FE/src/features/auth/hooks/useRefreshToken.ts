/**
 * Refresh token hook — provides a function to refresh the access token.
 */
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@api/endpoints/auth'
import { useAuthStore } from '@features/auth/store/authStore'

export function useRefreshToken() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  return useMutation({
    mutationFn: () => authApi.refresh(refreshToken!),
    onSuccess: (response) => {
      const { access_token, refresh_token } = response.data
      const user = useAuthStore.getState().user
      setAuth(access_token, refresh_token, user!)
    },
    onError: () => {
      // Refresh failed - user needs to login again
      useAuthStore.getState().logout()
    },
  })
}
