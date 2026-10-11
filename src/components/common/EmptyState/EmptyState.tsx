import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import Button from '../Button/Button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  actionIcon?: React.ReactNode
  minHeight?: number | string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No records found',
  description = 'There are currently no items to display in this section.',
  actionText,
  onAction,
  actionIcon,
  minHeight = 260,
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
        minHeight,
      }}
    >
      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          bgcolor: 'action.selected',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon || <InboxOutlinedIcon sx={{ fontSize: 36 }} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: actionText && onAction ? 3 : 0 }}
      >
        {description}
      </Typography>

      {actionText && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          startIcon={actionIcon}
        >
          {actionText}
        </Button>
      )}
    </Box>
  )
}

export { EmptyState as AppEmptyState }
export type { EmptyStateProps as AppEmptyStateProps }
export default EmptyState
