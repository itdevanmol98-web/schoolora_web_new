import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ShieldIcon from '@mui/icons-material/Shield'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { changePasswordThunk } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

const firstLoginSchema = z
  .object({
    currentPassword: z.string().min(1, 'Temporary password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new permanent password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FirstLoginValues = z.infer<typeof firstLoginSchema>

export const FirstLoginPasswordChangePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstLoginValues>({
    resolver: zodResolver(firstLoginSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: FirstLoginValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    const result = await dispatch(
      changePasswordThunk({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    )

    setIsLoading(false)

    if (changePasswordThunk.fulfilled.match(result)) {
      navigate(PATHS.DASHBOARD, { replace: true })
    } else {
      setErrorMessage(
        (result.payload as string) ||
          'Failed to update initial password. Please verify your temporary password.'
      )
    }
  }

  return (
    <AppCard
      sx={{
        width: '100%',
        maxWidth: 520,
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
            bgcolor: 'warning.main',
            color: '#fff',
            mb: 1.5,
          }}
        >
          <ShieldIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Initial Password Setup Required
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Your institutional account requires setting a permanent personal password
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle sx={{ fontWeight: 600 }}>Security Compliance Notice</AlertTitle>
        You have logged in with a temporary or administrator-issued password. For your security and compliance, you must set a permanent password before accessing school records.
      </Alert>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <AppTextField
            label="Current Temporary Password"
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
            label="New Permanent Password"
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
            label="Confirm New Permanent Password"
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

          <AppButton
            type="submit"
            fullWidth
            size="large"
            loading={isLoading}
            loadingText="Securing Account..."
            sx={{ py: 1.25, mt: 1 }}
          >
            Activate Permanent Password
          </AppButton>
        </Box>
      </Box>
    </AppCard>
  )
}

export default FirstLoginPasswordChangePage
