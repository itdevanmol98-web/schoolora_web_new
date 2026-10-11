import React from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'
import HomeIcon from '@mui/icons-material/Home'
import Button from '@/components/common/Button'
import { PATHS } from '@/routes/paths'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        p: 3,
      }}
      role="main"
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'action.selected',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 48 }} />
      </Box>

      <Typography
        variant="h1"
        color="primary"
        sx={{ fontWeight: 800, fontSize: { xs: '4rem', sm: '6rem' }, lineHeight: 1 }}
      >
        404
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
        The page you are looking for doesn't exist or has been moved. Check the URL or
        return to the Schoolora dashboard.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        onClick={() => navigate(PATHS.ROOT)}
      >
        Return to Home
      </Button>
    </Box>
  )
}

export default NotFoundPage
