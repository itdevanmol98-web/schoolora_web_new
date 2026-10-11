import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Alert from '@mui/material/Alert'
import DevicesIcon from '@mui/icons-material/Devices'
import LaptopIcon from '@mui/icons-material/Laptop'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { authService } from '@/features/auth/authService'
import type { AuthSessionItem } from '@/features/auth/types'
import { formatDate } from '@/utils/formatters'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppButton from '@/components/common/Button'
import AppCard from '@/components/common/Card'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<AuthSessionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Dialog states
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null)
  const [revokeAllOpen, setRevokeAllOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    authService
      .getSessions()
      .then((data) => {
        if (!isCancelled) {
          setSessions(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to load active sessions from backend.'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const refreshSessions = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleRevokeSingle = async () => {
    if (!sessionToRevoke) return
    setActionLoading(true)
    try {
      await authService.revokeSession(sessionToRevoke)
      setActionSuccess('Session successfully revoked.')
      setSessionToRevoke(null)
      refreshSessions()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to revoke session.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRevokeAllOther = async () => {
    setActionLoading(true)
    try {
      const result = await authService.revokeAllSessions(true)
      setActionSuccess(`Successfully revoked ${result.revokedCount} other active sessions.`)
      setRevokeAllOpen(false)
      refreshSessions()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to revoke all other sessions.')
    } finally {
      setActionLoading(false)
    }
  }

  const getDeviceIcon = (deviceInfo?: string | null) => {
    const info = (deviceInfo || '').toLowerCase()
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
      return <PhoneAndroidIcon color="primary" />
    }
    if (info.includes('windows') || info.includes('mac') || info.includes('linux')) {
      return <LaptopIcon color="primary" />
    }
    return <DevicesIcon color="primary" />
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <AppPageHeader
        title="Active Sessions & Devices"
        subtitle="Review active sign-in sessions and revoke unrecognized devices"
        actions={
          sessions.length > 1 ? (
            <AppButton
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setRevokeAllOpen(true)}
            >
              Revoke All Other Sessions
            </AppButton>
          ) : undefined
        }
      />

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving active user sessions from backend..." />
        </AppCard>
      ) : errorMessage && sessions.length === 0 ? (
        <AppErrorState
          title="Session Retrieval Error"
          message={errorMessage}
          retryText="Retry"
          onRetry={refreshSessions}
        />
      ) : sessions.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Active Sessions"
            description="No active sessions were found for your account."
          />
        </AppCard>
      ) : (
        <AppCard
          title="Connected Devices"
          subtitle={`Total of ${sessions.length} active login session(s)`}
        >
          <List disablePadding>
            {sessions.map((session, index) => {
              const isCurrent = session.isCurrent || session.isCurrentSession

              return (
                <ListItem
                  key={session.id}
                  divider={index < sessions.length - 1}
                  sx={{
                    py: 2.5,
                    px: { xs: 1.5, sm: 2.5 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getDeviceIcon(session.deviceInfo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {session.deviceInfo || 'Unknown Device'}
                          </Typography>
                          {isCurrent && (
                            <Chip
                              label="Current Session"
                              size="small"
                              color="success"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            IP Address: {session.ipAddress || 'Unavailable'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Signed in: {formatDate(session.createdAt)} • Expires: {formatDate(session.expiresAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>

                  {!isCurrent && (
                    <Box sx={{ mt: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' }, textAlign: 'right' }}>
                      <AppButton
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setSessionToRevoke(session.id)}
                      >
                        Revoke
                      </AppButton>
                    </Box>
                  )}
                </ListItem>
              )
            })}
          </List>
        </AppCard>
      )}

      {/* Revoke Single Session Confirm */}
      <AppConfirmDialog
        open={Boolean(sessionToRevoke)}
        title="Revoke Session"
        message="Are you sure you want to terminate this active session? The user on this device will be immediately signed out."
        confirmText="Revoke Session"
        confirmColor="error"
        loading={actionLoading}
        onConfirm={handleRevokeSingle}
        onCancel={() => setSessionToRevoke(null)}
      />

      {/* Revoke All Other Sessions Confirm */}
      <AppConfirmDialog
        open={revokeAllOpen}
        title="Revoke All Other Sessions"
        message="This will immediately invalidate all other active sessions and sign out all other devices except your current session. Do you wish to continue?"
        confirmText="Revoke All Others"
        confirmColor="error"
        loading={actionLoading}
        onConfirm={handleRevokeAllOther}
        onCancel={() => setRevokeAllOpen(false)}
      />
    </Box>
  )
}

export default SessionsPage
