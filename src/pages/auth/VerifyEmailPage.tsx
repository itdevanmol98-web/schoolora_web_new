import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { authService } from '@/features/auth/authService'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Resend state
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendNotice, setResendNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    let isCancelled = false

    authService
      .verifyEmail(token)
      .then(() => {
        if (!isCancelled) {
          setIsSuccess(true)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to verify email address. The token may be expired or already used.'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [token])

  const triggerVerify = (tokenToVerify: string) => {
    setIsLoading(true)
    setErrorMessage(null)

    authService
      .verifyEmail(tokenToVerify)
      .then(() => {
        setIsSuccess(true)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to verify email address. The token may be expired or already used.'
        )
        setIsLoading(false)
      })
  }

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail.trim()) return

    setIsResending(true)
    setErrorMessage(null)
    setResendNotice(null)

    try {
      const result = await authService.resendVerificationEmail(resendEmail.trim())
      setResendNotice(result.message)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to resend verification email. Please try again later.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AppCard
      sx={{
        width: '100%',
        maxWidth: 500,
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
            bgcolor: isSuccess ? 'success.main' : 'primary.main',
            color: '#fff',
            mb: 1.5,
          }}
        >
          {isSuccess ? (
            <CheckCircleIcon sx={{ fontSize: 36 }} />
          ) : (
            <MarkEmailReadIcon sx={{ fontSize: 36 }} />
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isSuccess ? 'Email Verified Successfully' : 'Institutional Email Verification'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isSuccess
            ? 'Your institutional email is now verified and active'
            : 'Validate your email address to ensure account security'}
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {resendNotice && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {resendNotice}
        </Alert>
      )}

      {isSuccess ? (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for verifying your institutional email address. You may now sign in and access the Schoolora ERP system.
          </Typography>
          <AppButton
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            Sign In with Verified Email
          </AppButton>
        </Box>
      ) : token ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <AppButton
            variant="contained"
            fullWidth
            size="large"
            loading={isLoading}
            loadingText="Verifying Token..."
            onClick={() => triggerVerify(token)}
          >
            Confirm Email Verification
          </AppButton>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleResend}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No verification token was detected in the URL. Enter your institutional email below to request a new verification link:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AppTextField
              label="Email Address"
              type="email"
              fullWidth
              required
              placeholder="user@schoolora.edu"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />

            <AppButton
              type="submit"
              fullWidth
              loading={isResending}
              loadingText="Sending Link..."
            >
              Resend Verification Email
            </AppButton>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <AppButton
                component={RouterLink}
                to={PATHS.LOGIN}
                variant="text"
                color="inherit"
                size="small"
                startIcon={<ArrowBackIcon fontSize="small" />}
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

export default VerifyEmailPage
