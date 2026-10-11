import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import LockResetIcon from '@mui/icons-material/LockReset'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { authService } from '@/features/auth/authService'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid institutional email address'),
  tenantCode: z.string().optional(),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      tenantCode: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessNotice(null)

    try {
      const response = await authService.forgotPassword(
        values.email,
        values.tenantCode?.trim() || undefined
      )
      setSuccessNotice(response.message)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to process password reset request. Please try again later.'
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
          <LockResetIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter your institutional email to receive secure recovery instructions
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successNotice ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}
          >
            {successNotice}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please check your inbox and click the single-use reset link. If you do not see the email within a few minutes, check your spam folder.
          </Typography>
          <AppButton
            component={RouterLink}
            to={PATHS.LOGIN}
            variant="contained"
            fullWidth
            startIcon={<ArrowBackIcon />}
          >
            Return to Sign In
          </AppButton>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="Email Address"
              type="email"
              fullWidth
              required
              autoComplete="email"
              placeholder="user@schoolora.edu"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <AppTextField
              label="Tenant / Institution Code (Optional)"
              fullWidth
              placeholder="e.g. greenwood-high"
              error={Boolean(errors.tenantCode)}
              helperText={errors.tenantCode?.message}
              {...register('tenantCode')}
            />

            <AppButton
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              loadingText="Sending Reset Link..."
              sx={{ py: 1.25, mt: 1 }}
            >
              Send Password Reset Link
            </AppButton>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Link
                component={RouterLink}
                to={PATHS.LOGIN}
                variant="body2"
                color="text.secondary"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                }}
              >
                <ArrowBackIcon fontSize="small" /> Back to Sign In
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </AppCard>
  )
}

export default ForgotPasswordPage
