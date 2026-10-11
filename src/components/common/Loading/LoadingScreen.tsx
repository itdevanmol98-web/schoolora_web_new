import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SchoolIcon from '@mui/icons-material/School'

export interface LoadingScreenProps {
  message?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading Schoolora ERP...',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        p: 2,
      }}
      role="status"
      aria-live="polite"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
        }}
      >
        <SchoolIcon color="primary" sx={{ fontSize: 44 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }} color="text.primary">
          Schoolora{' '}
          <Typography component="span" variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            ERP
          </Typography>
        </Typography>
      </Box>
      <CircularProgress size={36} thickness={4} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2.5, fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingScreen
