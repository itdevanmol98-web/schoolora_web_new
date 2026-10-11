import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LanguageIcon from '@mui/icons-material/Language'
import { domainService } from '@/features/domains/domainService'
import type { CustomDomainItem } from '@/features/domains/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import { formatDate } from '@/utils/formatters'

export const DomainsPage: React.FC = () => {
  const [domains, setDomains] = useState<CustomDomainItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Add Domain Dialog
  const [addOpen, setAddOpen] = useState(false)
  const [domainInput, setDomainInput] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  // Verify Action Loading
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<CustomDomainItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    domainService
      .getDomains()
      .then((data) => {
        if (!isCancelled) {
          setDomains(data)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to query custom domains from backend'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchDomains = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleAddSubmit = async () => {
    if (!domainInput.trim()) {
      setErrorMessage('Domain name is required (e.g. portal.myschool.edu)')
      return
    }

    setAddLoading(true)
    setErrorMessage(null)
    try {
      await domainService.addDomain({ domain: domainInput.trim().toLowerCase() })
      setSuccessMessage(`Custom domain "${domainInput}" added. Please configure DNS CNAME/TXT records.`)
      setAddOpen(false)
      setDomainInput('')
      fetchDomains()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to register custom domain')
    } finally {
      setAddLoading(false)
    }
  }

  const handleVerifyDomain = async (id: string, domainName: string) => {
    setVerifyingId(id)
    setErrorMessage(null)
    try {
      const res = await domainService.verifyDomain(id)
      setSuccessMessage(
        res.verified
          ? `Domain "${domainName}" verified successfully with DNS certificate`
          : res.message
      )
      fetchDomains()
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : `DNS verification failed for "${domainName}". Ensure DNS records have propagated.`
      )
    } finally {
      setVerifyingId(null)
    }
  }

  const handleSetPrimary = async (id: string, domainName: string) => {
    try {
      await domainService.setPrimaryDomain(id)
      setSuccessMessage(`"${domainName}" set as the primary tenant domain`)
      fetchDomains()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to set primary domain')
    }
  }

  const handleDeleteDomain = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await domainService.deleteDomain(deleteTarget.id)
      setSuccessMessage(`Domain "${deleteTarget.domain}" removed`)
      setDeleteTarget(null)
      fetchDomains()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to remove domain')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <AppPageHeader
        title="Custom Domain Management"
        subtitle="Configure white-label school domains, SSL certificates, and DNS verification"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
          >
            Add Custom Domain
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

      {/* DNS Configuration Instructions Notice */}
      <AppCard sx={{ mb: 3, p: 2.5, bgcolor: 'action.hover' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <LanguageIcon color="primary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              DNS CNAME Configuration Guide
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              To route traffic through your institutional domain, add a <strong>CNAME</strong> record in your DNS provider pointing to <code>cname.schoolora.com</code> with TTL 300. After adding the record, click <em>Verify DNS</em> below.
            </Typography>
          </Box>
        </Box>
      </AppCard>

      {/* Domains Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving registered custom domains from backend..." />
        </AppCard>
      ) : errorMessage && domains.length === 0 ? (
        <AppErrorState
          title="Domain Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchDomains}
        />
      ) : domains.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Custom Domains"
            description="Tenant is currently accessed via default platform routing. Add a custom domain to white-label the portal."
            actionText="Add Custom Domain"
            onAction={() => setAddOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="custom domains table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Domain Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Verification Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domains.map((dom) => (
                  <TableRow key={dom.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {dom.domain}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={dom.isVerified ? <CheckCircleIcon fontSize="small" /> : undefined}
                        label={dom.isVerified ? 'DNS Verified' : 'Pending DNS'}
                        size="small"
                        color={dom.isVerified ? 'success' : 'warning'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {dom.isPrimary ? (
                        <Chip
                          label="Primary Domain"
                          size="small"
                          color="primary"
                          icon={<StarIcon fontSize="small" />}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Secondary Domain
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(dom.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                        {!dom.isVerified && (
                          <AppButton
                            variant="outlined"
                            size="small"
                            startIcon={<VerifiedUserIcon />}
                            loading={verifyingId === dom.id}
                            loadingText="Verifying..."
                            onClick={() => handleVerifyDomain(dom.id, dom.domain)}
                          >
                            Verify DNS
                          </AppButton>
                        )}

                        {dom.isVerified && !dom.isPrimary && (
                          <Tooltip title="Make Primary Domain">
                            <IconButton size="small" onClick={() => handleSetPrimary(dom.id, dom.domain)}>
                              <StarBorderIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Remove Domain">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(dom)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AppCard>
      )}

      {/* Add Domain Dialog */}
      <AppDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Institutional Custom Domain"
        confirmText="Register Domain"
        onConfirm={handleAddSubmit}
        loading={addLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="Domain Hostname"
            required
            fullWidth
            placeholder="portal.myschool.edu"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            helperText="Enter a fully qualified domain name (FQDN) without protocol prefix"
          />
        </Box>
      </AppDialog>

      {/* Delete Domain Confirmation */}
      <AppConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Remove Domain "${deleteTarget?.domain}"?`}
        message="Users attempting to access the Schoolora ERP via this domain will no longer be routed to this tenant."
        confirmText="Remove Domain"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDeleteDomain}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  )
}

export default DomainsPage
