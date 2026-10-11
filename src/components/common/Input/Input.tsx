import { forwardRef } from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard'
  InputProps?: Record<string, unknown>
  inputProps?: Record<string, unknown>
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      variant = 'outlined',
      fullWidth = true,
      size = 'medium',
      error = false,
      helperText,
      InputProps,
      inputProps,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const mergedSlotProps = {
      ...(slotProps as Record<string, unknown>),
      ...(InputProps ? { input: { ...((slotProps as any)?.input || {}), ...InputProps } } : {}),
      ...(inputProps ? { htmlInput: { ...((slotProps as any)?.htmlInput || {}), ...inputProps } } : {}),
    }

    return (
      <TextField
        ref={ref}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        error={error}
        helperText={helperText}
        slotProps={mergedSlotProps}
        {...rest}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input as AppTextField }
export type { InputProps as AppTextFieldProps }
export default Input
