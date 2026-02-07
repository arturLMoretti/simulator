/**
 * Application providers — composes all context providers in one place.
 */
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import ErrorBoundary from '@components/ErrorBoundary'
import { ToastContainer } from '@components/ToastContainer'
import { queryClient } from './queryClient'
import { router } from '../router'
import { useAuthStore } from '@features/auth/store/authStore'
import { setGetAccessToken } from '@api/client'

export default function AppProviders() {
  // Set up the auth interceptor with access token getter
  useEffect(() => {
    setGetAccessToken(() => useAuthStore.getState().accessToken)
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
