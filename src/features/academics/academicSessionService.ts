import { axiosClient } from '@/api/axiosClient'
import type { AcademicSessionItem, CreateAcademicSessionPayload } from './types'

export interface GetSessionsParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SessionsListResponse {
  sessions: AcademicSessionItem[]
  total: number
}

export const academicSessionService = {
  async getSessions(params: GetSessionsParams = {}): Promise<SessionsListResponse> {
    const response = await axiosClient.get<{
      data?: AcademicSessionItem[]
      sessions?: AcademicSessionItem[]
      total?: number
    }>('/academic-sessions', { params })

    const list = response.data.data || response.data.sessions || []
    return {
      sessions: Array.isArray(list) ? list : [],
      total: response.data.total ?? (Array.isArray(list) ? list.length : 0),
    }
  },

  async listSessions(params: GetSessionsParams = {}): Promise<{ data: AcademicSessionItem[]; total: number }> {
    const res = await this.getSessions(params)
    return { data: res.sessions, total: res.total }
  },

  async getSessionById(id: string): Promise<AcademicSessionItem> {
    const response = await axiosClient.get<{ data?: AcademicSessionItem }>(`/academic-sessions/${id}`)
    return response.data.data || (response.data as unknown as AcademicSessionItem)
  },

  async createSession(payload: CreateAcademicSessionPayload): Promise<AcademicSessionItem> {
    const response = await axiosClient.post<{ data?: AcademicSessionItem; message?: string }>(
      '/academic-sessions',
      payload
    )
    return response.data.data || (response.data as unknown as AcademicSessionItem)
  },

  async updateSession(
    id: string,
    payload: Partial<CreateAcademicSessionPayload> & { isClosed?: boolean; status?: string }
  ): Promise<AcademicSessionItem> {
    const response = await axiosClient.put<{ data?: AcademicSessionItem; message?: string }>(
      `/academic-sessions/${id}`,
      payload
    )
    return response.data.data || (response.data as unknown as AcademicSessionItem)
  },

  async setCurrentSession(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await axiosClient.post<{ message?: string }>(`/academic-sessions/${id}/set-current`)
    return { success: true, message: response.data?.message || 'Academic session marked as current' }
  },

  async closeSession(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await axiosClient.post<{ message?: string }>(`/academic-sessions/${id}/close`)
    return { success: true, message: response.data?.message || 'Academic session closed successfully' }
  },
}

export default academicSessionService
