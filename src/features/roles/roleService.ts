import { axiosClient } from '@/api/axiosClient'
import type {
  RoleItem,
  PermissionItem,
  RolesQuery,
  CreateRolePayload,
  UpdateRolePayload,
} from './types'

export const roleService = {
  async getPermissions(): Promise<PermissionItem[]> {
    const response = await axiosClient.get<{ data: PermissionItem[] }>('/permissions')
    return response.data.data || []
  },

  async getRoles(query?: RolesQuery): Promise<{ roles: RoleItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: RoleItem[] | { roles: RoleItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/roles', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        roles: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      roles: resData.roles || [],
      total: resData.total || (resData.roles || []).length,
    }
  },

  async getRoleById(id: string): Promise<RoleItem> {
    const response = await axiosClient.get<{ data: RoleItem }>(`/roles/${id}`)
    return response.data.data
  },

  async createRole(payload: CreateRolePayload): Promise<RoleItem> {
    const response = await axiosClient.post<{ data: RoleItem }>('/roles', payload)
    return response.data.data
  },

  async updateRole(id: string, payload: UpdateRolePayload): Promise<RoleItem> {
    const response = await axiosClient.put<{ data: RoleItem }>(`/roles/${id}`, payload)
    return response.data.data
  },

  async deleteRole(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(`/roles/${id}`)
    return response.data
  },
}
