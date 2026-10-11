import React, { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import SchoolIcon from '@mui/icons-material/School'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import BusinessIcon from '@mui/icons-material/Business'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { loginThunk, clearError } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppCard from '@/components/common/Card'

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid institutional email address'),
  password: z.string().min(1, 'Password is required'),
  tenantCode: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { error, status } = useAppSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [showTenantCode, setShowTenantCode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantCode: '',
    },
  })

  const isLoading = status === 'loading'

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearError())
    const resultAction = await dispatch(
      loginThunk({
        email: values.email,
        password: values.password,
        tenantCode: values.tenantCode?.trim() || undefined,
      })
    )

    if (loginThunk.fulfilled.match(resultAction)) {
      if (resultAction.payload.mustChangePassword) {
        navigate(PATHS.FIRST_LOGIN_PASSWORD_CHANGE, { replace: true })
      } else {
        const destination =
          (location.state as { from?: Location })?.from?.pathname || PATHS.DASHBOARD
        navigate(destination, { replace: true })
      }
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
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6)'
            : '0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.05)',
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
          <SchoolIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Welcome to Schoolora ERP
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter your institutional credentials to access your portal
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <AppTextField
            label="Email Address"
            type="email"
            fullWidth
            required
            autoComplete="email"
            placeholder="admin@schoolora.edu"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <AppTextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password')}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showTenantCode}
                  onChange={(e) => setShowTenantCode(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Specify School / Tenant Code
                </Typography>
              }
            />
            <Link
              component={RouterLink}
              to={PATHS.FORGOT_PASSWORD}
              variant="body2"
              color="primary"
              sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Forgot Password?
            </Link>
          </Box>

          {showTenantCode && (
            <AppTextField
              label="Tenant / Institution Code"
              fullWidth
              placeholder="e.g. greenwood-high"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              error={Boolean(errors.tenantCode)}
              helperText={errors.tenantCode?.message || 'Optional for multi-tenant institution accounts'}
              {...register('tenantCode')}
            />
          )}

          <AppButton
            type="submit"
            fullWidth
            size="large"
            loading={isLoading}
            loadingText="Authenticating..."
            sx={{ py: 1.25, mt: 1 }}
          >
            Sign In to Schoolora
          </AppButton>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Need OTP verification or assistance?{' '}
          <Link component={RouterLink} to={PATHS.VERIFY_OTP} color="primary" sx={{ fontWeight: 600 }}>
            Verify OTP Code
          </Link>
        </Typography>
      </Box>
    </AppCard>
  )
}

export default LoginPage
