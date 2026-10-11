import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import BusinessIcon from '@mui/icons-material/Business'
import SchoolIcon from '@mui/icons-material/School'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PaymentIcon from '@mui/icons-material/Payment'
import HistoryIcon from '@mui/icons-material/History'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { dashboardService } from '@/features/dashboard/dashboardService'
import type { SuperAdminDashboardMetrics } from '@/features/dashboard/types'
import { PATHS } from '@/routes/paths'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppLoading from '@/components/common/Loading'
import AppErrorState from '@/components/common/ErrorState'
import { formatDate } from '@/utils/formatters'

export const SuperAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<SuperAdminDashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    dashboardService
      .getDashboardMetrics()
      .then((data) => {
        if (!isCancelled) {
          setMetrics(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to retrieve system dashboard metrics'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchMetrics = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <AppPageHeader
          title="Super Admin Dashboard"
          subtitle="System-wide metrics and tenant management telemetry"
        />
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Aggregating platform telemetry across institutional endpoints..." />
        </AppCard>
      </Box>
    )
  }

  if (errorMessage && !metrics) {
    return (
      <Box sx={{ p: 2 }}>
        <AppPageHeader
          title="Super Admin Dashboard"
          subtitle="System-wide metrics and tenant management telemetry"
        />
        <AppErrorState
          title="Telemetry Connection Failed"
          message={errorMessage}
          retryText="Retry Metrics Query"
          onRetry={fetchMetrics}
        />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Institutional Tenants',
      value: metrics?.totalTenants ?? 0,
      subValue: `${metrics?.activeTenants ?? 0} active organizations`,
      icon: <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      route: PATHS.TENANTS,
      color: 'primary.main',
    },
    {
      title: 'Campuses & Schools',
      value: metrics?.totalSchools ?? 0,
      subValue: 'Across all registered tenants',
      icon: <SchoolIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
      route: PATHS.SCHOOLS,
      color: 'secondary.main',
    },
    {
      title: 'Branches & Wings',
      value: metrics?.totalBranches ?? 0,
      subValue: 'Campus annexes & departments',
      icon: <AccountTreeIcon sx={{ fontSize: 32, color: 'info.main' }} />,
      route: PATHS.BRANCHES,
      color: 'info.main',
    },
    {
      title: 'Registered Users',
      value: metrics?.totalUsers ?? 0,
      subValue: `${metrics?.activeUsers ?? 0} active accounts`,
      icon: <PeopleIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      route: PATHS.USERS,
      color: 'success.main',
    },
    {
      title: 'Subscription Plans',
      value: metrics?.totalSubscriptionPlans ?? 0,
      subValue: 'SaaS tier catalog definitions',
      icon: <CardMembershipIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
      route: PATHS.SUBSCRIPTION_PLANS,
      color: 'warning.main',
    },
    {
      title: 'Platform Invoices',
      value: metrics?.totalInvoices ?? 0,
      subValue: `${metrics?.openInvoices ?? 0} open invoices pending`,
      icon: <ReceiptIcon sx={{ fontSize: 32, color: 'error.main' }} />,
      route: PATHS.INVOICES,
      color: 'error.main',
    },
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Super Admin Dashboard"
        subtitle="Multi-Tenant platform operations, institutional metrics, and subscription telemetry"
        actions={
          <AppButton
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={() => navigate(PATHS.BILLING_ANALYTICS)}
          >
            Billing Analytics
          </AppButton>
        }
      />

      {errorMessage && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Primary KPI Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid key={idx} sx={{ xs: 12, sm: 6, md: 4 }}>
            <AppCard
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>{card.icon}</Box>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {card.value}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                {card.subValue}
              </Typography>

              <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                <AppButton
                  variant="text"
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate(card.route)}
                  sx={{ px: 0 }}
                >
                  Manage {card.title}
                </AppButton>
              </Box>
            </AppCard>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Information: Subscription Posture & Audit Trail */}
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, md: 6 }}>
          <AppCard title="Subscription & Tenant Posture" subtitle="Active tenant subscription tier">
            {metrics?.currentSubscription ? (
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {metrics.currentSubscription.plan?.name || 'Current SaaS Subscription'}
                  </Typography>
                  <Chip
                    label={metrics.currentSubscription.status}
                    color={metrics.currentSubscription.status === 'ACTIVE' ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Billing Cycle: <strong>{metrics.currentSubscription.billingCycle}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Start Date: {formatDate(metrics.currentSubscription.startDate)}
                </Typography>
                <AppButton
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(PATHS.SUBSCRIPTIONS)}
                >
                  Manage Subscriptions
                </AppButton>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Platform tenant root account or trial tier active.
                </Typography>
                <AppButton
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(PATHS.SUBSCRIPTION_PLANS)}
                >
                  Explore Subscription Plans
                </AppButton>
              </Box>
            )}
          </AppCard>
        </Grid>

        <Grid sx={{ xs: 12, md: 6 }}>
          <AppCard
            title="Recent Audit Activity"
            subtitle="Latest administrative security events"
            headerAction={
              <AppButton
                variant="text"
                size="small"
                onClick={() => navigate(PATHS.AUDIT_LOGS)}
              >
                View Full Audit
              </AppButton>
            }
          >
            {metrics?.recentAudits && metrics.recentAudits.length > 0 ? (
              <List disablePadding>
                {metrics.recentAudits.map((audit, idx) => (
                  <ListItem
                    key={audit.id || idx}
                    divider={idx < metrics.recentAudits.length - 1}
                    sx={{ px: 0, py: 1 }}
                  >
                    <Box sx={{ mr: 2, color: 'text.secondary' }}>
                      <HistoryIcon fontSize="small" />
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={audit.action}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {audit.resource}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {audit.userEmail || 'System'} • {formatDate(audit.createdAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No recent security audit events recorded.
                </Typography>
              </Box>
            )}
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SuperAdminDashboardPage
