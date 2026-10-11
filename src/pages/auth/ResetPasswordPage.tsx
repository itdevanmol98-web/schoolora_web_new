import React, { useState } from 'react'
import { useSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom'
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
import KeyIcon from '@mui/icons-material/Key'
import { authService } from '@/features/auth/authService'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
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

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tokenFromUrl = searchParams.get('token') || ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await authService.resetPassword({
        token: values.token.trim(),
        newPassword: values.newPassword,
      })
      setIsSuccess(true)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. The reset token may be expired or invalid.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppCard
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        p: { xs: 2.5, sm: 4 },
        borderRadius: 3,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.7)'
            : '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: '#fff',
            mb: 1.5,
          }}
        >
          <KeyIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Create New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Your new password must meet Schoolora institutional complexity standards
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {isSuccess ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            Your password has been reset successfully. You can now sign in with your new credentials.
          </Alert>
          <AppButton
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            Proceed to Sign In
          </AppButton>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {!tokenFromUrl && (
              <AppTextField
                label="Reset Security Token"
                fullWidth
                required
                placeholder="Paste token from email"
                error={Boolean(errors.token)}
                helperText={errors.token?.message}
                {...register('token')}
              />
            )}

            <AppTextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
            </Typography>

            <AppButton
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              loadingText="Updating Password..."
              sx={{ py: 1.25, mt: 1 }}
            >
              Reset and Save Password
            </AppButton>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <AppButton
                component={RouterLink}
                to={PATHS.LOGIN}
                variant="text"
                color="inherit"
                size="small"
              >
                Back to Sign In
              </AppButton>
            </Box>
          </Box>
        </Box>
      )}
    </AppCard>
  )
}

export default ResetPasswordPage
