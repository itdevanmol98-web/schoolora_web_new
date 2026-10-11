import { axiosClient } from '@/api/axiosClient'
import type {
  ClassItem,
  CreateClassPayload,
  UpdateClassPayload,
  SectionItem,
  CreateSectionPayload,
  UpdateSectionPayload,
} from './types'

export interface GetClassesParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ClassesListResponse {
  classes: ClassItem[]
  total: number
}

export interface GetSectionsParams {
  classId?: string
  page?: number
  limit?: number
}

export interface SectionsListResponse {
  sections: SectionItem[]
  total: number
}

export const classSectionService = {
  // --- Classes ---
  async getClasses(params: GetClassesParams = {}): Promise<ClassesListResponse> {
    const response = await axiosClient.get<{
      data?: ClassItem[]
      classes?: ClassItem[]
      total?: number
    }>('/classes', { params })

    const list = response.data.data || response.data.classes || []
    return {
      classes: Array.isArray(list) ? list : [],
      total: response.data.total ?? (Array.isArray(list) ? list.length : 0),
    }
  },

  async listClasses(params: GetClassesParams = {}): Promise<{ data: ClassItem[]; total: number }> {
    const res = await this.getClasses(params)
    return { data: res.classes, total: res.total }
  },

  async getClassById(id: string): Promise<ClassItem> {
    const response = await axiosClient.get<{ data?: ClassItem }>(`/classes/${id}`)
    return response.data.data || (response.data as unknown as ClassItem)
  },

  async createClass(payload: CreateClassPayload): Promise<ClassItem> {
    const response = await axiosClient.post<{ data?: ClassItem; message?: string }>(
      '/classes',
      payload
    )
    return response.data.data || (response.data as unknown as ClassItem)
  },

  async updateClass(id: string, payload: UpdateClassPayload): Promise<ClassItem> {
    const response = await axiosClient.put<{ data?: ClassItem; message?: string }>(
      `/classes/${id}`,
      payload
    )
    return response.data.data || (response.data as unknown as ClassItem)
  },

  async deleteClass(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await axiosClient.delete<{ message?: string }>(`/classes/${id}`)
    return { success: true, message: response.data?.message || 'Class removed successfully' }
  },

  // --- Sections ---
  async getSections(params: GetSectionsParams = {}): Promise<SectionsListResponse> {
    const response = await axiosClient.get<{
      data?: SectionItem[]
      sections?: SectionItem[]
      total?: number
    }>('/sections', { params })

    const list = response.data.data || response.data.sections || []
    return {
      sections: Array.isArray(list) ? list : [],
      total: response.data.total ?? (Array.isArray(list) ? list.length : 0),
    }
  },

  async listSections(params: GetSectionsParams = {}): Promise<{ data: SectionItem[]; total: number }> {
    const res = await this.getSections(params)
    return { data: res.sections, total: res.total }
  },

  async getSectionById(id: string): Promise<SectionItem> {
    const response = await axiosClient.get<{ data?: SectionItem }>(`/sections/${id}`)
    return response.data.data || (response.data as unknown as SectionItem)
  },

  async createSection(payload: CreateSectionPayload): Promise<SectionItem> {
    const response = await axiosClient.post<{ data?: SectionItem; message?: string }>(
      '/sections',
      payload
    )
    return response.data.data || (response.data as unknown as SectionItem)
  },

  async updateSection(id: string, payload: UpdateSectionPayload): Promise<SectionItem> {
    const response = await axiosClient.put<{ data?: SectionItem; message?: string }>(
      `/sections/${id}`,
      payload
    )
    return response.data.data || (response.data as unknown as SectionItem)
  },

  async deleteSection(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await axiosClient.delete<{ message?: string }>(`/sections/${id}`)
    return { success: true, message: response.data?.message || 'Section removed successfully' }
  },
}

export default classSectionService
