import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CancelIcon from '@mui/icons-material/Cancel'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import { billingService } from '@/features/billing/billingService'
import type {
  TenantSubscriptionItem,
  SubscriptionPlanItem,
  BillingCycle,
} from '@/features/billing/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppDialog from '@/components/common/AppDialog'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import { formatDate } from '@/utils/formatters'

export const TenantSubscriptionsPage: React.FC = () => {
  const [currentSub, setCurrentSub] = useState<TenantSubscriptionItem | null>(null)
  const [history, setHistory] = useState<TenantSubscriptionItem[]>([])
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Change Plan Modal
  const [changePlanOpen, setChangePlanOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('MONTHLY')
  const [changeLoading, setChangeLoading] = useState(false)

  // Renew Loading
  const [renewLoading, setRenewLoading] = useState(false)

  // Cancel Dialog
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    Promise.allSettled([
      billingService.getCurrentSubscription(),
      billingService.getSubscriptionHistory(),
      billingService.getSubscriptionPlans(),
    ])
      .then(([currentRes, historyRes, plansRes]) => {
        if (!isCancelled) {
          if (currentRes.status === 'fulfilled') {
            setCurrentSub(currentRes.value)
          }
          if (historyRes.status === 'fulfilled') {
            setHistory(historyRes.value)
          }
          if (plansRes.status === 'fulfilled') {
            setPlans(plansRes.value)
            if (plansRes.value.length > 0) {
              setSelectedPlanId((prev) => prev || plansRes.value[0].id)
            }
          }
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query tenant subscription details'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchSubscriptionData = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleChangePlan = async () => {
    if (!selectedPlanId) return
    setChangeLoading(true)
    setErrorMessage(null)
    try {
      if (currentSub) {
        await billingService.changeSubscriptionPlan({
          newPlanId: selectedPlanId,
          newCycle: selectedCycle,
        })
        setSuccessMessage('Subscription tier updated successfully')
      } else {
        await billingService.subscribeToPlan({
          planId: selectedPlanId,
          billingCycle: selectedCycle,
          withTrial: true,
        })
        setSuccessMessage('Subscribed to plan successfully')
      }
      setChangePlanOpen(false)
      fetchSubscriptionData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update subscription')
    } finally {
      setChangeLoading(false)
    }
  }

  const handleRenew = async () => {
    setRenewLoading(true)
    setErrorMessage(null)
    try {
      await billingService.renewSubscription()
      setSuccessMessage('Subscription renewed successfully')
      fetchSubscriptionData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to renew subscription')
    } finally {
      setRenewLoading(false)
    }
  }

  const handleCancel = async () => {
    setCancelLoading(true)
    setErrorMessage(null)
    try {
      await billingService.cancelSubscription(false)
      setSuccessMessage('Subscription cancelled. Access remains active through current billing term.')
      setCancelOpen(false)
      fetchSubscriptionData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to cancel subscription')
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'TRIALING':
      case 'GRACE_PERIOD':
        return 'warning'
      case 'PAST_DUE':
      case 'CANCELLED':
      case 'EXPIRED':
      case 'SUSPENDED':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <AppPageHeader
        title="Institutional Subscription & Entitlements"
        subtitle="Manage active SaaS contract, renewal status, multi-campus allowances, and billing history"
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving institutional subscription status and history from backend..." />
        </AppCard>
      ) : (
        <Grid container spacing={3}>
          {/* Active Contract Card */}
          <Grid sx={{ xs: 12, md: 7 }}>
            <AppCard
              title="Current Subscription Contract"
              subtitle={currentSub ? `Plan ID: ${currentSub.planId}` : 'No active contract recorded'}
              headerAction={<CardMembershipIcon color="primary" />}
            >
              {currentSub ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {currentSub.plan?.name || 'Academic SaaS Tier'}
                    </Typography>
                    <Chip
                      label={currentSub.status}
                      color={getStatusColor(currentSub.status)}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Billing Cycle: <strong>{currentSub.billingCycle}</strong>
                  </Typography>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid sx={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Contract Started
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(currentSub.startDate)}
                      </Typography>
                    </Grid>

                    <Grid sx={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Renewal / Expiry Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {currentSub.renewsAt ? formatDate(currentSub.renewsAt) : currentSub.endDate ? formatDate(currentSub.endDate) : 'Active Term'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, pt: 2, flexWrap: 'wrap' }}>
                    <AppButton
                      variant="contained"
                      startIcon={<UpgradeIcon />}
                      onClick={() => setChangePlanOpen(true)}
                    >
                      Change Subscription Tier
                    </AppButton>

                    <AppButton
                      variant="outlined"
                      startIcon={<AutorenewIcon />}
                      loading={renewLoading}
                      loadingText="Renewing..."
                      onClick={handleRenew}
                    >
                      Renew Term
                    </AppButton>

                    {currentSub.status !== 'CANCELLED' && (
                      <AppButton
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => setCancelOpen(true)}
                      >
                        Cancel Contract
                      </AppButton>
                    )}
                  </Box>
                </Box>
              ) : (
                <AppEmptyState
                  title="No Active Subscription"
                  description="Tenant is operating under root evaluation mode. Select a plan to establish institutional contract."
                  actionText="Subscribe to Plan"
                  onAction={() => setChangePlanOpen(true)}
                />
              )}
            </AppCard>
          </Grid>

          {/* Quick Entitlements Card */}
          <Grid sx={{ xs: 12, md: 5 }}>
            <AppCard title="Campus Allowances & Quotas">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Campus Entitlements
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currentSub?.plan?.limits?.maxSchools ?? 'Configured via Tenant Plan'} Max Schools
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Branch Allotment
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currentSub?.plan?.limits?.maxBranches ?? 'Configured via Tenant Plan'} Max Branches
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Account Capacity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currentSub?.plan?.limits?.maxUsers ?? 'Configured via Tenant Plan'} Licensed Users
                  </Typography>
                </Box>
              </Box>
            </AppCard>
          </Grid>

          {/* Subscription History Log */}
          <Grid sx={{ xs: 12 }}>
            <AppCard title="Subscription Contract History" subtitle="Chronological record of plan transitions">
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No prior subscription cycle records available.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {history.map((h) => (
                    <Box
                      key={h.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {h.plan?.name || `Plan ID: ${h.planId}`} ({h.billingCycle})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Initiated: {formatDate(h.startDate)} • ID: {h.id.slice(0, 8)}
                        </Typography>
                      </Box>
                      <Chip
                        label={h.status}
                        size="small"
                        color={getStatusColor(h.status)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </AppCard>
          </Grid>
        </Grid>
      )}

      {/* Change Plan Dialog */}
      <AppDialog
        open={changePlanOpen}
        onClose={() => setChangePlanOpen(false)}
        title={currentSub ? 'Change Subscription Plan Tier' : 'Subscribe to SaaS Tier'}
        confirmText="Confirm Subscription"
        onConfirm={handleChangePlan}
        loading={changeLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <AppSelect
            label="Select Plan Tier"
            fullWidth
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value as string)}
          >
            {plans.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} (${p.monthlyPrice}/mo or ${p.yearlyPrice}/yr)
              </MenuItem>
            ))}
          </AppSelect>

          <AppSelect
            label="Billing Interval"
            fullWidth
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value as BillingCycle)}
          >
            <MenuItem value="MONTHLY">Monthly Invoicing</MenuItem>
            <MenuItem value="YEARLY">Annual Invoicing (Discounted)</MenuItem>
          </AppSelect>
        </Box>
      </AppDialog>

      {/* Cancel Subscription Dialog */}
      <AppConfirmDialog
        open={cancelOpen}
        title="Cancel Institutional Subscription?"
        message="Cancelling your subscription will prevent automated renewals. You will retain operational access until the conclusion of the active term."
        confirmText="Cancel Subscription"
        confirmColor="error"
        loading={cancelLoading}
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      />
    </Box>
  )
}

export default TenantSubscriptionsPage
