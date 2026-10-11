import { axiosClient } from '@/api/axiosClient'
import type {
  SchoolItem,
  SchoolsQuery,
  CreateSchoolPayload,
  UpdateSchoolPayload,
  CreateSchoolResponse,
} from './types'

export const schoolService = {
  async getSchools(query?: SchoolsQuery): Promise<{ schools: SchoolItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: SchoolItem[] | { schools: SchoolItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/schools', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        schools: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      schools: resData.schools || [],
      total: resData.total || (resData.schools || []).length,
    }
  },

  async getSchoolById(id: string): Promise<SchoolItem> {
    const response = await axiosClient.get<{ data: SchoolItem }>(`/schools/${id}`)
    return response.data.data
  },

  async createSchool(payload: CreateSchoolPayload): Promise<CreateSchoolResponse> {
    const response = await axiosClient.post<{
      data: SchoolItem & { temporaryAdminCredentials?: { email: string; temporaryPassword?: string } }
    }>('/schools', payload)

    const data = response.data.data
    return {
      school: data,
      temporaryAdminCredentials: data.temporaryAdminCredentials,
    }
  },

  async updateSchool(id: string, payload: UpdateSchoolPayload): Promise<SchoolItem> {
    const response = await axiosClient.put<{ data: SchoolItem }>(`/schools/${id}`, payload)
    return response.data.data
  },

  async updateSchoolStatus(id: string, status: string): Promise<SchoolItem> {
    const response = await axiosClient.patch<{ data: SchoolItem }>(`/schools/${id}/status`, {
      status,
    })
    return response.data.data
  },

  async listSchools(query?: SchoolsQuery): Promise<{ data: SchoolItem[]; total: number }> {
    const res = await schoolService.getSchools(query)
    return { data: res.schools, total: res.total }
  },
}

export const schoolsService = schoolService
export default schoolService
