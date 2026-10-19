import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { authService } from '@/features/auth/authService'
import type { OtpPurpose } from '@/features/auth/types'
import { PATHS } from '@/routes/paths'

const OTP_PURPOSE_OPTIONS = [
  { value: 'TWO_FACTOR_AUTH', label: 'Two-Factor Authentication (2FA)' },
  { value: 'LOGIN', label: 'Institutional Sign In' },
  { value: 'PASSWORD_RESET', label: 'Password Reset Verification' },
  { value: 'EMAIL_VERIFICATION', label: 'Email Address Verification' },
  { value: 'TRANSACTION_VERIFICATION', label: 'High-Privilege Action' },
]

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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
      {/* Top Header Badge & Text matching Image 4 */}
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
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '1px',
          }}
        >
          123
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
          One-Time Password (OTP)
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: isDark ? '#94A3B8' : '#64748B',
            lineHeight: 1.5,
          }}
        >
          Enter or request a single-use authentication code
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMessage}
        </Alert>
      )}

      {isVerified ? (
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
            Identity Verified!
          </Typography>
          <Typography sx={{ fontSize: '13.5px', color: '#64748B', mb: 3, lineHeight: 1.6 }}>
            {successNotice || 'Authentication token verified successfully.'}
          </Typography>
          <Box
            component="button"
            onClick={() => navigate(PATHS.LOGIN)}
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
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            Continue to Sign In
          </Box>
        </Box>
      ) : step === 'request' ? (
        <Box component="form" onSubmit={handleRequestOtp} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Field: Identifier */}
            <Box>
              <Typography
                component="label"
                htmlFor="otp-identifier"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Identifier (Email or Phone) *
              </Typography>
              <Box
                component="input"
                id="otp-identifier"
                type="text"
                placeholder="user@axionexa.com or +919876543210"
                value={identifier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                required
                disabled={isLoading}
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

            {/* Field: Purpose Dropdown */}
            <Box>
              <Typography
                component="label"
                htmlFor="otp-purpose"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Verification Purpose
              </Typography>
              <Box
                component="select"
                id="otp-purpose"
                value={purpose}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPurpose(e.target.value as OtpPurpose)}
                disabled={isLoading}
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
                  cursor: 'pointer',
                  '&:focus': {
                    borderColor: '#2563EB',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                  },
                }}
              >
                {OTP_PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Box>
            </Box>

            {/* Field: Tenant Code */}
            <Box>
              <Typography
                component="label"
                htmlFor="otp-tenant"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Tenant Code (Optional)
              </Typography>
              <Box
                component="input"
                id="otp-tenant"
                type="text"
                placeholder="e.g. greenwood-high"
                value={tenantCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantCode(e.target.value)}
                disabled={isLoading}
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

            {/* Button */}
            <Box
              component="button"
              type="submit"
              disabled={isLoading || !identifier.trim()}
              sx={{
                width: '100%',
                py: 1.5,
                borderRadius: '12px',
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: isLoading || !identifier.trim() ? 'not-allowed' : 'pointer',
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
                  <span>Requesting Code...</span>
                </>
              ) : (
                <span>Request OTP Code</span>
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
      ) : (
        /* Verify OTP Step */
        <Box component="form" onSubmit={handleVerifyOtp} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography
                component="label"
                htmlFor="otp-code"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                6-Digit Security Code *
              </Typography>
              <Box
                component="input"
                id="otp-code"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                disabled={isLoading}
                sx={{
                  width: '100%',
                  py: 1.5,
                  px: 2,
                  fontSize: '20px',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  fontWeight: 700,
                  borderRadius: '12px',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                  border: 1.5,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  outline: 'none',
                  '&:focus': {
                    borderColor: '#2563EB',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                  },
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '13px', color: '#64748B' }}>
                Code expires in: <strong>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
              </Typography>
            </Box>

            <Box
              component="button"
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              sx={{
                width: '100%',
                py: 1.5,
                borderRadius: '12px',
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: isLoading || otpCode.length < 4 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                '&:hover': { bgcolor: '#1D4ED8' },
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setStep('request')}
                sx={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13px', cursor: 'pointer', '&:hover': { color: '#2563EB' } }}
              >
                Change identifier
              </Box>
              <Typography
                component={RouterLink}
                to={PATHS.LOGIN}
                sx={{ fontSize: '13px', color: '#2563EB', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Back to Sign In
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default OtpVerificationPage
