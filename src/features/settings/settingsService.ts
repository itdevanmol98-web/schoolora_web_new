import { axiosClient } from '@/api/axiosClient'
import type { TenantPlatformSettings } from './types'

export const settingsService = {
  async getSettings(): Promise<TenantPlatformSettings> {
    const response = await axiosClient.get<{ data: TenantPlatformSettings }>('/settings')
    return response.data.data || {}
  },

  async updateSettings(payload: TenantPlatformSettings): Promise<TenantPlatformSettings> {
    const response = await axiosClient.put<{ data: TenantPlatformSettings }>('/settings', payload)
    return response.data.data
  },
}
