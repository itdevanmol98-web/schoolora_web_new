import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MenuItem from '@mui/material/MenuItem'
import { billingService } from '@/features/billing/billingService'
import type { SubscriptionPlanItem, CreateSubscriptionPlanPayload } from '@/features/billing/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'

export const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create Dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateSubscriptionPlanPayload>({
    name: '',
    code: '',
    description: '',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    currency: 'USD',
    trialDays: 14,
    features: ['MULTI_BRANCH', 'STUDENT_PORTAL', 'ATTENDANCE_TRACKING', 'FEE_MANAGEMENT'],
    limits: {
      maxSchools: 3,
      maxBranches: 6,
      maxUsers: 500,
      storageLimitMb: 20480,
    },
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit Dialog
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null)
  const [editData, setEditData] = useState<{
    name: string
    monthlyPrice: number
    yearlyPrice: number
    trialDays: number
    status: string
  }>({
    name: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    trialDays: 0,
    status: 'ACTIVE',
  })
  const [editLoading, setEditLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    billingService
      .getSubscriptionPlans()
      .then((data) => {
        if (!isCancelled) {
          setPlans(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query subscription plans catalog'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchPlans = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleCreateSubmit = async () => {
    if (!createData.name.trim() || !createData.code.trim()) {
      setErrorMessage('Plan name and code are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await billingService.createSubscriptionPlan({
        ...createData,
        name: createData.name.trim(),
        code: createData.code.trim().toUpperCase(),
        monthlyPrice: Number(createData.monthlyPrice),
        yearlyPrice: Number(createData.yearlyPrice),
        trialDays: Number(createData.trialDays),
      })
      setSuccessMessage(`Subscription plan "${createData.name}" created`)
      setCreateOpen(false)
      fetchPlans()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create plan')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan)
    setEditData({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      trialDays: plan.trialDays,
      status: plan.status || 'ACTIVE',
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedPlan) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await billingService.updateSubscriptionPlan(selectedPlan.id, {
        name: editData.name,
        monthlyPrice: Number(editData.monthlyPrice),
        yearlyPrice: Number(editData.yearlyPrice),
        trialDays: Number(editData.trialDays),
        status: editData.status,
      })
      setSuccessMessage(`Plan "${editData.name}" updated`)
      setEditOpen(false)
      fetchPlans()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update plan')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="SaaS Subscription Plans Catalog"
        subtitle="Manage subscription tiers, multi-campus quotas, and pricing configurations"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Subscription Plan
          </AppButton>
        }
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
          <AppLoading message="Retrieving subscription plan catalog from backend..." />
        </AppCard>
      ) : errorMessage && plans.length === 0 ? (
        <AppErrorState
          title="Plans Catalog Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchPlans}
        />
      ) : plans.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Subscription Plans"
            description="The plan catalog is currently empty. Define plans for tenant onboarding."
            actionText="Create First Plan"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid key={plan.id} sx={{ xs: 12, md: 4 }}>
              <AppCard
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={plan.code}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={plan.status || 'ACTIVE'}
                      size="small"
                      color={plan.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    {plan.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mt: 0.5 }}>
                    {plan.description || 'Enterprise educational management tier.'}
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      ${plan.monthlyPrice}
                      <Typography component="span" variant="subtitle2" color="text.secondary">
                        {' '}/ month
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${plan.yearlyPrice} / year • {plan.trialDays}-day free trial
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Platform Quotas & Limits:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      • Max Schools: <strong>{plan.limits?.maxSchools ?? 'Unlimited'}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Max Branches: <strong>{plan.limits?.maxBranches ?? 'Unlimited'}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Max Users: <strong>{plan.limits?.maxUsers ?? 'Unlimited'}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Storage: <strong>{plan.limits?.storageLimitMb ? `${Math.round(Number(plan.limits.storageLimitMb) / 1024)} GB` : 'Standard'}</strong>
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Included Features:
                  </Typography>
                  <List dense disablePadding>
                    {(plan.features || []).map((feat, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {feat.replace(/_/g, ' ')}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ pt: 2, mt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <AppButton
                    fullWidth
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => openEdit(plan)}
                  >
                    Edit Plan Pricing & Limits
                  </AppButton>
                </Box>
              </AppCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Plan Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Subscription Plan Tier"
        confirmText="Create Plan"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Plan Name"
              required
              fullWidth
              placeholder="e.g. Standard Plan"
              value={createData.name}
              onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
            />
            <AppTextField
              label="Plan Code"
              required
              fullWidth
              placeholder="STANDARD_TIER"
              value={createData.code}
              onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
            />
          </Box>

          <AppTextField
            label="Plan Description"
            fullWidth
            placeholder="Standard features for mid-sized educational campuses"
            value={createData.description || ''}
            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Monthly Price ($)"
              type="number"
              required
              fullWidth
              value={createData.monthlyPrice}
              onChange={(e) => setCreateData({ ...createData, monthlyPrice: Number(e.target.value) })}
            />
            <AppTextField
              label="Yearly Price ($)"
              type="number"
              required
              fullWidth
              value={createData.yearlyPrice}
              onChange={(e) => setCreateData({ ...createData, yearlyPrice: Number(e.target.value) })}
            />
            <AppTextField
              label="Trial Days"
              type="number"
              required
              fullWidth
              value={createData.trialDays}
              onChange={(e) => setCreateData({ ...createData, trialDays: Number(e.target.value) })}
            />
          </Box>
        </Box>
      </AppDialog>

      {/* Edit Plan Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit Plan: ${selectedPlan?.name}`}
        confirmText="Save Plan"
        onConfirm={handleEditSubmit}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="Plan Name"
            required
            fullWidth
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Monthly Price ($)"
              type="number"
              required
              fullWidth
              value={editData.monthlyPrice}
              onChange={(e) => setEditData({ ...editData, monthlyPrice: Number(e.target.value) })}
            />
            <AppTextField
              label="Yearly Price ($)"
              type="number"
              required
              fullWidth
              value={editData.yearlyPrice}
              onChange={(e) => setEditData({ ...editData, yearlyPrice: Number(e.target.value) })}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Trial Days"
              type="number"
              required
              fullWidth
              value={editData.trialDays}
              onChange={(e) => setEditData({ ...editData, trialDays: Number(e.target.value) })}
            />

            <AppSelect
              label="Status"
              fullWidth
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value as string })}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
            </AppSelect>
          </Box>
        </Box>
      </AppDialog>
    </Box>
  )
}

export default SubscriptionPlansPage
