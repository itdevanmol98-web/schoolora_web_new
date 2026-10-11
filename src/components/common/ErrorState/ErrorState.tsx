import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '../Button/Button'

export interface ErrorStateProps {
  title?: string
  message?: string
  errorCode?: string | number
  onRetry?: () => void
  retryText?: string
  fullScreen?: boolean
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the system.',
  errorCode,
  onRetry,
  retryText = 'Try Again',
  fullScreen = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        minHeight: fullScreen ? '80vh' : 280,
      }}
      role="alert"
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'error.light',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          opacity: 0.9,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 36, color: 'error.main' }} />
      </Box>

      <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mb: 2 }}>
        {message}
      </Typography>

      {errorCode && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            bgcolor: 'action.hover',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            mb: 3,
          }}
        >
          Error Code: {errorCode}
        </Typography>
      )}

      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 1 }}
        >
          {retryText}
        </Button>
      )}
    </Box>
  )
}

export { ErrorState as AppErrorState }
export type { ErrorStateProps as AppErrorStateProps }
export default ErrorState
