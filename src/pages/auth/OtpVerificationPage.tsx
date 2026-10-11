import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import PinIcon from '@mui/icons-material/Pin'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { authService } from '@/features/auth/authService'
import type { OtpPurpose } from '@/features/auth/types'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppCard from '@/components/common/Card'

const OTP_PURPOSE_OPTIONS = [
  { value: 'TWO_FACTOR_AUTH', label: 'Two-Factor Authentication (2FA)' },
  { value: 'LOGIN', label: 'Institutional Sign In' },
  { value: 'PASSWORD_RESET', label: 'Password Reset Verification' },
  { value: 'EMAIL_VERIFICATION', label: 'Email Address Verification' },
  { value: 'TRANSACTION_VERIFICATION', label: 'High-Privilege Action' },
]

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [identifier, setIdentifier] = useState('')
  const [purpose, setPurpose] = useState<OtpPurpose>('TWO_FACTOR_AUTH')
  const [tenantCode, setTenantCode] = useState('')
  const [otpCode, setOtpCode] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(0)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessNotice(null)

    try {
      const response = await authService.requestOtp({
        identifier: identifier.trim(),
        purpose,
        tenantCode: tenantCode.trim() || undefined,
      })
      setSuccessNotice(response.message)
      setCountdown(response.expiresInSeconds || 300)
      setStep('verify')
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to request OTP code. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim()) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await authService.verifyOtp({
        identifier: identifier.trim(),
        purpose,
        code: otpCode.trim(),
      })
      setIsVerified(true)
      setSuccessNotice(response.message)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Invalid or expired OTP code. Please verify and try again.'
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
            bgcolor: isVerified ? 'success.main' : 'primary.main',
            color: '#fff',
            mb: 1.5,
          }}
        >
          {isVerified ? (
            <CheckCircleIcon sx={{ fontSize: 32 }} />
          ) : (
            <PinIcon sx={{ fontSize: 32 }} />
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isVerified ? 'OTP Verified' : 'One-Time Password (OTP)'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isVerified
            ? 'Security verification check was successful'
            : 'Enter or request a single-use authentication code'}
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successNotice && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successNotice}
        </Alert>
      )}

      {isVerified ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your one-time password has been verified successfully.
          </Typography>
          <AppButton
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            Return to Portal Sign In
          </AppButton>
        </Box>
      ) : step === 'request' ? (
        <Box component="form" onSubmit={handleRequestOtp}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="Identifier (Email or Phone)"
              fullWidth
              required
              placeholder="user@schoolora.edu"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <AppSelect
              label="Verification Purpose"
              value={purpose}
              onChange={(val) => setPurpose(val as OtpPurpose)}
              options={OTP_PURPOSE_OPTIONS}
            />

            <AppTextField
              label="Tenant Code (Optional)"
              fullWidth
              placeholder="e.g. greenwood-high"
              value={tenantCode}
              onChange={(e) => setTenantCode(e.target.value)}
            />

            <AppButton
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              loadingText="Requesting Code..."
            >
              Request OTP Code
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
      ) : (
        <Box component="form" onSubmit={handleVerifyOtp}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A 6-digit code was sent to <strong>{identifier}</strong>. Please enter the code below:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="6-Digit OTP Code"
              fullWidth
              required
              autoFocus
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              inputProps={{ maxLength: 10, style: { textAlign: 'center', letterSpacing: 4, fontSize: '1.25rem' } }}
            />

            <AppButton
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              loadingText="Verifying Code..."
            >
              Verify OTP Code
            </AppButton>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <AppButton
                variant="text"
                color="inherit"
                size="small"
                onClick={() => setStep('request')}
              >
                Change Identifier
              </AppButton>

              {countdown > 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Expires in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </Typography>
              ) : (
                <AppButton
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handleRequestOtp}
                  disabled={isLoading}
                >
                  Resend Code
                </AppButton>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </AppCard>
  )
}

export default OtpVerificationPage
