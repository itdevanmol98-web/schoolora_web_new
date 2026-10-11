export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING'

export interface TenantSettings {
  academic_year?: string
  timezone?: string
  currency?: string
  [key: string]: unknown
}

export interface TenantItem {
  id: string
  name: string
  code: string
  plan?: string
  customDomain?: string | null
  status: TenantStatus
  createdAt: string
  updatedAt?: string
  settings?: TenantSettings
}

export interface TenantsQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TenantsListResponse {
  tenants: TenantItem[]
  total: number
  page: number
  limit: number
}

export interface CreateTenantPayload {
  name: string
  code: string
  plan?: string
  customDomain?: string
}

export interface UpdateTenantPayload {
  name?: string
  customDomain?: string
}
