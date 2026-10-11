import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SchoolIcon from '@mui/icons-material/School'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useThemeMode } from '@/theme/ThemeProvider'
import { PATHS } from '@/routes/paths'

export const AuthLayout: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Top Bar with Brand and Theme Switch */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate(PATHS.ROOT)}
        >
          <IconButton size="small" aria-label="Go to homepage">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <SchoolIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Schoolora{' '}
            <Typography component="span" variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ERP
            </Typography>
          </Typography>
        </Box>

        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle light/dark theme"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Centered Auth Card Container */}
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Outlet />
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 2.5, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} Schoolora ERP System. Production Frontend
          Architecture.
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthLayout
