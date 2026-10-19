import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { AxionexaLogo } from '@/assets/logo/AxionexaLogo'

export interface LoadingScreenProps {
  message?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading AxioNexa ERP...',
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
      <Box sx={{ mb: 3 }}>
        <AxionexaLogo size="lg" showCompanySubtitle={true} showTagline={false} />
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
