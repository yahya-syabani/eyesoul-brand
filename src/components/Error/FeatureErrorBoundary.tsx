'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { reportError } from '@/lib/reportError'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  featureName?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error, { source: 'FeatureErrorBoundary', featureName: this.props.featureName, errorInfo })
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="feature-error-boundary bg-surface rounded-xl p-6 text-center">
          <Icon.WarningCircle size={48} className="text-red mx-auto mb-4" />
          <h3 className="heading6 mb-2">
            {this.props.featureName ? `${this.props.featureName} Error` : 'Something went wrong'}
          </h3>
          <p className="caption1 text-secondary mb-4">
            {this.props.featureName
              ? `We encountered an error loading ${this.props.featureName.toLowerCase()}. Please try refreshing this section.`
              : 'We encountered an error. Please try refreshing this section.'}
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details className="text-left mb-4 p-3 bg-white rounded-lg">
              <summary className="caption2 font-semibold mb-2 cursor-pointer">Error Details (Development Only)</summary>
              <pre className="caption2 text-red overflow-auto text-xs">{this.state.error.toString()}</pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            className="button-main text-sm py-2 px-4"
            type="button"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default FeatureErrorBoundary

