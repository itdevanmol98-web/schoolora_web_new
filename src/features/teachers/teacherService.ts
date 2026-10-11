import axiosClient from '../../api/axiosClient';
import type { TeacherProfile, CreateTeacherDto, UpdateTeacherDto } from './types';

export const teacherService = {
  async listTeachers(params?: {
    department?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: TeacherProfile[]; total?: number }> {
    const res = await axiosClient.get<{ data: TeacherProfile[]; total?: number; meta?: { total: number } }>(
      '/teachers',
      { params }
    );
    const result = res.data as unknown as { data: TeacherProfile[] | { data: TeacherProfile[] }; total?: number; meta?: { total: number } };
    if (Array.isArray(result.data)) {
      return {
        data: result.data,
        total: result.total || result.meta?.total || result.data.length,
      };
    }
    if (result.data && typeof result.data === 'object' && 'data' in result.data && Array.isArray((result.data as { data: TeacherProfile[] }).data)) {
      const inner = result.data as { data: TeacherProfile[]; total?: number };
      return {
        data: inner.data,
        total: inner.total || result.meta?.total || inner.data.length,
      };
    }
    return { data: [], total: 0 };
  },

  async getTeacherById(id: string): Promise<TeacherProfile> {
    const res = await axiosClient.get<TeacherProfile | { data: TeacherProfile }>(`/teachers/${id}`);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: TeacherProfile }).data;
    }
    return data as TeacherProfile;
  },

  async createTeacher(payload: CreateTeacherDto): Promise<TeacherProfile> {
    const res = await axiosClient.post<TeacherProfile | { data: TeacherProfile }>('/teachers', payload);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: TeacherProfile }).data;
    }
    return data as TeacherProfile;
  },

  async updateTeacher(id: string, payload: UpdateTeacherDto): Promise<TeacherProfile> {
    const res = await axiosClient.put<TeacherProfile | { data: TeacherProfile }>(`/teachers/${id}`, payload);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: TeacherProfile }).data;
    }
    return data as TeacherProfile;
  },

  async deleteTeacher(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.delete<{ success: boolean; message?: string }>(`/teachers/${id}`);
    return res.data;
  },
};
