export type SchoolStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
export type School = SchoolItem

export interface SchoolItem {
  id: string
  tenantId?: string
  name: string
  code: string
  contactEmail: string
  contactPhone?: string | null
  address?: string | null
  status: SchoolStatus
  createdAt: string
  updatedAt?: string
  adminUser?: {
    id?: string
    email?: string
    firstName?: string
    lastName?: string
  }
}

export interface SchoolsQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export interface CreateSchoolPayload {
  name: string
  code: string
  contactEmail: string
  contactPhone?: string
  address?: string
  adminFirstName?: string
  adminLastName?: string
  adminEmail?: string
  adminPhone?: string
}

export interface UpdateSchoolPayload {
  name?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

export interface CreateSchoolResponse {
  school: SchoolItem
  temporaryAdminCredentials?: {
    email: string
    temporaryPassword?: string
  }
}
