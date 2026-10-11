import axiosClient from '../../api/axiosClient';
import type { TeacherAssignment, CreateTeacherAssignmentDto } from './types';

export const teacherAssignmentService = {
  async listAssignments(params?: {
    teacherId?: string;
    role?: string;
    sessionId?: string;
    classId?: string;
    sectionId?: string;
  }): Promise<TeacherAssignment[]> {
    const res = await axiosClient.get<{ data: TeacherAssignment[] } | TeacherAssignment[]>(
      '/teacher-assignments',
      { params }
    );
    const result = res.data;
    if (Array.isArray(result)) return result;
    if (result && typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  },

  async createAssignment(payload: CreateTeacherAssignmentDto): Promise<TeacherAssignment> {
    const res = await axiosClient.post<TeacherAssignment | { data: TeacherAssignment }>(
      '/teacher-assignments',
      payload
    );
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: TeacherAssignment }).data;
    }
    return data as TeacherAssignment;
  },

  async getAssignmentById(id: string): Promise<TeacherAssignment> {
    const res = await axiosClient.get<TeacherAssignment | { data: TeacherAssignment }>(
      `/teacher-assignments/${id}`
    );
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: TeacherAssignment }).data;
    }
    return data as TeacherAssignment;
  },

  async deleteAssignment(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.delete<{ success?: boolean; message?: string }>(
      `/teacher-assignments/${id}`
    );
    return {
      success: res.data?.success !== false,
      message: res.data?.message || 'Assignment removed successfully',
    };
  },
};
