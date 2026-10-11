import { axiosClient } from '@/api/axiosClient'
import type { SchoolSetupStatus, SchoolProfile, UpdateSchoolProfilePayload } from './types'

export const schoolSetupService = {
  async getStatus(): Promise<SchoolSetupStatus> {
    const response = await axiosClient.get<{ data?: SchoolSetupStatus; status?: SchoolSetupStatus }>(
      '/school-setup/status'
    )
    return response.data.data || response.data.status || (response.data as unknown as SchoolSetupStatus)
  },

  async getProfile(): Promise<SchoolProfile> {
    const response = await axiosClient.get<{ data?: SchoolProfile; profile?: SchoolProfile }>(
      '/school-setup/profile'
    )
    return response.data.data || response.data.profile || (response.data as unknown as SchoolProfile)
  },

  async updateProfile(payload: UpdateSchoolProfilePayload): Promise<SchoolProfile> {
    const response = await axiosClient.put<{ data?: SchoolProfile; message?: string }>(
      '/school-setup/profile',
      payload
    )
    return response.data.data || (response.data as unknown as SchoolProfile)
  },
}

export default schoolSetupService
