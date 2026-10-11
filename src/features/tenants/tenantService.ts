import { axiosClient } from '@/api/axiosClient'
import type {
  TenantItem,
  TenantsQuery,
  TenantsListResponse,
  CreateTenantPayload,
  UpdateTenantPayload,
  TenantSettings,
} from './types'

export const tenantService = {
  async getTenants(query?: TenantsQuery): Promise<TenantsListResponse> {
    const response = await axiosClient.get<{
      data: TenantItem[] | TenantsListResponse
      meta?: { total: number; page: number; limit: number }
      total?: number
    }>('/tenants', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        tenants: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
        page: query?.page ?? 1,
        limit: query?.limit ?? 20,
      }
    }
    return resData as TenantsListResponse
  },

  async getTenantById(id: string): Promise<TenantItem> {
    const response = await axiosClient.get<{ data: TenantItem }>(`/tenants/${id}`)
    return response.data.data
  },

  async createTenant(payload: CreateTenantPayload): Promise<TenantItem> {
    const response = await axiosClient.post<{ data: TenantItem }>('/tenants', payload)
    return response.data.data
  },

  async updateTenant(id: string, payload: UpdateTenantPayload): Promise<TenantItem> {
    const response = await axiosClient.put<{ data: TenantItem }>(`/tenants/${id}`, payload)
    return response.data.data
  },

  async updateTenantStatus(id: string, status: string): Promise<TenantItem> {
    const response = await axiosClient.patch<{ data: TenantItem }>(`/tenants/${id}/status`, {
      status,
    })
    return response.data.data
  },

  async getTenantSettings(id: string): Promise<TenantSettings> {
    const response = await axiosClient.get<{ data: TenantSettings }>(`/tenants/${id}/settings`)
    return response.data.data
  },

  async updateTenantSettings(id: string, settings: TenantSettings): Promise<TenantSettings> {
    const response = await axiosClient.put<{ data: TenantSettings }>(
      `/tenants/${id}/settings`,
      settings
    )
    return response.data.data
  },
}
