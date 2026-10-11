import React from 'react'
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean
  loadingText?: string
  to?: string
  component?: React.ElementType
}


export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  loadingText,
  disabled,
  startIcon,
  variant = 'contained',
  color = 'primary',
  ...rest
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" aria-label="Loading" />
        ) : (
          startIcon
        )
      }
      {...rest}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  )
}

export { Button as AppButton }
export type { ButtonProps as AppButtonProps }
export default Button
