import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from '@/app/store'
import { ThemeProvider } from '@/theme/ThemeProvider'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialEntries?: string[]
  preloadedState?: Record<string, unknown>
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    preloadedState = {},
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = createStore(preloadedState)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export * from '@testing-library/react'
