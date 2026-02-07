/**
 * Global error boundary — catches unhandled React errors.
 */
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-slate-400 mb-4">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
