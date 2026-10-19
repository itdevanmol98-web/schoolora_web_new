import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { authService } from '@/features/auth/authService'
import { PATHS } from '@/routes/paths'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid institutional email address'),
  tenantCode: z.string().optional(),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        mx: 'auto',
        bgcolor: isDark ? '#0B132B' : '#FFFFFF',
        borderRadius: '24px',
        p: { xs: 3, sm: 4.5 },
        border: 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
        boxShadow: isDark
          ? '0 20px 45px -10px rgba(0, 0, 0, 0.6)'
          : '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Top Header Badge & Text matching Image 3 */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            bgcolor: '#2563EB',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          <RotateCcw size={24} />
        </Box>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 800,
            color: isDark ? '#FFFFFF' : '#0B132B',
            letterSpacing: '-0.02em',
            mb: 0.75,
            fontSize: '22px',
          }}
        >
          Reset Your Password
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: isDark ? '#94A3B8' : '#64748B',
            lineHeight: 1.5,
          }}
        >
          Enter your institutional email to receive secure recovery instructions
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMessage}
        </Alert>
      )}

      {successNotice ? (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: '#F0FDF4',
              color: '#10B981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <CheckCircle2 size={30} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '17px', color: '#0F172A', mb: 1 }}>
            Reset Link Sent!
          </Typography>
          <Typography sx={{ fontSize: '13.5px', color: '#64748B', mb: 3, lineHeight: 1.6 }}>
            {successNotice} Please check your email inbox and spam folder.
          </Typography>
          <Box
            component={RouterLink}
            to={PATHS.LOGIN}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              width: '100%',
              py: 1.4,
              borderRadius: '12px',
              bgcolor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14.5px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            <ArrowLeft size={16} /> Return to Sign In
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Field: Email Address */}
            <Box>
              <Typography
                component="label"
                htmlFor="forgot-email"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Email Address *
              </Typography>
              <Box
                component="input"
                id="forgot-email"
                type="email"
                placeholder="user@axionexa.com"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
                sx={{
                  width: '100%',
                  py: 1.4,
                  px: 2,
                  fontSize: '14px',
                  borderRadius: '12px',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  border: 1.5,
                  borderColor: errors.email
                    ? '#EF4444'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.15)'
                    : '#CBD5E1',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  outline: 'none',
                  transition: 'all 0.2s',
                  '&:focus': {
                    borderColor: '#2563EB',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                  },
                }}
              />
              {errors.email && (
                <Typography sx={{ color: '#EF4444', fontSize: '12px', mt: 0.5, pl: 0.5 }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* Field: Tenant / Institution Code */}
            <Box>
              <Typography
                component="label"
                htmlFor="forgot-tenant"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Tenant / Institution Code (Optional)
              </Typography>
              <Box
                component="input"
                id="forgot-tenant"
                type="text"
                placeholder="e.g. greenwood-high"
                disabled={isLoading}
                {...register('tenantCode')}
                sx={{
                  width: '100%',
                  py: 1.4,
                  px: 2,
                  fontSize: '14px',
                  borderRadius: '12px',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  border: 1.5,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  outline: 'none',
                  transition: 'all 0.2s',
                  '&:focus': {
                    borderColor: '#2563EB',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box
              component="button"
              type="submit"
              disabled={isLoading}
              sx={{
                width: '100%',
                py: 1.5,
                borderRadius: '12px',
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.25s',
                mt: 1,
                '&:hover': {
                  bgcolor: '#1D4ED8',
                  boxShadow: '0 6px 18px rgba(37, 99, 235, 0.45)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </Box>

            {/* Back to Sign In Link */}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography
                component={RouterLink}
                to={PATHS.LOGIN}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isDark ? '#93C5FD' : '#2563EB',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ForgotPasswordPage
