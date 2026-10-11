import React from 'react'
import Typography from '@mui/material/Typography'
import AppDialog from '../AppDialog'
import AppButton from '../Button'

export interface AppConfirmDialogProps {
  open: boolean
  title?: React.ReactNode
  message: React.ReactNode
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'secondary' | 'info' | 'success'
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  onClose?: () => void
  maxWidth?: 'xs' | 'sm' | 'md'
}

export const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  onClose,
  maxWidth = 'xs',
}) => {
  const handleClose = onCancel || onClose || (() => {})

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth={maxWidth}
      showCloseButton={!loading}
      actions={
        <>
          <AppButton
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </AppButton>
          <AppButton
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </AppButton>
        </>
      }
    >
      {typeof message === 'string' ? (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      ) : (
        message
      )}
    </AppDialog>
  )
}

export default AppConfirmDialog
