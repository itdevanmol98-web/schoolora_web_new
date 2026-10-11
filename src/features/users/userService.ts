import { axiosClient } from '@/api/axiosClient'
import type {
  UserItem,
  UsersQuery,
  CreateUserPayload,
  UpdateUserPayload,
} from './types'

export const userService = {
  async getUsers(query?: UsersQuery): Promise<{ users: UserItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: UserItem[] | { users: UserItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/users', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        users: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      users: resData.users || [],
      total: resData.total || (resData.users || []).length,
    }
  },

  async getUserById(id: string): Promise<UserItem> {
    const response = await axiosClient.get<{ data: UserItem }>(`/users/${id}`)
    return response.data.data
  },

  async createUser(payload: CreateUserPayload): Promise<UserItem> {
    const response = await axiosClient.post<{ data: UserItem }>('/users', payload)
    return response.data.data
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserItem> {
    const response = await axiosClient.put<{ data: UserItem }>(`/users/${id}`, payload)
    return response.data.data
  },

  async updateUserStatus(id: string, status: string): Promise<UserItem> {
    const response = await axiosClient.patch<{ data: UserItem }>(`/users/${id}/status`, {
      status,
    })
    return response.data.data
  },

  async assignRoleToUser(userId: string, roleId: string): Promise<{ message: string }> {
    const response = await axiosClient.post<{ message: string }>(`/users/${userId}/roles`, {
      roleId,
    })
    return response.data
  },

  async removeRoleFromUser(userId: string, roleId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(
      `/users/${userId}/roles/${roleId}`
    )
    return response.data
  },

  async adminResetPassword(userId: string): Promise<{ temporaryPassword?: string; message: string }> {
    const response = await axiosClient.post<{
      data?: { temporaryPassword?: string }
      message: string
    }>(`/users/${userId}/reset-password`)
    return {
      temporaryPassword: response.data.data?.temporaryPassword,
      message: response.data.message || 'Password reset requested successfully',
    }
  },
}
