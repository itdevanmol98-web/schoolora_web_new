import { axiosClient } from '@/api/axiosClient'
import type { CustomDomainItem, AddDomainPayload } from './types'

export const domainService = {
  async getDomains(): Promise<CustomDomainItem[]> {
    const response = await axiosClient.get<{ data: CustomDomainItem[] }>('/domains')
    return response.data.data || []
  },

  async addDomain(payload: AddDomainPayload): Promise<CustomDomainItem> {
    const response = await axiosClient.post<{ data: CustomDomainItem }>('/domains', payload)
    return response.data.data
  },

  async verifyDomain(id: string): Promise<{ verified: boolean; message: string }> {
    const response = await axiosClient.post<{
      data?: { verified: boolean }
      message: string
    }>(`/domains/${id}/verify`)
    return {
      verified: response.data.data?.verified ?? true,
      message: response.data.message || 'Domain verified successfully',
    }
  },

  async setPrimaryDomain(id: string): Promise<CustomDomainItem> {
    const response = await axiosClient.patch<{ data: CustomDomainItem }>(`/domains/${id}/primary`)
    return response.data.data
  },

  async deleteDomain(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(`/domains/${id}`)
    return response.data
  },
}
