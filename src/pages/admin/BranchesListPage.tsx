import React, { useState, useEffect } from 'react'
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
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MenuItem from '@mui/material/MenuItem'
import { branchService } from '@/features/branches/branchService'
import { schoolService } from '@/features/schools/schoolService'
import type { BranchItem, CreateBranchPayload, UpdateBranchPayload } from '@/features/branches/types'
import type { SchoolItem } from '@/features/schools/types'
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

export const BranchesListPage: React.FC = () => {
  const [branches, setBranches] = useState<BranchItem[]>([])
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateBranchPayload>({
    schoolId: '',
    name: '',
    code: '',
    phone: '',
    address: '',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null)
  const [editData, setEditData] = useState<UpdateBranchPayload>({
    name: '',
    phone: '',
    address: '',
  })
  const [editLoading, setEditLoading] = useState(false)

  // Status dialog
  const [statusBranch, setStatusBranch] = useState<BranchItem | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    Promise.allSettled([
      branchService.getBranches({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      }),
      schoolService.getSchools({ limit: 100 }),
    ])
      .then(([branchesRes, schoolsRes]) => {
        if (!isCancelled) {
          if (branchesRes.status === 'fulfilled') {
            setBranches(branchesRes.value.branches)
            setTotal(branchesRes.value.total)
          } else {
            setErrorMessage('Failed to retrieve branches from backend')
          }

          if (schoolsRes.status === 'fulfilled') {
            setSchools(schoolsRes.value.schools)
            if (schoolsRes.value.schools.length > 0) {
              setCreateData((prev) => (prev.schoolId ? prev : { ...prev, schoolId: schoolsRes.value.schools[0].id }))
            }
          }
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to retrieve branches')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, reloadTrigger])

  const fetchBranches = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleCreateSubmit = async () => {
    if (!createData.schoolId || !createData.name.trim() || !createData.code.trim()) {
      setErrorMessage('Parent school, branch name, and branch code are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await branchService.createBranch({
        ...createData,
        name: createData.name.trim(),
        code: createData.code.trim(),
      })
      setSuccessMessage(`Branch "${createData.name}" created successfully`)
      setCreateOpen(false)
      setCreateData({
        schoolId: schools[0]?.id || '',
        name: '',
        code: '',
        phone: '',
        address: '',
      })
      fetchBranches()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create branch')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (branch: BranchItem) => {
    setSelectedBranch(branch)
    setEditData({
      name: branch.name,
      phone: branch.phone || '',
      address: branch.address || '',
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedBranch) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await branchService.updateBranch(selectedBranch.id, editData)
      setSuccessMessage(`Branch "${editData.name}" updated successfully`)
      setEditOpen(false)
      fetchBranches()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update branch')
    } finally {
      setEditLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!statusBranch) return
    const newStatus = statusBranch.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setStatusLoading(true)
    try {
      await branchService.updateBranchStatus(statusBranch.id, newStatus)
      setSuccessMessage(`Branch "${statusBranch.name}" status updated to ${newStatus}`)
      setStatusBranch(null)
      fetchBranches()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update branch status')
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Branch & Wing Management"
        subtitle="Manage school branches, academic wings, and physical facilities"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Branch
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

      {/* Filter Bar */}
      <AppCard sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </AppSelect>
        </Box>
      </AppCard>

      {/* Data Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving branch listings from backend..." />
        </AppCard>
      ) : errorMessage && branches.length === 0 ? (
        <AppErrorState
          title="Branches Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchBranches}
        />
      ) : branches.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Branches Found"
            description="No school branches registered for this institution."
            actionText="Create Branch"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="branches directory table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Branch Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Parent School</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches.map((branch) => {
                  const parentSchool = schools.find((s) => s.id === branch.schoolId)

                  return (
                    <TableRow key={branch.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {branch.name}
                        </Typography>
                        {branch.address && (
                          <Typography variant="caption" color="text.secondary">
                            {branch.address}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={branch.code} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {parentSchool?.name || branch.school?.name || branch.schoolId.slice(0, 8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{branch.phone || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={branch.status}
                          size="small"
                          color={branch.status === 'ACTIVE' ? 'success' : 'default'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(branch.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Edit Branch">
                            <IconButton size="small" onClick={() => openEdit(branch)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              branch.status === 'ACTIVE'
                                ? 'Deactivate Branch'
                                : 'Activate Branch'
                            }
                          >
                            <IconButton
                              size="small"
                              color={branch.status === 'ACTIVE' ? 'error' : 'success'}
                              onClick={() => setStatusBranch(branch)}
                            >
                              {branch.status === 'ACTIVE' ? (
                                <BlockIcon fontSize="small" />
                              ) : (
                                <CheckCircleIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
            rowsPerPageOptions={[5, 10, 25]}
          />
        </AppCard>
      )}

      {/* Create Branch Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New School Branch"
        confirmText="Create Branch"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppSelect
            label="Parent Campus / School"
            required
            fullWidth
            value={createData.schoolId}
            onChange={(e) => setCreateData({ ...createData, schoolId: e.target.value as string })}
          >
            {schools.map((school) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name} ({school.code})
              </MenuItem>
            ))}
          </AppSelect>

          <AppTextField
            label="Branch Name"
            required
            fullWidth
            placeholder="e.g. East Wing Annex Branch"
            value={createData.name}
            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
          />

          <AppTextField
            label="Branch Code"
            required
            fullWidth
            placeholder="e.g. BR-EAST-01"
            value={createData.code}
            onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
          />

          <AppTextField
            label="Contact Phone"
            fullWidth
            placeholder="+1-555-0200"
            value={createData.phone || ''}
            onChange={(e) => setCreateData({ ...createData, phone: e.target.value })}
          />

          <AppTextField
            label="Physical Address / Location"
            fullWidth
            placeholder="Building C, East Wing"
            value={createData.address || ''}
            onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Edit Branch Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Branch Details"
        confirmText="Save Details"
        onConfirm={handleEditSubmit}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="Branch Name"
            required
            fullWidth
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <AppTextField
            label="Contact Phone"
            fullWidth
            value={editData.phone || ''}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />

          <AppTextField
            label="Address"
            fullWidth
            value={editData.address || ''}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Status Toggle Dialog */}
      <AppConfirmDialog
        open={Boolean(statusBranch)}
        title={
          statusBranch?.status === 'ACTIVE'
            ? `Deactivate "${statusBranch?.name}"?`
            : `Activate "${statusBranch?.name}"?`
        }
        message="Changing branch status modifies access for users assigned exclusively to this branch."
        confirmText={statusBranch?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmColor={statusBranch?.status === 'ACTIVE' ? 'error' : 'primary'}
        loading={statusLoading}
        onConfirm={handleStatusToggle}
        onClose={() => setStatusBranch(null)}
      />
    </Box>
  )
}

export default BranchesListPage
