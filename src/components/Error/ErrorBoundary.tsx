'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from '@/i18n/routing'
import { reportError } from '@/lib/reportError'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error, { source: 'ErrorBoundary', errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
            <div className="heading3 mb-4">Something went wrong</div>
            <p className="body1 text-secondary mb-6">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-6 p-4 bg-surface rounded-lg">
                <summary className="caption1 font-semibold mb-2 cursor-pointer">Error Details (Development Only)</summary>
                <pre className="caption2 text-red overflow-auto">{this.state.error.toString()}</pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="button-main"
              >
                Reload Page
              </button>
              <Link href="/" className="button-main bg-white border border-black text-black hover:bg-black hover:text-white">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

