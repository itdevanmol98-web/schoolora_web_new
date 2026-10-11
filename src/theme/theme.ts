import { createTheme, type Theme } from '@mui/material/styles'
import {
  lightTokens,
  darkTokens,
  typographyTokens,
  shapeTokens,
  brandColors,
} from './tokens'
import type { ThemeMode } from '@/types/common'

export const createAppTheme = (mode: ThemeMode): Theme => {
  const isDark = mode === 'dark'
  const currentTokens = isDark ? darkTokens : lightTokens

  return createTheme({
    palette: currentTokens.palette,
    typography: {
      ...typographyTokens,
    },
    shape: {
      borderRadius: shapeTokens.borderRadius,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          body: {
            backgroundColor: currentTokens.palette.background.default,
            color: currentTokens.palette.text.primary,
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 18px',
            transition: 'all 0.2s ease-in-out',
          },
          contained: {
            '&:hover': {
              backgroundColor: brandColors.primary[700],
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${currentTokens.palette.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 10,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1.5,
              borderColor: currentTokens.palette.primary.main,
            },
          },
          input: {
            padding: '11px 14px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: currentTokens.palette.background.paper,
            color: currentTokens.palette.text.primary,
            boxShadow: isDark
              ? '0 1px 0 0 rgba(255, 255, 255, 0.05)'
              : '0 1px 0 0 rgba(0, 0, 0, 0.06)',
            borderBottom: `1px solid ${currentTokens.palette.divider}`,
          },
        },
      },
    },
  })
}
