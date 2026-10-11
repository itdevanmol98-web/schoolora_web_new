import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import AppButton from '../Button'

export interface AppDialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  loading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullWidth?: boolean
  showCloseButton?: boolean
  id?: string
}

export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  id,
}) => {
  const titleId = id ? `${id}-title` : 'app-dialog-title'
  const renderedActions =
    actions ||
    (onConfirm ? (
      <>
        <AppButton variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
          {cancelText}
        </AppButton>
        <AppButton variant="contained" onClick={onConfirm} loading={loading}>
          {confirmText}
        </AppButton>
      </>
    ) : null)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby={title ? titleId : undefined}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2.5,
            p: 0.5,
          },
        },
      }}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          id={titleId}
          sx={{
            m: 0,
            p: 2.5,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ pr: showCloseButton ? 2 : 0 }}>
            {typeof title === 'string' ? (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{
                color: (theme) => theme.palette.grey[500],
                ml: 'auto',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 2.5, pt: title ? 1 : 2.5 }}>{children}</DialogContent>

      {renderedActions && (
        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>{renderedActions}</DialogActions>
      )}
    </Dialog>
  )
}

export default AppDialog
