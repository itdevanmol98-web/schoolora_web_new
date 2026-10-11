import { axiosClient } from '@/api/axiosClient'
import type { AuditLogItem, AuditQuery } from './types'

export const auditService = {
  async getAuditLogs(query?: AuditQuery): Promise<{ logs: AuditLogItem[]; total: number }> {
    const response = await axiosClient.get<{
      data: AuditLogItem[] | { logs: AuditLogItem[]; total: number }
      meta?: { total: number }
      total?: number
    }>('/audit', { params: query })

    const resData = response.data.data
    if (Array.isArray(resData)) {
      return {
        logs: resData,
        total: response.data.meta?.total ?? response.data.total ?? resData.length,
      }
    }
    return {
      logs: resData.logs || [],
      total: resData.total || (resData.logs || []).length,
    }
  },
}
