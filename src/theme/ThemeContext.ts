import { createContext, useContext } from 'react'
import type { ThemeMode } from '@/types/common'

export interface ThemeContextValue {
  mode: ThemeMode
  toggleTheme: () => void
  setThemeMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
})

export const useThemeMode = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within a Schoolora ThemeProvider')
  }
  return context
}
