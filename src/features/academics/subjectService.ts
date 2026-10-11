import { axiosClient } from '@/api/axiosClient'
import type {
  SubjectItem,
  CreateSubjectPayload,
  ClassSubjectMappingItem,
  CreateClassSubjectMappingPayload,
} from './types'

export interface GetSubjectsParams {
  type?: string
  page?: number
  limit?: number
}

export interface SubjectsListResponse {
  subjects: SubjectItem[]
  total: number
}

export const subjectService = {
  // --- Curriculum Subjects ---
  async getSubjects(params: GetSubjectsParams = {}): Promise<SubjectsListResponse> {
    const response = await axiosClient.get<{
      data?: SubjectItem[]
      subjects?: SubjectItem[]
      total?: number
    }>('/subjects', { params })

    const list = response.data.data || response.data.subjects || []
    return {
      subjects: Array.isArray(list) ? list : [],
      total: response.data.total ?? (Array.isArray(list) ? list.length : 0),
    }
  },

  async listSubjects(params: GetSubjectsParams = {}): Promise<{ data: SubjectItem[]; total: number }> {
    const res = await this.getSubjects(params)
    return { data: res.subjects, total: res.total }
  },

  async createSubject(payload: CreateSubjectPayload): Promise<SubjectItem> {
    const response = await axiosClient.post<{ data?: SubjectItem; message?: string }>(
      '/subjects',
      payload
    )
    return response.data.data || (response.data as unknown as SubjectItem)
  },

  // --- Class-Subject Mapping ---
  async mapSubjectToClass(
    payload: CreateClassSubjectMappingPayload
  ): Promise<ClassSubjectMappingItem> {
    const response = await axiosClient.post<{ data?: ClassSubjectMappingItem; message?: string }>(
      '/subjects/class-subjects',
      payload
    )
    return response.data.data || (response.data as unknown as ClassSubjectMappingItem)
  },

  async getClassSubjects(classId: string): Promise<ClassSubjectMappingItem[]> {
    const response = await axiosClient.get<{
      data?: ClassSubjectMappingItem[]
      mappings?: ClassSubjectMappingItem[]
    }>(`/subjects/class-subjects/${classId}`)

    const list = response.data.data || response.data.mappings || []
    return Array.isArray(list) ? list : []
  },

  async listClassSubjects(classId: string): Promise<ClassSubjectMappingItem[]> {
    return this.getClassSubjects(classId)
  },

  async removeClassSubject(mappingId: string): Promise<{ success: boolean; message?: string }> {
    const response = await axiosClient.delete<{ message?: string }>(
      `/subjects/class-subjects/${mappingId}`
    )
    return { success: true, message: response.data?.message || 'Subject mapping removed' }
  },
}

export default subjectService
