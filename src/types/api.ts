export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: ApiErrorPayload
  timestamp?: string
}

export interface ApiErrorPayload {
  code?: string
  message: string
  details?: Record<string, string[]> | Array<{ field: string; message: string }>
  statusCode?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
