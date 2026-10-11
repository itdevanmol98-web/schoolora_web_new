import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export interface LoadingSpinnerProps {
  message?: string
  size?: number
  minHeight?: number | string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 40,
  minHeight = 200,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        p: 3,
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  )
}

export default LoadingSpinner
