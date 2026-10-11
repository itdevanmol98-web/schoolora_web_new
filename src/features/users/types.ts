import type { UserStatus } from '@/features/auth/types'

export interface UserItem {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  status: UserStatus
  schoolId?: string | null
  branchId?: string | null
  tenantId: string
  mustChangePassword?: boolean
  emailVerified?: boolean
  roles?: Array<{
    id: string
    name: string
    code: string
  }>
  createdAt: string
  updatedAt?: string
}

export interface UsersQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  phone?: string
  schoolId?: string
  branchId?: string
  roleId?: string
  temporaryPassword?: string
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  phone?: string
}
