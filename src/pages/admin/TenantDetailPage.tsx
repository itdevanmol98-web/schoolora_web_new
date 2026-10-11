import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'
import { tenantService } from '@/features/tenants/tenantService'
import type { TenantItem, TenantSettings } from '@/features/tenants/types'
import { PATHS } from '@/routes/paths'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppLoading from '@/components/common/Loading'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import { formatDate } from '@/utils/formatters'

export const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [tenant, setTenant] = useState<TenantItem | null>(null)
  const [settings, setSettings] = useState<TenantSettings>({
    academic_year: '2026-2027',
    timezone: 'America/New_York',
    currency: 'USD',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Edit tenant modal
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDomain, setEditDomain] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  const [settingsLoading, setSettingsLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    if (!id) return
    let isCancelled = false

    Promise.allSettled([
      tenantService.getTenantById(id),
      tenantService.getTenantSettings(id),
    ])
      .then(([tenantResult, settingsResult]) => {
        if (!isCancelled) {
          if (tenantResult.status === 'fulfilled') {
            setTenant(tenantResult.value)
            setEditName(tenantResult.value.name)
            setEditDomain(tenantResult.value.customDomain || '')
          } else {
            setErrorMessage('Tenant record not found or inaccessible')
          }

          if (settingsResult.status === 'fulfilled') {
            setSettings((prev) => ({ ...prev, ...settingsResult.value }))
          }
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to retrieve tenant details'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [id, reloadTrigger])

  const fetchTenantData = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleUpdateTenant = async () => {
    if (!id || !editName.trim()) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      const updated = await tenantService.updateTenant(id, {
        name: editName.trim(),
        customDomain: editDomain.trim() || undefined,
      })
      setTenant(updated)
      setSuccessMessage('Tenant organization details saved')
      setEditOpen(false)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update tenant')
    } finally {
      setEditLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSettingsLoading(true)
    setErrorMessage(null)
    try {
      const updated = await tenantService.updateTenantSettings(id, settings)
      setSettings(updated)
      setSuccessMessage('Tenant institutional configuration saved')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <AppPageHeader title="Tenant Overview" onBack={() => navigate(PATHS.TENANTS)} />
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving institutional tenant profile and settings..." />
        </AppCard>
      </Box>
    )
  }

  if (errorMessage && !tenant) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <AppPageHeader title="Tenant Overview" onBack={() => navigate(PATHS.TENANTS)} />
        <AppErrorState
          title="Tenant Record Unavailable"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchTenantData}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <AppPageHeader
        title={tenant?.name || 'Tenant Details'}
        subtitle={`Tenant Code: ${tenant?.code} • ID: ${tenant?.id}`}
        onBack={() => navigate(PATHS.TENANTS)}
        badge={
          <Chip
            label={tenant?.status}
            color={tenant?.status === 'ACTIVE' ? 'success' : 'warning'}
            sx={{ fontWeight: 600 }}
          />
        }
        actions={
          <AppButton
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditOpen(true)}
          >
            Edit Tenant Details
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

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <AppCard title="Organization Profile" headerAction={<BusinessIcon color="action" />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Organization Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {tenant?.name}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Unique Code Identifier
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {tenant?.code}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Custom Domain
                </Typography>
                <Typography variant="body1">
                  {tenant?.customDomain || 'Default sub-domain routing'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Subscription Plan
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={tenant?.plan || 'STANDARD_TIER'} color="primary" size="small" />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created On
                </Typography>
                <Typography variant="body2">
                  {tenant?.createdAt ? formatDate(tenant.createdAt) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </AppCard>
        </Grid>

        {/* Tenant Settings Card */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <AppCard
            title="Institutional Configuration"
            subtitle="Tenant-level academic calendar & localization"
            headerAction={<SettingsIcon color="action" />}
          >
            <Box component="form" onSubmit={handleSaveSettings} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <AppTextField
                label="Academic Year"
                value={settings.academic_year || ''}
                onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                placeholder="2026-2027"
                fullWidth
              />

              <AppTextField
                label="Timezone"
                value={settings.timezone || ''}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                placeholder="America/New_York"
                fullWidth
              />

              <AppTextField
                label="Operating Currency"
                value={settings.currency || ''}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                placeholder="USD"
                fullWidth
              />

              <Box sx={{ pt: 1 }}>
                <AppButton
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loading={settingsLoading}
                  loadingText="Saving..."
                >
                  Save Configuration
                </AppButton>
              </Box>
            </Box>
          </AppCard>
        </Grid>
      </Grid>

      {/* Edit Tenant Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Tenant Profile"
        confirmText="Save Details"
        onConfirm={handleUpdateTenant}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <AppTextField
            label="Organization Name"
            required
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <AppTextField
            label="Custom Domain"
            fullWidth
            placeholder="portal.schoolname.edu"
            value={editDomain}
            onChange={(e) => setEditDomain(e.target.value)}
          />
        </Box>
      </AppDialog>
    </Box>
  )
}

export default TenantDetailPage
