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
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import { schoolService } from '@/features/schools/schoolService'
import type { SchoolItem, CreateSchoolPayload, UpdateSchoolPayload } from '@/features/schools/types'
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

export const SchoolsListPage: React.FC = () => {
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Temporary credentials popup if backend returns them
  const [tempCredsNotice, setTempCredsNotice] = useState<{
    email: string
    temporaryPassword?: string
  } | null>(null)

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateSchoolPayload>({
    name: '',
    code: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null)
  const [editData, setEditData] = useState<UpdateSchoolPayload>({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  })
  const [editLoading, setEditLoading] = useState(false)

  // Status dialog
  const [statusSchool, setStatusSchool] = useState<SchoolItem | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [activeSearch, setActiveSearch] = useState('')

  useEffect(() => {
    let isCancelled = false

    schoolService
      .getSchools({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: activeSearch || undefined,
      })
      .then((res) => {
        if (!isCancelled) {
          setSchools(res.schools)
          setTotal(res.total)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to retrieve schools directory'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, activeSearch, reloadTrigger])

  const fetchSchools = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleCreateSubmit = async () => {
    if (!createData.name.trim() || !createData.code.trim() || !createData.contactEmail.trim()) {
      setErrorMessage('School name, code, and contact email are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      const res = await schoolService.createSchool({
        ...createData,
        name: createData.name.trim(),
        code: createData.code.trim(),
        contactEmail: createData.contactEmail.trim(),
      })

      setSuccessMessage(`School "${createData.name}" created successfully`)
      setCreateOpen(false)
      setCreateData({
        name: '',
        code: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPhone: '',
      })

      if (res.temporaryAdminCredentials?.temporaryPassword) {
        setTempCredsNotice(res.temporaryAdminCredentials)
      }

      fetchSchools()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create school')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (school: SchoolItem) => {
    setSelectedSchool(school)
    setEditData({
      name: school.name,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone || '',
      address: school.address || '',
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedSchool) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await schoolService.updateSchool(selectedSchool.id, editData)
      setSuccessMessage(`School "${editData.name}" updated successfully`)
      setEditOpen(false)
      fetchSchools()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update school')
    } finally {
      setEditLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!statusSchool) return
    const newStatus = statusSchool.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setStatusLoading(true)
    try {
      await schoolService.updateSchoolStatus(statusSchool.id, newStatus)
      setSuccessMessage(`School "${statusSchool.name}" status updated to ${newStatus}`)
      setStatusSchool(null)
      fetchSchools()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update school status')
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="School Campus Management"
        subtitle="Manage educational campuses, contact information, and campus administrators"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create School Campus
          </AppButton>
        }
      />

      {tempCredsNotice && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setTempCredsNotice(null)}
        >
          <strong>Temporary Campus Admin Credentials Generated:</strong> Email: <code>{tempCredsNotice.email}</code> | Temporary Password: <code>{tempCredsNotice.temporaryPassword}</code>. Please deliver these securely to the campus administrator.
        </Alert>
      )}

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
          onSubmit={(e) => {
            e.preventDefault()
            setIsLoading(true)
            setErrorMessage(null)
            setPage(0)
            setActiveSearch(search.trim())
          }}
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
        >
          <AppTextField
            placeholder="Search by school name or code..."
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
            label="Status"
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

          <AppButton type="submit" variant="outlined">
            Search
          </AppButton>
        </Box>
      </AppCard>

      {/* Data Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving school campuses from backend..." />
        </AppCard>
      ) : errorMessage && schools.length === 0 ? (
        <AppErrorState
          title="Schools Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchSchools}
        />
      ) : schools.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Schools Found"
            description="No school campuses are currently registered for this tenant."
            actionText="Create School Campus"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="schools directory table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>School Campus</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {school.name}
                      </Typography>
                      {school.address && (
                        <Typography variant="caption" color="text.secondary">
                          {school.address}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={school.code} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{school.contactEmail}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{school.contactPhone || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={school.status}
                        size="small"
                        color={school.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(school.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit School">
                          <IconButton size="small" onClick={() => openEdit(school)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={school.status === 'ACTIVE' ? 'Deactivate School' : 'Activate School'}
                        >
                          <IconButton
                            size="small"
                            color={school.status === 'ACTIVE' ? 'error' : 'success'}
                            onClick={() => setStatusSchool(school)}
                          >
                            {school.status === 'ACTIVE' ? (
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
            rowsPerPageOptions={[5, 10, 25]}
          />
        </AppCard>
      )}

      {/* Create School Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New School Campus"
        confirmText="Create School"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="School Name"
            required
            fullWidth
            placeholder="e.g. North Campus High"
            value={createData.name}
            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
          />

          <AppTextField
            label="School Code"
            required
            fullWidth
            placeholder="e.g. NCH-01"
            value={createData.code}
            onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
          />

          <AppTextField
            label="Contact Email"
            type="email"
            required
            fullWidth
            placeholder="info@northcampus.edu"
            value={createData.contactEmail}
            onChange={(e) => setCreateData({ ...createData, contactEmail: e.target.value })}
          />

          <AppTextField
            label="Contact Phone"
            fullWidth
            placeholder="+1-555-0199"
            value={createData.contactPhone || ''}
            onChange={(e) => setCreateData({ ...createData, contactPhone: e.target.value })}
          />

          <AppTextField
            label="Campus Address"
            fullWidth
            placeholder="100 Education Way, City, State"
            value={createData.address || ''}
            onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Initial Campus Administrator (Optional)
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Admin First Name"
              fullWidth
              value={createData.adminFirstName || ''}
              onChange={(e) => setCreateData({ ...createData, adminFirstName: e.target.value })}
            />
            <AppTextField
              label="Admin Last Name"
              fullWidth
              value={createData.adminLastName || ''}
              onChange={(e) => setCreateData({ ...createData, adminLastName: e.target.value })}
            />
          </Box>

          <AppTextField
            label="Admin Email"
            type="email"
            fullWidth
            value={createData.adminEmail || ''}
            onChange={(e) => setCreateData({ ...createData, adminEmail: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Edit School Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit School Details"
        confirmText="Save School"
        onConfirm={handleEditSubmit}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="School Name"
            required
            fullWidth
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <AppTextField
            label="Contact Email"
            required
            fullWidth
            value={editData.contactEmail || ''}
            onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
          />

          <AppTextField
            label="Contact Phone"
            fullWidth
            value={editData.contactPhone || ''}
            onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
          />

          <AppTextField
            label="Campus Address"
            fullWidth
            value={editData.address || ''}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Status Toggle Dialog */}
      <AppConfirmDialog
        open={Boolean(statusSchool)}
        title={
          statusSchool?.status === 'ACTIVE'
            ? `Deactivate "${statusSchool?.name}"?`
            : `Activate "${statusSchool?.name}"?`
        }
        message="Changing campus status affects access for all subordinate branches and academic staff."
        confirmText={statusSchool?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmColor={statusSchool?.status === 'ACTIVE' ? 'error' : 'primary'}
        loading={statusLoading}
        onConfirm={handleStatusToggle}
        onClose={() => setStatusSchool(null)}
      />
    </Box>
  )
}

export default SchoolsListPage
