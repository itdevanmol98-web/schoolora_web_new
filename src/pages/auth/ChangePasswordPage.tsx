import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { changePasswordThunk } from '@/features/auth/authSlice'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export const ChangePasswordPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const result = await dispatch(
      changePasswordThunk({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    )

    setIsLoading(false)

    if (changePasswordThunk.fulfilled.match(result)) {
      setSuccessMessage('Your password has been changed successfully.')
      reset()
    } else {
      setErrorMessage(
        (result.payload as string) || 'Failed to change password. Please check your current password.'
      )
    }
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <AppPageHeader
        title="Security & Password"
        subtitle="Manage your institutional login password and authentication credentials"
      />

      <AppCard sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('currentPassword')}
            />

            <AppTextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              required
              autoComplete="new-password"
              placeholder="••••••••••••"
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('newPassword')}
            />

            <AppTextField
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              autoComplete="new-password"
              placeholder="••••••••••••"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword')}
            />

            <Typography variant="caption" color="text.secondary">
              Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <AppButton
                type="submit"
                size="large"
                loading={isLoading}
                loadingText="Updating Password..."
                sx={{ px: 4 }}
              >
                Save New Password
              </AppButton>
            </Box>
          </Box>
        </Box>
      </AppCard>
    </Box>
  )
}

export default ChangePasswordPage
