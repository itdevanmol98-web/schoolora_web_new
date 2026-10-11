export type BranchStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface BranchItem {
  id: string
  schoolId: string
  tenantId?: string
  name: string
  code: string
  phone?: string | null
  address?: string | null
  status: BranchStatus
  createdAt: string
  updatedAt?: string
  school?: {
    id: string
    name: string
  }
}

export interface BranchesQuery {
  page?: number
  limit?: number
  status?: string
}

export interface CreateBranchPayload {
  schoolId: string
  name: string
  code: string
  phone?: string
  address?: string
}

export interface UpdateBranchPayload {
  name?: string
  phone?: string
  address?: string
}
