import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import { tenantService } from '@/features/tenants/tenantService'
import type { TenantItem, CreateTenantPayload, UpdateTenantPayload } from '@/features/tenants/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppSelect from '@/components/common/AppSelect'
import AppLoading from '@/components/common/Loading'
import AppEmptyState from '@/components/common/EmptyState'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'
import { formatDate } from '@/utils/formatters'

export const TenantsListPage: React.FC = () => {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateTenantPayload>({
    name: '',
    code: '',
    plan: 'STANDARD_TIER',
    customDomain: '',
  })
  const [createLoading, setCreateLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null)
  const [editData, setEditData] = useState<UpdateTenantPayload>({
    name: '',
    customDomain: '',
  })
  const [editLoading, setEditLoading] = useState(false)

  // Status toggle
  const [statusDialogTenant, setStatusDialogTenant] = useState<TenantItem | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [activeSearch, setActiveSearch] = useState('')

  useEffect(() => {
    let isCancelled = false

    tenantService
      .getTenants({
        page: page + 1,
        limit: rowsPerPage,
        search: activeSearch || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      })
      .then((res) => {
        if (!isCancelled) {
          setTenants(res.tenants)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to retrieve institutional tenants from backend'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, activeSearch, reloadTrigger])

  const fetchTenants = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setPage(0)
    setActiveSearch(search.trim())
  }

  const handleCreateSubmit = async () => {
    if (!createData.name.trim() || !createData.code.trim()) {
      setErrorMessage('Tenant organization name and unique code are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await tenantService.createTenant({
        name: createData.name.trim(),
        code: createData.code.trim(),
        plan: createData.plan || undefined,
        customDomain: createData.customDomain?.trim() || undefined,
      })
      setSuccessMessage(`Tenant "${createData.name}" provisioned successfully`)
      setCreateOpen(false)
      setCreateData({ name: '', code: '', plan: 'STANDARD_TIER', customDomain: '' })
      fetchTenants()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to provision tenant')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (tenant: TenantItem) => {
    setSelectedTenant(tenant)
    setEditData({
      name: tenant.name,
      customDomain: tenant.customDomain || '',
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedTenant) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await tenantService.updateTenant(selectedTenant.id, {
        name: editData.name?.trim(),
        customDomain: editData.customDomain?.trim() || undefined,
      })
      setSuccessMessage(`Tenant "${editData.name}" updated successfully`)
      setEditOpen(false)
      fetchTenants()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update tenant details')
    } finally {
      setEditLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!statusDialogTenant) return
    const newStatus = statusDialogTenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    setStatusLoading(true)
    try {
      await tenantService.updateTenantStatus(statusDialogTenant.id, newStatus)
      setSuccessMessage(`Tenant "${statusDialogTenant.name}" status updated to ${newStatus}`)
      setStatusDialogTenant(null)
      fetchTenants()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update tenant status')
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Institutional Tenant Management"
        subtitle="Manage registered tenant organizations, plans, custom domains, and status"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Provision Tenant
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

      {/* Filter and Search Bar */}
      <AppCard sx={{ mb: 3, p: 2 }}>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <AppTextField
            placeholder="Search by tenant name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />

          <AppSelect
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as string)
              setPage(0)
            }}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </AppSelect>

          <AppButton type="submit" variant="outlined" size="medium">
            Search
          </AppButton>
        </Box>
      </AppCard>

      {/* Data Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Querying institutional tenants from backend directory..." />
        </AppCard>
      ) : errorMessage && tenants.length === 0 ? (
        <AppErrorState
          title="Tenant Data Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchTenants}
        />
      ) : tenants.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Tenants Found"
            description="No institutional tenant records matched the selected query parameters."
            actionText="Provision First Tenant"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="tenants directory table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tenant Organization</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Custom Domain</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {tenant.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {tenant.id.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={tenant.code} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {tenant.customDomain ? (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {tenant.customDomain}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Default Domain
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.plan || 'Standard'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.status}
                        size="small"
                        color={tenant.status === 'ACTIVE' ? 'success' : 'warning'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(tenant.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Tenant Overview">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Tenant">
                          <IconButton size="small" onClick={() => openEdit(tenant)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={tenant.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                        >
                          <IconButton
                            size="small"
                            color={tenant.status === 'ACTIVE' ? 'error' : 'success'}
                            onClick={() => setStatusDialogTenant(tenant)}
                          >
                            {tenant.status === 'ACTIVE' ? (
                              <BlockIcon fontSize="small" />
                            ) : (
                              <CheckCircleIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </AppCard>
      )}

      {/* Provision Tenant Modal */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Provision New Institutional Tenant"
        confirmText="Provision Tenant"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <AppTextField
            label="Tenant Organization Name"
            required
            fullWidth
            placeholder="e.g. Springfield Education District"
            value={createData.name}
            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
          />

          <AppTextField
            label="Unique Tenant Code"
            required
            fullWidth
            placeholder="e.g. springfield-dist"
            value={createData.code}
            onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
            helperText="Alphanumeric identifier used for subdomains and routing"
          />

          <AppSelect
            label="Initial Subscription Plan"
            fullWidth
            value={createData.plan || 'STANDARD_TIER'}
            onChange={(e) => setCreateData({ ...createData, plan: e.target.value as string })}
          >
            <MenuItem value="STANDARD_TIER">Standard Plan</MenuItem>
            <MenuItem value="ENTERPRISE">Enterprise Plan</MenuItem>
            <MenuItem value="CAMPUS_PRO">Campus Pro</MenuItem>
          </AppSelect>

          <AppTextField
            label="Custom Domain (Optional)"
            fullWidth
            placeholder="e.g. portal.springfield.edu"
            value={createData.customDomain || ''}
            onChange={(e) => setCreateData({ ...createData, customDomain: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Edit Tenant Modal */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Institutional Tenant"
        confirmText="Save Changes"
        onConfirm={handleEditSubmit}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <AppTextField
            label="Tenant Organization Name"
            required
            fullWidth
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <AppTextField
            label="Custom Domain"
            fullWidth
            placeholder="e.g. portal.springfield.edu"
            value={editData.customDomain || ''}
            onChange={(e) => setEditData({ ...editData, customDomain: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Status Toggle Confirmation */}
      <AppConfirmDialog
        open={Boolean(statusDialogTenant)}
        title={
          statusDialogTenant?.status === 'ACTIVE'
            ? `Suspend "${statusDialogTenant?.name}"?`
            : `Activate "${statusDialogTenant?.name}"?`
        }
        message={
          statusDialogTenant?.status === 'ACTIVE'
            ? 'Suspending this tenant will temporarily restrict institutional campus access for its affiliated users until re-activated.'
            : 'Activating this tenant will restore institutional campus access and service operations.'
        }
        confirmText={statusDialogTenant?.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
        confirmColor={statusDialogTenant?.status === 'ACTIVE' ? 'error' : 'primary'}
        loading={statusLoading}
        onConfirm={handleStatusToggle}
        onClose={() => setStatusDialogTenant(null)}
      />
    </Box>
  )
}

export default TenantsListPage
