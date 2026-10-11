import { axiosClient } from '@/api/axiosClient'
import type {
  BranchItem,
  BranchesQuery,
  CreateBranchPayload,
  UpdateBranchPayload,
} from './types'

export const branchService = {
  async getBranches(query?: BranchesQuery): Promise<{ branches: BranchItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: BranchItem[] | { branches: BranchItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/branches', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        branches: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      branches: resData.branches || [],
      total: resData.total || (resData.branches || []).length,
    }
  },

  async getBranchById(id: string): Promise<BranchItem> {
    const response = await axiosClient.get<{ data: BranchItem }>(`/branches/${id}`)
    return response.data.data
  },

  async createBranch(payload: CreateBranchPayload): Promise<BranchItem> {
    const response = await axiosClient.post<{ data: BranchItem }>('/branches', payload)
    return response.data.data
  },

  async updateBranch(id: string, payload: UpdateBranchPayload): Promise<BranchItem> {
    const response = await axiosClient.put<{ data: BranchItem }>(`/branches/${id}`, payload)
    return response.data.data
  },

  async updateBranchStatus(id: string, status: string): Promise<BranchItem> {
    const response = await axiosClient.patch<{ data: BranchItem }>(`/branches/${id}/status`, {
      status,
    })
    return response.data.data
  },
}
