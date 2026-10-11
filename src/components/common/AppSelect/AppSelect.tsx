import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

export interface SelectOption {
  value: string | number
  label: React.ReactNode
  disabled?: boolean
}

export interface AppSelectProps
  extends Omit<SelectProps, 'onChange' | 'value' | 'error'> {
  label?: string
  value: unknown
  onChange?: (value: any, event?: SelectChangeEvent<unknown>) => void
  options?: SelectOption[]
  placeholder?: string
  error?: boolean
  helperText?: React.ReactNode
  children?: React.ReactNode
}

export const AppSelect: React.FC<AppSelectProps> = ({
  label,
  value,
  onChange,
  options,
  children,
  placeholder,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  disabled = false,
  required = false,
  id,
  ...rest
}) => {
  const generatedId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
  const labelId = generatedId ? `${generatedId}-label` : undefined

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (!onChange) return
    const rawVal = String(event.target.value)
    const hybrid = Object.assign(new String(rawVal), event, {
      target: { value: rawVal, name: event.target.name },
      value: rawVal,
      [Symbol.toPrimitive]: () => rawVal,
      toString: () => rawVal,
      valueOf: () => rawVal,
    })
    onChange(hybrid, event)
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={error}
      disabled={disabled}
      required={required}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        id={generatedId}
        value={value ?? ''}
        label={label}
        onChange={handleChange}
        displayEmpty={Boolean(placeholder)}
        {...rest}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options &&
          options.map((option) => (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        {children}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default AppSelect
