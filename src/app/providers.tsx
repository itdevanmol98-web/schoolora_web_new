import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider } from '@/theme/ThemeProvider'

import ErrorBoundary from '@/components/common/ErrorBoundary'

export interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Top-level application providers wrapping the component tree with
 * Redux State, MUI Design System Theme, Global Contexts, and Error Boundary.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </Provider>
  )
}


export default AppProviders
