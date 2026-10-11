import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import LoadingScreen from './LoadingScreen'
import LoadingSpinner from './LoadingSpinner'

export interface AppLoadingProps {
  variant?: 'inline' | 'screen' | 'overlay'
  message?: string
  size?: number
  minHeight?: number | string
  open?: boolean // for overlay variant
}

export const AppLoading: React.FC<AppLoadingProps> = ({
  variant = 'inline',
  message,
  size = 40,
  minHeight = 200,
  open = true,
}) => {
  if (variant === 'screen') {
    return <LoadingScreen message={message} />
  }

  if (variant === 'overlay') {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={open}
        role="status"
        aria-live="polite"
      >
        <CircularProgress color="inherit" size={size} />
        {message && (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {message}
          </Typography>
        )}
      </Backdrop>
    )
  }

  return <LoadingSpinner message={message} size={size} minHeight={minHeight} />
}


export default AppLoading
