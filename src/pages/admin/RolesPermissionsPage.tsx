import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SecurityIcon from '@mui/icons-material/Security'
import { roleService } from '@/features/roles/roleService'
import type { RoleItem, PermissionItem, CreateRolePayload, UpdateRolePayload } from '@/features/roles/types'
import AppPageHeader from '@/components/common/AppPageHeader'
import AppCard from '@/components/common/Card'
import AppButton from '@/components/common/Button'
import AppTextField from '@/components/common/Input'
import AppLoading from '@/components/common/Loading'
import AppErrorState from '@/components/common/ErrorState'
import AppDialog from '@/components/common/AppDialog'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'

export const RolesPermissionsPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create Role Dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createData, setCreateData] = useState<CreateRolePayload>({
    name: '',
    code: '',
    description: '',
    permissionIds: [],
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit Role Dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<UpdateRolePayload>({
    name: '',
    description: '',
    permissionIds: [],
  })
  const [editLoading, setEditLoading] = useState(false)

  // Delete Role Dialog
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<RoleItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    let isCancelled = false

    Promise.allSettled([
      roleService.getRoles({ limit: 50 }),
      roleService.getPermissions(),
    ])
      .then(([rolesRes, permsRes]) => {
        if (!isCancelled) {
          if (rolesRes.status === 'fulfilled') {
            setRoles(rolesRes.value.roles)
            if (rolesRes.value.roles.length > 0) {
              setSelectedRole((prev) => prev || rolesRes.value.roles[0])
            }
          } else {
            setErrorMessage('Failed to query roles from backend')
          }

          if (permsRes.status === 'fulfilled') {
            setPermissions(permsRes.value)
          }
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to query RBAC policies')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [reloadTrigger])

  const fetchData = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadTrigger((prev) => prev + 1)
  }

  // Group permissions by module/resource
  const groupedPermissions: Record<string, PermissionItem[]> = {}
  permissions.forEach((perm) => {
    const mod = perm.module || 'System'
    if (!groupedPermissions[mod]) {
      groupedPermissions[mod] = []
    }
    groupedPermissions[mod].push(perm)
  })

  const handleCreateSubmit = async () => {
    if (!createData.name.trim() || !createData.code.trim()) {
      setErrorMessage('Role name and code identifier are required')
      return
    }

    setCreateLoading(true)
    setErrorMessage(null)
    try {
      await roleService.createRole({
        ...createData,
        name: createData.name.trim(),
        code: createData.code.trim().toUpperCase(),
      })
      setSuccessMessage(`Role "${createData.name}" created successfully`)
      setCreateOpen(false)
      setCreateData({ name: '', code: '', description: '', permissionIds: [] })
      fetchData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create role')
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (role: RoleItem) => {
    setSelectedRole(role)
    setEditData({
      name: role.name,
      description: role.description || '',
      permissionIds: (role.permissions || []).map((p) => p.id),
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedRole) return
    setEditLoading(true)
    setErrorMessage(null)
    try {
      await roleService.updateRole(selectedRole.id, editData)
      setSuccessMessage(`Role "${editData.name}" updated successfully`)
      setEditOpen(false)
      fetchData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteRole = async () => {
    if (!deleteRoleTarget) return
    setDeleteLoading(true)
    try {
      await roleService.deleteRole(deleteRoleTarget.id)
      setSuccessMessage(`Role "${deleteRoleTarget.name}" deleted successfully`)
      setDeleteRoleTarget(null)
      fetchData()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete role')
    } finally {
      setDeleteLoading(false)
    }
  }

  const togglePermissionInCreate = (permId: string) => {
    const current = [...createData.permissionIds]
    const idx = current.indexOf(permId)
    if (idx > -1) {
      current.splice(idx, 1)
    } else {
      current.push(permId)
    }
    setCreateData({ ...createData, permissionIds: current })
  }

  const togglePermissionInEdit = (permId: string) => {
    const current = [...(editData.permissionIds || [])]
    const idx = current.indexOf(permId)
    if (idx > -1) {
      current.splice(idx, 1)
    } else {
      current.push(permId)
    }
    setEditData({ ...editData, permissionIds: current })
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <AppPageHeader
        title="Roles & Permission Matrix (RBAC)"
        subtitle="Manage access control roles, assign operational scopes, and audit permission matrices"
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Custom Role
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
          <AppLoading message="Querying RBAC roles and permissions catalog..." />
        </AppCard>
      ) : errorMessage && roles.length === 0 ? (
        <AppErrorState
          title="RBAC Query Failed"
          message={errorMessage}
          retryText="Retry"
          onRetry={fetchData}
        />
      ) : (
        <Grid container spacing={3}>
          {/* Roles Table */}
          <Grid sx={{ xs: 12, md: 5 }}>
            <AppCard title="Configured Roles" subtitle={`Total of ${roles.length} roles`}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow
                        key={role.id}
                        hover
                        selected={selectedRole?.id === role.id}
                        onClick={() => setSelectedRole(role)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {role.name}
                          </Typography>
                          {role.isSystem && (
                            <Chip
                              label="System"
                              size="small"
                              color="info"
                              sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={role.code} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="Edit Role">
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(role) }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!role.isSystem && (
                              <Tooltip title="Delete Role">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => { e.stopPropagation(); setDeleteRoleTarget(role) }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AppCard>
          </Grid>

          {/* Role Permission Summary */}
          <Grid sx={{ xs: 12, md: 7 }}>
            <AppCard
              title={selectedRole ? `Permissions: ${selectedRole.name}` : 'Permission Summary'}
              subtitle={selectedRole?.description || 'Inspect module permissions'}
              headerAction={<SecurityIcon color="action" />}
            >
              {Object.keys(groupedPermissions).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No permission catalog loaded from backend.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(groupedPermissions).map(([moduleName, perms]) => {
                    const rolePermIds = (selectedRole?.permissions || []).map((p) => p.id)
                    const activeCount = perms.filter((p) => rolePermIds.includes(p.id)).length

                    return (
                      <Accordion key={moduleName} defaultExpanded={false} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {moduleName}
                            </Typography>
                            <Chip
                              label={`${activeCount} / ${perms.length} Granted`}
                              size="small"
                              color={activeCount > 0 ? 'primary' : 'default'}
                              variant={activeCount > 0 ? 'filled' : 'outlined'}
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            {perms.map((perm) => {
                              const isGranted = rolePermIds.includes(perm.id)
                              return (
                                <Grid key={perm.id} sx={{ xs: 12, sm: 6 }}>
                                  <Chip
                                    label={`${perm.action}: ${perm.name}`}
                                    size="small"
                                    color={isGranted ? 'success' : 'default'}
                                    variant={isGranted ? 'filled' : 'outlined'}
                                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                                  />
                                </Grid>
                              )
                            })}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}
                </Box>
              )}
            </AppCard>
          </Grid>
        </Grid>
      )}

      {/* Create Role Dialog */}
      <AppDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Custom RBAC Role"
        confirmText="Create Role"
        onConfirm={handleCreateSubmit}
        loading={createLoading}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AppTextField
              label="Role Name"
              required
              fullWidth
              placeholder="e.g. Exam Coordinator"
              value={createData.name}
              onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
            />
            <AppTextField
              label="Role Code"
              required
              fullWidth
              placeholder="e.g. EXAM_COORDINATOR"
              value={createData.code}
              onChange={(e) => setCreateData({ ...createData, code: e.target.value })}
            />
          </Box>

          <AppTextField
            label="Role Description"
            fullWidth
            placeholder="Oversees examinations and student grade submissions"
            value={createData.description || ''}
            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Select Granted Permissions
          </Typography>

          <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
              <Box key={moduleName} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  {moduleName}
                </Typography>
                <Grid container spacing={0.5}>
                  {perms.map((p) => (
                    <Grid key={p.id} sx={{ xs: 12, sm: 6 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={createData.permissionIds.includes(p.id)}
                            onChange={() => togglePermissionInCreate(p.id)}
                          />
                        }
                        label={<Typography variant="body2">{p.action}: {p.name}</Typography>}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </AppDialog>

      {/* Edit Role Dialog */}
      <AppDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit Role: ${selectedRole?.name}`}
        confirmText="Save Role"
        onConfirm={handleEditSubmit}
        loading={editLoading}
        maxWidth="md"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <AppTextField
            label="Role Name"
            required
            fullWidth
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <AppTextField
            label="Role Description"
            fullWidth
            value={editData.description || ''}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Permissions Matrix
          </Typography>

          <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
              <Box key={moduleName} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  {moduleName}
                </Typography>
                <Grid container spacing={0.5}>
                  {perms.map((p) => (
                    <Grid key={p.id} sx={{ xs: 12, sm: 6 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={(editData.permissionIds || []).includes(p.id)}
                            onChange={() => togglePermissionInEdit(p.id)}
                          />
                        }
                        label={<Typography variant="body2">{p.action}: {p.name}</Typography>}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </AppDialog>

      {/* Delete Role Confirmation */}
      <AppConfirmDialog
        open={Boolean(deleteRoleTarget)}
        title={`Delete Role "${deleteRoleTarget?.name}"?`}
        message="Users currently holding this role may lose access to related capabilities."
        confirmText="Delete Role"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDeleteRole}
        onClose={() => setDeleteRoleTarget(null)}
      />
    </Box>
  )
}

export default RolesPermissionsPage
