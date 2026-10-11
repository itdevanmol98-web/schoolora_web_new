import React, { useState, useMemo, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createAppTheme } from './theme'
import { ThemeContext } from './ThemeContext'
import type { ThemeMode } from '@/types/common'

const THEME_STORAGE_KEY = 'schoolora_theme_mode'

export interface ThemeProviderProps {
  children: React.ReactNode
  initialMode?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (initialMode) return initialMode
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
      if (stored === 'light' || stored === 'dark') return stored
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark'
      }
    } catch {
      // Fallback in storage-restricted environments
    }
    return 'light'
  })

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // Ignore storage errors
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setThemeMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export { useThemeMode } from './ThemeContext'
export default ThemeProvider
