import { Component, type ErrorInfo, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import ErrorState from '../ErrorState'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    console.error('Unhandled React Error Caught by Schoolora ErrorBoundary:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            p: 3,
          }}
          role="alert"
        >
          <ErrorState
            title="An Unexpected Application Error Occurred"
            message={
              this.state.error.message ||
              'A critical rendering error occurred in the application. Please reload or contact the administrator.'
            }
            retryText="Reload Application"
            onRetry={() => {
              this.handleReset()
              window.location.reload()
            }}
          />
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
