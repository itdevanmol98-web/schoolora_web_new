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
import LockResetIcon from '@mui/icons-material/LockReset'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import SecurityIcon from '@mui/icons-material/Security'
import { userService } from '@/features/users/userService'
import { roleService } from '@/features/roles/roleService'
import type { UserItem, CreateUserPayload, UpdateUserPayload } from '@/features/users/types'
import type { RoleItem } from '@/features/roles/types'
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

export const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Created user temporary password notice
  const [tempPasswordNotice, setTempPasswordNotice] = useState<string | null>(null)

  // Create User Dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateUserPayload>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    temporaryPassword: 'TemporaryPass123!',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit User Dialog
  const [editOpen, setEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [editData, setEditData] = useState<UpdateUserPayload>({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [editLoading, setEditLoading] = useState(false)

  // Role Assignment Dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [roleTargetUser, setRoleTargetUser] = useState<UserItem | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [roleLoading, setRoleLoading] = useState(false)

  // Admin Reset Password Confirmation
  const [resetTargetUser, setResetTargetUser] = useState<UserItem | null>(null)
  const [resetLoading, setResetLoading] = useState(false)

  // Status Toggle
  const [statusTargetUser, setStatusTargetUser] = useState<UserItem | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [activeSearch, setActiveSearch] = useState('')

  useEffect(() => {
    let isCancelled = false

    Promise.allSettled([
      userService.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: activeSearch || undefined,
      }),
      roleService.getRoles({ limit: 50 }),
    ])
      .then(([usersRes, rolesRes]) => {
        if (!isCancelled) {
          if (usersRes.status === 'fulfilled') {
            setUsers(usersRes.value.users)
            setTotal(usersRes.value.total)
          } else {
            setErrorMessage('Failed to retrieve users from backend')
          }

          if (rolesRes.status === 'fulfilled') {
            setRoles(rolesRes.value.roles)
          }
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to query users directory')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [page, rowsPerPage, statusFilter, activeSearch, reloadTrigger])

  const fetchUsers = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  const handleCreateSubmit = async () => {
    if (!createData.email.trim() || !createData.firstName.trim() || !createData.lastName.trim()) {
      setErrorMessage('Email, first name, and last name are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await userService.createUser({
        ...createData,
        email: createData.email.trim(),
        firstName: createData.firstName.trim(),
        lastName: createData.lastName.trim(),
      })

      setSuccessMessage(`User "${createData.firstName} ${createData.lastName}" created successfully`)
      if (createData.temporaryPassword) {
        setTempPasswordNotice(
          `User created with temporary password: ${createData.temporaryPassword}`
        )
      }
      setCreateOpen(false)
      setCreateData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        temporaryPassword: 'TemporaryPass123!',
      })
      fetchUsers()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (user: UserItem) => {
    setSelectedUser(user)
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedUser) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await userService.updateUser(selectedUser.id, editData)
      setSuccessMessage(`User "${editData.firstName} ${editData.lastName}" updated successfully`)
      setEditOpen(false)
      fetchUsers()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }

  const handleAssignRole = async () => {
    if (!roleTargetUser || !selectedRoleId) return
    setRoleLoading(true)
    setErrorMessage(null)
    try {
      await userService.assignRoleToUser(roleTargetUser.id, selectedRoleId)
      setSuccessMessage(`Role assigned to ${roleTargetUser.firstName} ${roleTargetUser.lastName}`)
      setRoleDialogOpen(false)
      fetchUsers()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to assign role')
    } finally {
      setRoleLoading(false)
    }
  }

  const handleAdminResetPassword = async () => {
    if (!resetTargetUser) return
    setResetLoading(true)
    setErrorMessage(null)
    try {
      const res = await userService.adminResetPassword(resetTargetUser.id)
      setSuccessMessage(
        res.temporaryPassword
          ? `Password reset: temporary credential is "${res.temporaryPassword}"`
          : res.message
      )
      setResetTargetUser(null)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to reset user password')
    } finally {
      setResetLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!statusTargetUser) return
    const newStatus = statusTargetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setStatusLoading(true)
    try {
      await userService.updateUserStatus(statusTargetUser.id, newStatus)
      setSuccessMessage(`User "${statusTargetUser.firstName}" status changed to ${newStatus}`)
      setStatusTargetUser(null)
      fetchUsers()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update user status')
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="User Administration"
        subtitle="Manage platform and institutional users, role assignments, and account security"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create User
          </AppButton>
        }
      />

      {tempPasswordNotice && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setTempPasswordNotice(null)}
        >
          {tempPasswordNotice}
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

      {/* Filter and Search */}
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
            placeholder="Search by name or email address..."
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
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
          </AppSelect>

          <AppButton type="submit" variant="outlined">
            Search
          </AppButton>
        </Box>
      </AppCard>

      {/* Data Table */}
      {isLoading ? (
        <AppCard sx={{ p: 4 }}>
          <AppLoading message="Retrieving institutional user accounts from backend..." />
        </AppCard>
      ) : errorMessage && users.length === 0 ? (
        <AppErrorState
          title="Users Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchUsers}
        />
      ) : users.length === 0 ? (
        <AppCard sx={{ p: 4 }}>
          <AppEmptyState
            title="No Users Found"
            description="No user records matched the selected query parameters."
            actionText="Create First User"
            onAction={() => setCreateOpen(true)}
          />
        </AppCard>
      ) : (
        <AppCard disableContentPadding>
          <TableContainer>
            <Table aria-label="user administration directory table">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Roles</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      {user.mustChangePassword && (
                        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                          Password reset required
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {user.roles && user.roles.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {user.roles.map((r) => (
                            <Chip key={r.id} label={r.name} size="small" variant="outlined" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No Roles Assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.phone || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Assign Role">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setRoleTargetUser(user)
                              setSelectedRoleId(roles[0]?.id || '')
                              setRoleDialogOpen(true)
                            }}
                          >
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => openEdit(user)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password (Admin Override)">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => setResetTargetUser(user)}
                          >
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                        >
                          <IconButton
                            size="small"
                            color={user.status === 'ACTIVE' ? 'error' : 'success'}
                            onClick={() => setStatusTargetUser(user)}
                          >
                            {user.status === 'ACTIVE' ? (
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

      {/* Create User Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New User Account"
        confirmText="Create User"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="First Name"
              required
              fullWidth
              value={createData.firstName}
              onChange={(e) => setCreateData({ ...createData, firstName: e.target.value })}
            />
            <AppTextField
              label="Last Name"
              required
              fullWidth
              value={createData.lastName}
              onChange={(e) => setCreateData({ ...createData, lastName: e.target.value })}
            />
          </Box>

          <AppTextField
            label="Email Address"
            type="email"
            required
            fullWidth
            placeholder="user@schoolora.edu"
            value={createData.email}
            onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
          />

          <AppTextField
            label="Contact Phone"
            fullWidth
            placeholder="+1-555-0456"
            value={createData.phone || ''}
            onChange={(e) => setCreateData({ ...createData, phone: e.target.value })}
          />

          <AppTextField
            label="Temporary Password"
            fullWidth
            value={createData.temporaryPassword || ''}
            onChange={(e) => setCreateData({ ...createData, temporaryPassword: e.target.value })}
            helperText="User will be prompted to reset password upon initial login"
          />
        </Box>
      </AppDialog>

      {/* Edit User Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit User Details"
        confirmText="Save Details"
        onConfirm={handleEditSubmit}
        loading={editLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="First Name"
              required
              fullWidth
              value={editData.firstName || ''}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            />
            <AppTextField
              label="Last Name"
              required
              fullWidth
              value={editData.lastName || ''}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
            />
          </Box>

          <AppTextField
            label="Phone"
            fullWidth
            value={editData.phone || ''}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
        </Box>
      </AppDialog>

      {/* Assign Role Dialog */}
      <AppDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        title={`Assign Role to ${roleTargetUser?.firstName} ${roleTargetUser?.lastName}`}
        confirmText="Assign Role"
        onConfirm={handleAssignRole}
        loading={roleLoading}
      >
        <Box sx={{ pt: 1 }}>
          <AppSelect
            label="Select Role"
            fullWidth
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value as string)}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name} ({role.code})
              </MenuItem>
            ))}
          </AppSelect>
        </Box>
      </AppDialog>

      {/* Admin Reset Password Confirmation */}
      <AppConfirmDialog
        open={Boolean(resetTargetUser)}
        title={`Reset Password for ${resetTargetUser?.firstName} ${resetTargetUser?.lastName}?`}
        message="This will invalidate the current password and generate a fresh temporary password or send a password reset notification to the user's institutional email."
        confirmText="Reset Password"
        confirmColor="warning"
        loading={resetLoading}
        onConfirm={handleAdminResetPassword}
        onClose={() => setResetTargetUser(null)}
      />

      {/* Status Toggle Dialog */}
      <AppConfirmDialog
        open={Boolean(statusTargetUser)}
        title={
          statusTargetUser?.status === 'ACTIVE'
            ? `Deactivate ${statusTargetUser?.firstName} ${statusTargetUser?.lastName}?`
            : `Activate ${statusTargetUser?.firstName} ${statusTargetUser?.lastName}?`
        }
        message="Inactive users will be blocked from logging into the Schoolora ERP portal."
        confirmText={statusTargetUser?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmColor={statusTargetUser?.status === 'ACTIVE' ? 'error' : 'primary'}
        loading={statusLoading}
        onConfirm={handleStatusToggle}
        onClose={() => setStatusTargetUser(null)}
      />
    </Box>
  )
}

export default UsersListPage
