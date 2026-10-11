import axiosClient from '../../api/axiosClient';
import type { Parent, CreateParentDto, LinkStudentDto, ParentStudentLink } from './types';

export const parentService = {
  async listParents(params?: {
    relationshipType?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: Parent[]; total?: number }> {
    const res = await axiosClient.get<{ data: Parent[]; total?: number; meta?: { total: number } }>(
      '/parents',
      { params }
    );
    const result = res.data as unknown as {
      data: Parent[] | { data: Parent[] };
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
      Array.isArray((result.data as { data: Parent[] }).data)
    ) {
      const inner = result.data as { data: Parent[]; total?: number };
      return {
        data: inner.data,
        total: inner.total || result.meta?.total || inner.data.length,
      };
    }
    return { data: [], total: 0 };
  },

  async getParentById(id: string): Promise<Parent> {
    const res = await axiosClient.get<Parent | { data: Parent }>(`/parents/${id}`);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: Parent }).data;
    }
    return data as Parent;
  },

  async createParent(payload: CreateParentDto): Promise<Parent> {
    const res = await axiosClient.post<Parent | { data: Parent }>('/parents', payload);
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: Parent }).data;
    }
    return data as Parent;
  },

  async linkStudent(parentId: string, payload: LinkStudentDto): Promise<ParentStudentLink> {
    const res = await axiosClient.post<ParentStudentLink | { data: ParentStudentLink }>(
      `/parents/${parentId}/students`,
      payload
    );
    const data = res.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: ParentStudentLink }).data;
    }
    return data as ParentStudentLink;
  },

  async getLinkedStudents(parentId: string): Promise<ParentStudentLink[]> {
    const res = await axiosClient.get<ParentStudentLink[] | { data: ParentStudentLink[] }>(
      `/parents/${parentId}/students`
    );
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  },

  async unlinkStudent(parentId: string, studentId: string): Promise<{ success: boolean; message?: string }> {
    const res = await axiosClient.delete<{ success: boolean; message?: string }>(
      `/parents/${parentId}/students/${studentId}`
    );
    return res.data;
  },
};
