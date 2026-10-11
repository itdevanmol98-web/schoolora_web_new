export interface PermissionItem {
  id: string
  name: string
  code: string
  module: string
  action: string
  description?: string
}

export interface RoleItem {
  id: string
  name: string
  code: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
  isSystem?: boolean
  permissions?: PermissionItem[]
  createdAt: string
  updatedAt?: string
}

export interface RolesQuery {
  page?: number
  limit?: number
  status?: string
}

export interface CreateRolePayload {
  name: string
  code: string
  description?: string
  permissionIds: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  permissionIds?: string[]
}
