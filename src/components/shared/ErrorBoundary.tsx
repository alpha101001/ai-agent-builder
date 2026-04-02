import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

// ################ Error Boundary Component ##################
// React class component that catches rendering errors in child
// components and displays a friendly fallback UI instead of a
// blank screen. Provides a "Try Again" button to reset state.

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void errorInfo
    void error
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#030015]">
          <div className="max-w-md glass-bright rounded-2xl glow-rose border border-red-500/20 p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white/90 mb-2">Something went wrong</h1>
            <p className="text-white/50 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 btn-neon-violet rounded-xl font-medium focus:outline-none"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// #################################################
