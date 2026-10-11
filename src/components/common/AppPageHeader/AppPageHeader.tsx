import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export interface AppPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  onBack?: () => void
  backLabel?: string
  badge?: React.ReactNode
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBack,
  backLabel = 'Go back',
  badge,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && <Box sx={{ mb: 1.5 }}>{breadcrumbs}</Box>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              aria-label={backLabel}
              edge="start"
              size="small"
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              {badge}
            </Box>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AppPageHeader
