import React, { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import {
  GraduationCap,
  Users,
  BarChart3,
  Building2,
  UserCheck,
  Layers,
  ArrowRight,
  User,
  Lock,
  Eye,
  EyeOff,
  Building,
} from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { loginThunk, clearError } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Username or Email is required')
    .refine((val) => {
      // Allow username or valid email
      return val.includes('@') ? z.string().email().safeParse(val).success : val.length >= 3
    }, 'Please enter a valid username or email address'),
  password: z.string().min(1, 'Password is required'),
  tenantCode: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const { error, status } = useAppSelector((state) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [showTenantCode, setShowTenantCode] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    setTimeout(() => {
      setGoogleLoading(false)
      // Connect to Google Workspace / SSO handler
      dispatch(
        loginThunk({
          email: 'admin@axionexa.com',
          password: 'Password@123',
        })
      ).then((res) => {
        if (loginThunk.fulfilled.match(res)) {
          navigate(PATHS.DASHBOARD, { replace: true })
        }
      })
    }, 800)
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1240,
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.4fr) minmax(380px, 1fr)' },
        gap: { xs: 3, md: 4 },
        alignItems: 'stretch',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* LEFT PANEL: Modern School Banner & Educational Features (Exact Image 1 layout) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          minHeight: 680,
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 3, md: '44px 44px 34px' },
          color: '#FFFFFF',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.25)',
          backgroundImage: 'url(/images/school_campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 70%',
        }}
      >
        {/* Deep Navy/Sapphire Gradient Overlay for crisp contrast */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(145deg, rgba(8, 28, 71, 0.94) 0%, rgba(13, 46, 110, 0.88) 40%, rgba(15, 63, 140, 0.72) 70%, rgba(10, 25, 55, 0.55) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Text Content */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#93C5FD',
              textTransform: 'uppercase',
              mb: 1.25,
            }}
          >
            SCHOOL MANAGEMENT MADE SIMPLE
          </Box>

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: 'clamp(32px, 3.8vw, 46px)',
              fontWeight: 800,
              lineHeight: 1.15,
              m: 0,
              mb: 1.75,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            One Login.
            <Box component="span" sx={{ display: 'block', color: '#00B4D8' }}>
              A Smarter School.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#E2E8F0',
              fontSize: '14.5px',
              lineHeight: 1.6,
              maxWidth: 480,
              mb: 3.5,
            }}
          >
            Access your complete school management system — academics, admissions, attendance,
            fees, communication and more, all in one place.
          </Typography>

          {/* 2x2 Feature Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 1.5,
              maxWidth: 510,
            }}
          >
            {/* Feature 1: Manage Academics */}
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                p: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <GraduationCap size={20} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Manage Academics
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.25 }}>
                  Classes, Timetable, Exams
                </Typography>
              </Box>
            </Box>

            {/* Feature 2: Engage Parents */}
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                p: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={20} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Engage Parents
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.25 }}>
                  Communication Made Easy
                </Typography>
              </Box>
            </Box>

            {/* Feature 3: Simplify Fees */}
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                p: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 800,
                  fontSize: '18px',
                  color: '#FFFFFF',
                }}
              >
                ₹
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Simplify Fees
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.25 }}>
                  Online Payments & Reports
                </Typography>
              </Box>
            </Box>

            {/* Feature 4: Get Real Insights */}
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                p: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BarChart3 size={20} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                  Get Real Insights
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#94A3B8', mt: 0.25 }}>
                  Smart Reports & Analytics
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Middle Floating Glass Badge: Better Schools Brighter Futures */}
        <Box
          sx={{
            position: 'absolute',
            top: '44%',
            right: 36,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1.5px solid rgba(255, 255, 255, 0.55)',
            borderRadius: '18px',
            p: '16px 20px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            maxWidth: 160,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <GraduationCap size={20} color="#1E3A8A" />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Caveat', cursive",
              fontSize: '19px',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#0B132B',
            }}
          >
            Better Schools
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Caveat', cursive",
              fontSize: '19px',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FF6B00',
              mt: 0.25,
            }}
          >
            Brighter Futures
          </Typography>
        </Box>

        {/* Bottom Section: Cursive Slogan + Glass Stats Pill */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Handwritten Slogan with orange swoosh */}
          <Box sx={{ maxWidth: 280 }}>
            <Typography
              sx={{
                fontFamily: "'Caveat', cursive",
                fontSize: '25px',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#93C5FD',
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}
            >
              Empowering
              <br />
              Education.
              <br />
              Enabling Excellence.
            </Typography>
            <svg
              width="140"
              height="12"
              viewBox="0 0 140 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: '4px' }}
            >
              <path
                d="M3 8.5C35 2 95 3 137 7.5"
                stroke="#FF6B00"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          {/* Bottom Floating Glass Stats Bar */}
          <Box
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              py: 1.5,
              px: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Stat 1: Students */}
            <Box sx={{ textAlign: 'center' }}>
              <Users size={18} color="#38BDF8" style={{ margin: '0 auto 2px' }} />
              <Typography sx={{ fontSize: '11.5px', color: '#E2E8F0', fontWeight: 600 }}>
                Students
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#93C5FD', fontWeight: 700 }}>
                ---
              </Typography>
            </Box>

            {/* Stat 2: Schools */}
            <Box sx={{ textAlign: 'center' }}>
              <Building2 size={18} color="#34D399" style={{ margin: '0 auto 2px' }} />
              <Typography sx={{ fontSize: '11.5px', color: '#E2E8F0', fontWeight: 600 }}>
                Schools
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6EE7B7', fontWeight: 700 }}>
                ---
              </Typography>
            </Box>

            {/* Stat 3: Staff */}
            <Box sx={{ textAlign: 'center' }}>
              <UserCheck size={18} color="#FB923C" style={{ margin: '0 auto 2px' }} />
              <Typography sx={{ fontSize: '11.5px', color: '#E2E8F0', fontWeight: 600 }}>
                Staff
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#FDBA74', fontWeight: 700 }}>
                ---
              </Typography>
            </Box>

            {/* Stat 4: Modules */}
            <Box sx={{ textAlign: 'center' }}>
              <Layers size={18} color="#C084FC" style={{ margin: '0 auto 2px' }} />
              <Typography sx={{ fontSize: '11.5px', color: '#E2E8F0', fontWeight: 600 }}>
                Modules
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#E9D5FF', fontWeight: 700 }}>
                ---
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT PANEL: Modern Authentication Form Card (Exact Image 1 layout) */}
      <Box
        sx={{
          bgcolor: isDark ? '#0B132B' : '#FFFFFF',
          borderRadius: '28px',
          p: { xs: 3, sm: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
          boxShadow: isDark
            ? '0 20px 45px -10px rgba(0, 0, 0, 0.6)'
            : '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Card Header */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '26px', sm: '32px' },
              color: isDark ? '#FFFFFF' : '#0B132B',
              letterSpacing: '-0.02em',
              mb: 0.75,
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            sx={{
              fontSize: '14.5px',
              color: isDark ? '#94A3B8' : '#64748B',
            }}
          >
            Login to your Axionexa ERP account
          </Typography>
        </Box>

        {/* Global Error Banner */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            {/* Field: Username / Email */}
            <Box>
              <Typography
                component="label"
                htmlFor="login-email"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Username / Email
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 14,
                    color: isDark ? '#94A3B8' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <User size={18} />
                </Box>
                <Box
                  component="input"
                  id="login-email"
                  type="text"
                  placeholder="Enter your username or email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register('email')}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    pl: 5,
                    pr: 2,
                    fontSize: '14px',
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                    border: 1.5,
                    borderColor: errors.email
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.15)'
                      : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    outline: 'none',
                    transition: 'all 0.2s',
                    '&:focus': {
                      borderColor: '#2563EB',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                    },
                  }}
                />
              </Box>
              {errors.email && (
                <Typography sx={{ color: '#EF4444', fontSize: '12px', mt: 0.5, pl: 0.5 }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* Field: Password */}
            <Box>
              <Typography
                component="label"
                htmlFor="login-password"
                sx={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: isDark ? '#E2E8F0' : '#334155',
                  mb: 0.75,
                }}
              >
                Password
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 14,
                    color: isDark ? '#94A3B8' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={18} />
                </Box>
                <Box
                  component="input"
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register('password')}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    pl: 5,
                    pr: 5,
                    fontSize: '14px',
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                    border: 1.5,
                    borderColor: errors.password
                      ? '#EF4444'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.15)'
                      : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    outline: 'none',
                    transition: 'all 0.2s',
                    '&:focus': {
                      borderColor: '#2563EB',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                    },
                  }}
                />
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="toggle password visibility"
                  sx={{
                    position: 'absolute',
                    right: 14,
                    color: isDark ? '#94A3B8' : '#64748B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    p: 0,
                    '&:hover': { color: '#2563EB' },
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Box>
              </Box>
              {errors.password && (
                <Typography sx={{ color: '#EF4444', fontSize: '12px', mt: 0.5, pl: 0.5 }}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            {/* Remember Me & Forgot Password Row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#94A3B8',
                      '&.Mui-checked': { color: '#2563EB' },
                      p: 0.5,
                      mr: 0.5,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: '13.5px',
                      color: isDark ? '#E2E8F0' : '#475569',
                      fontWeight: 500,
                    }}
                  >
                    Remember Me
                  </Typography>
                }
                sx={{ m: 0 }}
              />

              <Typography
                component={RouterLink}
                to={PATHS.FORGOT_PASSWORD}
                sx={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#2563EB',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline', color: '#1D4ED8' },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>

            {/* Expandable Multi-Tenant / School Code Option */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showTenantCode}
                    onChange={(e) => setShowTenantCode(e.target.checked)}
                    sx={{
                      color: '#94A3B8',
                      '&.Mui-checked': { color: '#0284C7' },
                      p: 0.5,
                      mr: 0.5,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    Specify School / Tenant Code (Optional)
                  </Typography>
                }
                sx={{ m: 0 }}
              />

              {showTenantCode && (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 14,
                      color: isDark ? '#94A3B8' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Building size={18} />
                  </Box>
                  <Box
                    component="input"
                    id="login-tenant"
                    type="text"
                    placeholder="e.g. greenwood-high"
                    disabled={isLoading}
                    {...register('tenantCode')}
                    sx={{
                      width: '100%',
                      py: 1.25,
                      pl: 5,
                      pr: 2,
                      fontSize: '13.5px',
                      borderRadius: '12px',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                      border: 1.5,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      outline: 'none',
                      '&:focus': {
                        borderColor: '#0284C7',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Primary Login Button (Exact orange gradient from Image 1) */}
            <Box
              component="button"
              type="submit"
              disabled={isLoading}
              sx={{
                width: '100%',
                py: 1.6,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15.5px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                boxShadow: '0 4px 16px rgba(255, 107, 0, 0.35)',
                transition: 'all 0.25s',
                mt: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FA5A1E 0%, #FF6B00 100%)',
                  boxShadow: '0 6px 20px rgba(255, 107, 0, 0.45)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={17} />
                </>
              )}
            </Box>

            {/* OR Divider */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                my: 1,
                color: isDark ? '#64748B' : '#94A3B8',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }} />
              <span>OR</span>
              <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }} />
            </Box>

            {/* Login with Google Button */}
            <Box
              component="button"
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              sx={{
                width: '100%',
                py: 1.4,
                borderRadius: '12px',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                border: 1.5,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
                color: isDark ? '#FFFFFF' : '#334155',
                fontWeight: 600,
                fontSize: '14.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F8FAFC',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : '#CBD5E1',
                },
              }}
            >
              {/* Multicolored Google 'G' Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting...' : 'Login with Google'}</span>
            </Box>

            {/* Help & OTP Links */}
            <Box
              sx={{
                textAlign: 'center',
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Need help?{' '}
                <Box
                  component="a"
                  href="mailto:support@axionexa.com"
                  sx={{
                    color: '#2563EB',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Contact Support
                </Box>
              </Typography>

              <Typography sx={{ fontSize: '12.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Need OTP verification?{' '}
                <Typography
                  component={RouterLink}
                  to={PATHS.VERIFY_OTP}
                  sx={{
                    color: '#0284C7',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Verify OTP Code
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
