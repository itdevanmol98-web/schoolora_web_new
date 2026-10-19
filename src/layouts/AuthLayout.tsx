import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AxionexaLogo } from '@/assets/logo/AxionexaLogo'
import { useThemeMode } from '@/theme/ThemeProvider'
import { PATHS } from '@/routes/paths'

export const AuthLayout: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode()
  const navigate = useNavigate()
  const isDark = mode === 'dark'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#060B18' : '#F3F6FA',
        color: isDark ? '#FFFFFF' : '#0F172A',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Top Header Bar matching official AxioNexa UI */}
      <Box
        component="header"
        sx={{
          width: '100%',
          px: { xs: 2, sm: 4, md: 5 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isDark ? 'rgba(11, 19, 43, 0.95)' : '#FFFFFF',
          borderBottom: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Brand Logo */}
        <Box
          onClick={() => navigate(PATHS.ROOT)}
          sx={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
          title="AXIONEXA ERP Home"
        >
          <AxionexaLogo size="md" showCompanySubtitle={true} showTagline={true} />
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Back to Website Button */}
          <Box
            onClick={() => navigate(PATHS.ROOT)}
            component="button"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 1.5, sm: 2 },
              py: 0.85,
              borderRadius: '10px',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
              border: 1.5,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
              color: isDark ? '#93C5FD' : '#2563EB',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              '&:hover': {
                bgcolor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF',
                borderColor: '#2563EB',
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Back to Website
            </Box>
          </Box>

          {/* Theme Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                border: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
              }}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? (
                <Brightness7Icon fontSize="small" sx={{ color: '#FBBF24' }} />
              ) : (
                <Brightness4Icon fontSize="small" sx={{ color: '#475569' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        <Outlet />
      </Box>

      {/* Bottom Footer */}
      <Box
        component="footer"
        sx={{
          py: 2.5,
          px: { xs: 2, sm: 4, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          borderTop: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          fontSize: '13px',
          color: isDark ? '#94A3B8' : '#64748B',
          bgcolor: isDark ? '#060B18' : '#FFFFFF',
        }}
      >
        <Box>
          &copy; {new Date().getFullYear()} Axionexa Technologies Pvt. Ltd. All Rights Reserved.
        </Box>
        <Box sx={{ display: 'flex', gap: 2.5 }}>
          <Box
            component="a"
            href="#privacy"
            onClick={(e) => {
              e.preventDefault()
              navigate(PATHS.ROOT)
            }}
            sx={{
              color: isDark ? '#94A3B8' : '#64748B',
              textDecoration: 'none',
              '&:hover': { color: '#2563EB' },
            }}
          >
            Privacy Policy
          </Box>
          <Box sx={{ color: '#CBD5E1' }}>|</Box>
          <Box
            component="a"
            href="#terms"
            onClick={(e) => {
              e.preventDefault()
              navigate(PATHS.ROOT)
            }}
            sx={{
              color: isDark ? '#94A3B8' : '#64748B',
              textDecoration: 'none',
              '&:hover': { color: '#2563EB' },
            }}
          >
            Terms & Conditions
          </Box>
          <Box sx={{ color: '#CBD5E1' }}>|</Box>
          <Box
            component="a"
            href="#help"
            onClick={(e) => {
              e.preventDefault()
              navigate(PATHS.ROOT)
            }}
            sx={{
              color: isDark ? '#94A3B8' : '#64748B',
              textDecoration: 'none',
              '&:hover': { color: '#2563EB' },
            }}
          >
            Help Center
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthLayout
