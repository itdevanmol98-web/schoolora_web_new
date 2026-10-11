export interface AuditLogItem {
  id: string
  tenantId?: string
  userId?: string
  userEmail?: string
  userName?: string
  resource: string
  action: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, unknown>
  createdAt: string
}

export interface AuditQuery {
  page?: number
  limit?: number
  resource?: string
  action?: string
  search?: string
}
