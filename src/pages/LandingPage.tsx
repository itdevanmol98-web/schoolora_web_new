import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

// Icons
import SchoolIcon from '@mui/icons-material/School'
import ApartmentIcon from '@mui/icons-material/Apartment'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SecurityIcon from '@mui/icons-material/Security'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DnsIcon from '@mui/icons-material/Dns'
import InsightsIcon from '@mui/icons-material/Insights'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import BoltIcon from '@mui/icons-material/Bolt'
import ShieldIcon from '@mui/icons-material/Shield'
import SpeedIcon from '@mui/icons-material/Speed'
import LayersIcon from '@mui/icons-material/Layers'
import StorageIcon from '@mui/icons-material/Storage'
import LockIcon from '@mui/icons-material/Lock'

import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { useThemeMode } from '@/theme/ThemeProvider'
import { env } from '@/config/env'
import { PATHS } from '@/routes/paths'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { mode, toggleTheme } = useThemeMode()
  const [activePreviewTab, setActivePreviewTab] = useState(0)

  const isDark = theme.palette.mode === 'dark'

  const platformCapabilities = [
    {
      title: 'Multi-Tenant Governance',
      category: 'Institutional Hierarchy',
      desc: 'Complete institutional isolation with parent organizations, school campuses, and branch networks under a single roof.',
      icon: <ApartmentIcon sx={{ fontSize: 32 }} />,
      color: '#3B82F6',
      features: ['Group & Single-Tenant support', 'Cross-campus management', 'Automatic x-tenant-id scoping'],
    },
    {
      title: 'Fine-Grained RBAC & Security',
      category: 'Access Control',
      desc: 'Granular permissions matrix with pre-configured roles (Super Admin, Campus Admin, Bursar) and custom role creation.',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
      color: '#8B5CF6',
      features: ['Module-level permission policies', 'Temporary credential generation', 'Session invalidation & MFA ready'],
    },
    {
      title: 'Subscription & Automated Billing',
      category: 'Financial Operations',
      desc: 'Automated invoice scheduling, recurring plan upgrades/renewals, manual payment recording, and coupon validation.',
      icon: <ReceiptLongIcon sx={{ fontSize: 32 }} />,
      color: '#10B981',
      features: ['Tiered subscription plans', 'Invoice status lifecycles', 'Promo discount engine'],
    },
    {
      title: 'White-Label Custom Domains',
      category: 'Branding & DNS',
      desc: 'Connect dedicated institution domains with automated TXT/CNAME verification, SSL termination, and primary routing.',
      icon: <DnsIcon sx={{ fontSize: 32 }} />,
      color: '#06B6D4',
      features: ['Live DNS verification probe', 'Primary domain toggling', 'Custom tenant subdomains'],
    },
    {
      title: 'Executive Financial Telemetry',
      category: 'Analytics & Reporting',
      desc: 'Instant operational insight into platform health, receivables ledger, collected revenue, and active student licenses.',
      icon: <InsightsIcon sx={{ fontSize: 32 }} />,
      color: '#F59E0B',
      features: ['Aggregated KPI scorecards', 'Real-time billing analytics', 'Payment success tracking'],
    },
    {
      title: 'Enterprise Audit Trail',
      category: 'Compliance & Governance',
      desc: 'Comprehensive immutable logging of administrative actions, user changes, credential resets, and system updates.',
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      color: '#EC4899',
      features: ['Search & resource filters', 'Actor telemetry & IP recording', 'Diff inspection dialogs'],
    },
  ]

  const metrics = [
    { value: '500+', label: 'Educational Campuses', sub: 'Multi-branch institutional hierarchy' },
    { value: '99.99%', label: 'Platform Availability', sub: 'High-availability cloud uptime' },
    { value: '100%', label: 'Tenant Data Isolation', sub: 'Hardware & schema boundary protection' },
    { value: '< 100ms', label: 'Average Response Time', sub: 'High-throughput optimized endpoints' },
  ]

  const architecturalPillars = [
    {
      title: 'React 19 + TypeScript',
      desc: 'Strict type safety with comprehensive interface models for zero-runtime bug confidence.',
      icon: <LayersIcon color="primary" />,
    },
    {
      title: 'Material UI (MUI v6)',
      desc: 'Cohesive enterprise design system with light/dark theme persistence and custom components.',
      icon: <SpeedIcon color="secondary" />,
    },
    {
      title: 'Redux Toolkit + RTK',
      desc: 'Deterministic centralized state management for session auth and multi-tenant context.',
      icon: <SecurityIcon color="primary" />,
    },
    {
      title: 'Axios Interceptor Engine',
      desc: `Configured for ${env.apiBaseUrl} with automatic token refresh rotation and error normalization.`,
      icon: <StorageIcon color="secondary" />,
    },
  ]

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* 1. Sticky Navigation Header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backdropFilter: 'blur(16px)',
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderBottom: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.75,
            }}
          >
            {/* Brand Logo */}
            <Box
              onClick={() => navigate(PATHS.ROOT)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  color: '#fff',
                }}
              >
                <SchoolIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    background: isDark
                      ? 'linear-gradient(90deg, #FFFFFF 0%, #94A3B8 100%)'
                      : 'linear-gradient(90deg, #0F172A 0%, #334155 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Schoolora ERP
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Enterprise Education Cloud
                </Typography>
              </Box>
            </Box>

            {/* Quick Navigation Links */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
            >
              <Typography
                component="a"
                href="#capabilities"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Platform Capabilities
              </Typography>
              <Typography
                component="a"
                href="#architecture"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Architecture
              </Typography>
              <Typography
                component="a"
                href="#security"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Security & RBAC
              </Typography>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Tooltip title={mode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}>
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  }}
                >
                  {mode === 'dark' ? (
                    <LightModeIcon fontSize="small" sx={{ color: '#FBBF24' }} />
                  ) : (
                    <DarkModeIcon fontSize="small" sx={{ color: '#475569' }} />
                  )}
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(PATHS.LOGIN)}
                sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Sign In
              </Button>

              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                Super Admin
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 2. Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          background: isDark
            ? 'radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0) 70%)'
            : 'radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 860, mx: 'auto', textAlign: 'center' }}>
            {/* Version Badge */}
            <Chip
              icon={<BoltIcon sx={{ fontSize: '18px !important', color: '#3B82F6' }} />}
              label="Enterprise Multi-Tenant Cloud ERP • v3.0 Production Ready"
              sx={{
                mb: 3,
                px: 1.5,
                py: 2.2,
                fontSize: '0.825rem',
                fontWeight: 600,
                borderRadius: 4,
                bgcolor: isDark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                color: isDark ? '#93C5FD' : '#1D4ED8',
                border: 1,
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
              }}
            />

            {/* H1 Heading */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' },
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: { xs: 1.15, md: 1.1 },
                mb: 3,
              }}
            >
              Schoolora ERP Platform
            </Typography>

            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                fontWeight: 700,
                mb: 3,
                background: isDark
                  ? 'linear-gradient(90deg, #60A5FA 0%, #2DD4BF 100%)'
                  : 'linear-gradient(90deg, #2563EB 0%, #0D9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Intelligent Multi-Campus Governance & Enterprise Operations
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.15rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 720,
                mx: 'auto',
                mb: 5,
              }}
            >
              The comprehensive institutional operating system designed for educational groups,
              universities, and schools. Unifying multi-tenant isolation, role-based access control,
              campus branches, automated billing, and live financial telemetry.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 6, justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                  },
                }}
              >
                Launch Super Admin Portal
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(PATHS.LOGIN)}
                sx={{
                  px: 3.5,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Institution Sign In
              </Button>
            </Stack>

            {/* Micro Feature Bullets */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 4 }}
              sx={{ color: 'text.secondary', fontSize: '0.875rem', justifyContent: 'center', alignItems: 'center' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                <span>Zero Cross-Tenant Leakage</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                <span>Infinite Branch Hierarchy</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                <span>Real-Time Automated Billing</span>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 3. Interactive Platform Showcase Preview */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            background: isDark
              ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            boxShadow: isDark
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
              : '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
          }}
        >
          {/* Mock Window Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#EF4444' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
              <Typography
                variant="caption"
                sx={{ ml: 1.5, color: 'text.secondary', fontWeight: 600 }}
              >
                schoolora.io/admin/dashboard — Production Telemetry Console
              </Typography>
            </Stack>

            <Chip
              label="LIVE TELEMETRY"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.65rem' }}
            />
          </Box>

          {/* Interactive Showcase Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs
              value={activePreviewTab}
              onChange={(_, val) => setActivePreviewTab(val)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<ApartmentIcon />} iconPosition="start" label="Institutional Tenants" />
              <Tab icon={<AdminPanelSettingsIcon />} iconPosition="start" label="RBAC & Permissions" />
              <Tab icon={<ReceiptLongIcon />} iconPosition="start" label="Automated Billing" />
              <Tab icon={<DnsIcon />} iconPosition="start" label="Custom Domains" />
            </Tabs>
          </Box>

          {/* Tab Previews */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {activePreviewTab === 0 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Tenant Scoping</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Greenwood International</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Domain: <code>greenwood.edu</code> | Code: <code>GRN-01</code></Typography>
                    <Chip label="ACTIVE • MULTI-CAMPUS" color="success" size="small" sx={{ mt: 1.5, fontWeight: 600 }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Campus Branches</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>3 Active Campus Branches</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>North Wing (Main), South Wing, STEM Research Hub</Typography>
                    <Chip label="BRANCH AUTO-SCOPED" color="primary" size="small" sx={{ mt: 1.5, fontWeight: 600 }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Data Segregation</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Isolated PostgreSQL Store</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Strict row-level security with injected header enforcement.</Typography>
                    <Chip label="100% ISOLATED" color="info" size="small" sx={{ mt: 1.5, fontWeight: 600 }} />
                  </Box>
                </Grid>
              </Grid>
            )}

            {activePreviewTab === 1 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Role Engine</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Super Administrator</Typography>
                    <Typography variant="body2" color="text.secondary">Full platform governance, tenant provisioning, and billing ledger access.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Campus Administration</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Campus Director</Typography>
                    <Typography variant="body2" color="text.secondary">Scoped to institutional branches, faculty rosters, and local student metrics.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Security Matrix</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>30+ Granular Permissions</Typography>
                    <Typography variant="body2" color="text.secondary">Action-level authorization across Users, Schools, Domains, and Billing.</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activePreviewTab === 2 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Plan Management</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Standard & Enterprise</Typography>
                    <Typography variant="body2" color="text.secondary">Tiered multi-campus subscriptions with monthly and annual billing cycles.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Invoices & Receivables</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Lifecycle Automated Invoicing</Typography>
                    <Typography variant="body2" color="text.secondary">Draft, Open, Paid, and Void states with audit trail reconciliations.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Promo Engine</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Coupons & Discounts</Typography>
                    <Typography variant="body2" color="text.secondary">Real-time discount validation rules, percentage/fixed deductions, and expiry gates.</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activePreviewTab === 3 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Custom Hostnames</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>portal.cambridge.edu</Typography>
                    <Typography variant="body2" color="text.secondary">Direct white-label branding matching institutional identity.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">Verification Engine</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Automated DNS Probes</Typography>
                    <Typography variant="body2" color="text.secondary">CNAME and TXT verification endpoints ensure ownership before routing.</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="overline" color="text.secondary">SSL & Security</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Automatic TLS Encryption</Typography>
                    <Typography variant="body2" color="text.secondary">Continuous certificate health checks and primary domain enforcement.</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>

      {/* 4. KPI Metrics Banner */}
      <Box
        sx={{
          py: 7,
          bgcolor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)',
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {metrics.map((stat, idx) => (
              <Grid size={{ xs: 6, md: 3 }} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {stat.sub}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Core Platform Capabilities Grid */}
      <Box id="capabilities" sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 8 }}>
            <Chip
              label="Modular Enterprise Features"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
              Everything Required to Run Complex Educational Networks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Designed from the ground up to replace fragmented legacy tools with a unified, high-integrity cloud infrastructure.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {platformCapabilities.map((cap, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3.5,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#FFFFFF',
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'primary.main',
                      boxShadow: isDark
                        ? '0 16px 32px -10px rgba(0,0,0,0.5)'
                        : '0 16px 32px -10px rgba(37, 99, 235, 0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(37, 99, 235, 0.08)',
                      color: cap.color,
                      mb: 2.5,
                    }}
                  >
                    {cap.icon}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: cap.color,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      mb: 0.5,
                    }}
                  >
                    {cap.category}
                  </Typography>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {cap.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                    {cap.desc}
                  </Typography>

                  <Divider sx={{ mb: 2.5 }} />

                  <Stack spacing={1}>
                    {cap.features.map((feat, fIdx) => (
                      <Box key={fIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: cap.color }} />
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. Security, Compliance & Data Governance */}
      <Box
        id="security"
        sx={{
          py: 10,
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.8)',
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                icon={<ShieldIcon sx={{ fontSize: '18px !important' }} />}
                label="Enterprise Security Standard"
                color="secondary"
                size="small"
                sx={{ mb: 2, fontWeight: 600 }}
              />
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2.5 }}>
                Zero-Trust Isolation Built for Academic Data Privacy
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Protect student records, payroll data, fee receipts, and institutional assets with robust architectural security guarantees built into every layer.
              </Typography>

              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <LockIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Automatic Tenant Header Scoping
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Every outbound request automatically injects verified <code>x-tenant-id</code> headers, preventing accidental cross-tenant data exposure.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'secondary.main',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <VerifiedUserIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Token Refresh Rotation & Session Revocation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automatic silent token refresh with anti-loop guard and centralized session invalidation on demand.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#10B981',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <SecurityIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Immutable Security Audit Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Full historical trail of role modifications, administrative password resets, and permission updates.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Architecture Graphic Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#FFFFFF',
                  border: 1,
                  borderColor: 'divider',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Security & Integration Telemetry
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Active configuration status for connected Node.js/Express backend service.
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Connected API Base Endpoint</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {env.apiBaseUrl}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Runtime Environment</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {env.isDev ? 'Development Sandbox (Active)' : 'Production Grade Cluster'}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Error Handler & Interceptor</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Normalized Error Pipeline
                      </Typography>
                    </Box>
                    <Chip label="OPERATIONAL" size="small" color="success" sx={{ fontWeight: 700 }} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 7. Architectural Foundation */}
      <Box id="architecture" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
              Architectural Foundation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Engineered with modern frontend standards, full strict-mode type checking, and reactive state stores.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {architecturalPillars.map((pillar, pIdx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={pIdx}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>{pillar.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {pillar.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 8. Call To Action Banner */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 5, md: 8 },
            borderRadius: 5,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0F766E 100%)',
            color: '#fff',
            boxShadow: '0 24px 48px -12px rgba(30, 58, 138, 0.4)',
          }}
        >
          <Box sx={{ maxWidth: 680, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}
            >
              Ready to Modernize Your Educational Network?
            </Typography>
            <Typography
              variant="h6"
              sx={{ opacity: 0.9, fontWeight: 400, mb: 4, lineHeight: 1.6 }}
            >
              Access the live Schoolora ERP suite. Test multi-tenant management, configure campus branches, assign RBAC roles, and manage billing statements.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
                sx={{
                  bgcolor: '#fff',
                  color: '#1E3A8A',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}
              >
                Access Super Admin Console
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(PATHS.LOGIN)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3.5,
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sign In to School Account
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* 9. Professional Enterprise Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: isDark ? '#0B0F19' : '#0F172A',
          color: '#E2E8F0',
          borderTop: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: '#fff',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                  Schoolora ERP
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, maxWidth: 320 }}>
                Enterprise multi-tenant educational platform delivering unified campus governance, billing, and role security.
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Dashboard
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.TENANTS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Tenants
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.SCHOOLS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Schools & Campuses
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.BRANCHES)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Branches
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
                Security & Access
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.USERS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  User Administration
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.ROLES)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Roles & Permissions
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.DOMAINS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Custom Domains
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.AUDIT_LOGS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Audit Logs
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
                Billing & Accounts
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.SUBSCRIPTION_PLANS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Subscription Plans
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.INVOICES)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Invoices
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.PAYMENTS)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Payment History
                </Typography>
                <Typography
                  component="a"
                  onClick={() => navigate(PATHS.LOGIN)}
                  sx={{ color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem', '&:hover': { color: '#fff' } }}
                >
                  Portal Sign In
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              © {new Date().getFullYear()} Schoolora ERP Inc. All rights reserved.
            </Typography>

            <Stack direction="row" spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Systems Fully Operational
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                v3.0.0 Enterprise
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
