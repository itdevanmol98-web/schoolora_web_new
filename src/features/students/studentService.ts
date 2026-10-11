import axiosClient from '../../api/axiosClient';
import type {
  Student,
  CreateStudentDto,
  StudentTransferDto,
  StudentPromoteDto,
  StudentWithdrawDto,
} from './types';

export const studentService = {
  async listStudents(params?: {
    classId?: string;
    sectionId?: string;
    sessionId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Student[]; total?: number }> {
    const res = await axiosClient.get<{ data: Student[]; total?: number; meta?: { total: number } }>(
      '/students',
      { params }
    );
    const result = res.data as unknown as {
      data: Student[] | { data: Student[] };
      total?: number;
      meta?: { total: number };
    };

    if (Array.isArray(result.data)) {
      return {
        data: result.data,
        total: result.total || result.meta?.total || result.data.length,
      };
    }
    if (
      result.data &&
      typeof result.data === 'object' &&
      'data' in result.data &&
      Array.isArray((result.data as { data: Student[] }).data)
    ) {
      const inner = result.data as { data: Student[]; total?: number };
      return {
        data: inner.data,
        total: inner.total || result.meta?.total || inner.data.length,
      };
    }
    return { data: [], total: 0 };
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await axiosClient.get<Student | { data: Student }>(`/students/${id}`);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: Student }).data;
    }
    return data as Student;
  },

  async createStudent(payload: CreateStudentDto): Promise<Student> {
    const res = await axiosClient.post<Student | { data: Student }>('/students', payload);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: Student }).data;
    }
    return data as Student;
  },

  async updateStudent(
    id: string,
    payload: Partial<CreateStudentDto> & { status?: string }
  ): Promise<Student> {
    const res = await axiosClient.put<Student | { data: Student }>(`/students/${id}`, payload);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: Student }).data;
    }
    return data as Student;
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.delete<{ success: boolean; message?: string }>(`/students/${id}`);
    return res.data;
  },

  async enrollStudent(
    id: string,
    payload: {
      sessionId: string;
      classId: string;
      sectionId: string;
      rollNumber?: string;
    }
  ): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.post<{ success: boolean; message?: string }>(
      `/students/${id}/enroll`,
      payload
    );
    return res.data;
  },

  async transferStudent(id: string, payload: StudentTransferDto): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.post<{ success: boolean; message?: string }>(
      `/students/${id}/transfer`,
      payload
    );
    return res.data;
  },

  async promoteStudent(id: string, payload: StudentPromoteDto): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.post<{ success: boolean; message?: string }>(
      `/students/${id}/promote`,
      payload
    );
    return res.data;
  },

  async withdrawStudent(id: string, payload: StudentWithdrawDto): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.post<{ success: boolean; message?: string }>(
      `/students/${id}/withdraw`,
      payload
    );
    return res.data;
  },
};
