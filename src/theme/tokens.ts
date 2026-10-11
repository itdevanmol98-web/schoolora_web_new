export const brandColors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  secondary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#0B0F19',
  },
  success: {
    light: '#34D399',
    main: '#10B981',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
    contrastText: '#1E293B',
  },
  error: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#60A5FA',
    main: '#3B82F6',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
}

export const lightTokens = {
  palette: {
    mode: 'light' as const,
    primary: {
      light: brandColors.primary[400],
      main: brandColors.primary[600],
      dark: brandColors.primary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: brandColors.secondary[400],
      main: brandColors.secondary[600],
      dark: brandColors.secondary[800],
      contrastText: '#FFFFFF',
    },
    background: {
      default: brandColors.slate[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: brandColors.slate[900],
      secondary: brandColors.slate[600],
      disabled: brandColors.slate[400],
    },
    divider: brandColors.slate[200],
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error,
    info: brandColors.info,
  },
}

export const darkTokens = {
  palette: {
    mode: 'dark' as const,
    primary: {
      light: brandColors.primary[300],
      main: brandColors.primary[500],
      dark: brandColors.primary[600],
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: brandColors.secondary[300],
      main: brandColors.secondary[500],
      dark: brandColors.secondary[600],
      contrastText: '#0F172A',
    },
    background: {
      default: brandColors.slate[950],
      paper: brandColors.slate[900],
    },
    text: {
      primary: '#F8FAFC',
      secondary: brandColors.slate[400],
      disabled: brandColors.slate[600],
    },
    divider: brandColors.slate[800],
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error,
    info: brandColors.info,
  },
}

export const typographyTokens = {
  fontFamily:
    "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  h1: {
    fontSize: '2.25rem',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.875rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.45,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.55,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
}

export const shapeTokens = {
  borderRadius: 8,
}
