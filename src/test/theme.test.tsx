import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createAppTheme } from '@/theme/theme'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { useThemeMode } from '@/theme/ThemeContext'

const ThemeTestConsumer = () => {
  const { mode, toggleTheme, setThemeMode } = useThemeMode()
  return (
    <div>
      <span data-testid="mode-display">{mode}</span>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setThemeMode('dark')}>Set Dark</button>
      <button onClick={() => setThemeMode('light')}>Set Light</button>
    </div>
  )
}

describe('Theme Foundation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates light theme with appropriate palette and contrast', () => {
    const lightTheme = createAppTheme('light')
    expect(lightTheme.palette.mode).toBe('light')
    expect(lightTheme.palette.primary.main).toBe('#2563EB')
    expect(lightTheme.palette.background.default).toBe('#F8FAFC')
    expect(lightTheme.typography.fontFamily).toContain('Plus Jakarta Sans')
  })

  it('creates dark theme with appropriate palette and contrast', () => {
    const darkTheme = createAppTheme('dark')
    expect(darkTheme.palette.mode).toBe('dark')
    expect(darkTheme.palette.primary.main).toBe('#3B82F6')
    expect(darkTheme.palette.background.default).toBe('#0B0F19')
    expect(darkTheme.palette.text.primary).toBe('#F8FAFC')
  })

  it('applies custom button and card shape radius', () => {
    const theme = createAppTheme('light')
    expect(theme.shape.borderRadius).toBe(8)
  })

  it('switches themes and persists selection to localStorage', () => {
    render(
      <ThemeProvider initialMode="light">
        <ThemeTestConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('mode-display').textContent).toBe('light')

    fireEvent.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('mode-display').textContent).toBe('dark')
    expect(localStorage.getItem('schoolora_theme_mode')).toBe('dark')

    fireEvent.click(screen.getByText('Set Light'))
    expect(screen.getByTestId('mode-display').textContent).toBe('light')
    expect(localStorage.getItem('schoolora_theme_mode')).toBe('light')
  })
})
