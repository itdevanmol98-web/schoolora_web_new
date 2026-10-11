import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import SaveIcon from '@mui/icons-material/Save'
import SettingsIcon from '@mui/icons-material/Settings'
import { settingsService } from '@/features/settings/settingsService'
import type { TenantPlatformSettings } from '@/features/settings/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppErrorState from '@/components/common/ErrorState'

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<TenantPlatformSettings>({
    school_name: '',
    date_format: 'YYYY-MM-DD',
    currency_symbol: '$',
    support_email: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    settingsService
      .getSettings()
      .then((data) => {
        if (!isCancelled) {
          setSettings({
            school_name: data.school_name || '',
            date_format: data.date_format || 'YYYY-MM-DD',
            currency_symbol: data.currency_symbol || '$',
            support_email: data.support_email || '',
          })
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query tenant settings from backend'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchSettings = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updated = await settingsService.updateSettings(settings)
      setSettings(updated)
      setSuccessMessage('Institutional settings updated successfully')
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to save settings'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <AppPageHeader title="Tenant & System Settings" subtitle="Configure institutional parameters" />
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving institutional configuration..." />
        </AppCard>
      </Box>
    )
  }

  if (errorMessage && !settings.school_name) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <AppPageHeader title="Tenant & System Settings" subtitle="Configure institutional parameters" />
        <AppErrorState
          title="Settings Unavailable"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchSettings}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <AppPageHeader
        title="Tenant & System Settings"
        subtitle="Manage institution brand identity, date presentation, and notification addresses"
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

      <AppCard
        title="Institutional Parameters"
        subtitle="Settings applied across campus operations"
        headerAction={<SettingsIcon color="action" />}
      >
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={3}>
            <Grid sx={{ xs: 12 }}>
              <AppTextField
                label="Institution / School Display Name"
                fullWidth
                placeholder="e.g. Springfield International Academy"
                value={settings.school_name || ''}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                helperText="Displayed across headers, student reports, and official notices"
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6 }}>
              <AppSelect
                label="Date Format"
                fullWidth
                value={settings.date_format || 'YYYY-MM-DD'}
                onChange={(e) => setSettings({ ...settings, date_format: e.target.value as string })}
              >
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2026-10-10)</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (10/10/2026)</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (10/10/2026)</MenuItem>
                <MenuItem value="DD MMM YYYY">DD MMM YYYY (10 Oct 2026)</MenuItem>
              </AppSelect>
            </Grid>

            <Grid sx={{ xs: 12, sm: 6 }}>
              <AppTextField
                label="Currency Symbol"
                fullWidth
                placeholder="$"
                value={settings.currency_symbol || '$'}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <AppTextField
                label="Institutional Support Email"
                type="email"
                fullWidth
                placeholder="support@springfield.edu"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                helperText="Primary contact address for portal inquiries and password reset notifications"
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <Box sx={{ pt: 1 }}>
                <AppButton
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loading={isSaving}
                  loadingText="Saving Settings..."
                >
                  Save Institutional Settings
                </AppButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AppCard>
    </Box>
  )
}

export default SettingsPage
