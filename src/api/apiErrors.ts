import { AxiosError } from 'axios'
import type { ApiErrorPayload } from '@/types/api'

export class AppApiError extends Error {
  public readonly statusCode: number
  public readonly code?: string
  public readonly details?:
    Record<string, string[]> | Array<{ field: string; message: string }>

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = 'AppApiError'
    this.statusCode = payload.statusCode ?? 500
    this.code = payload.code
    this.details = payload.details
    Object.setPrototypeOf(this, AppApiError.prototype)
  }
}

/**
 * Normalizes Axios errors into standard AppApiError instances.
 * Never mocks data - presents true server or network errors.
 */
export function handleAxiosError(error: unknown): AppApiError {
  if (error instanceof AppApiError) {
    return error
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const responseData = error.response?.data as
      | {
          message?: string
          error?: string
          code?: string
          details?: Record<string, string[]>
        }
      | undefined

    let message = 'An unexpected network error occurred. Please try again.'

    if (responseData?.message) {
      message = responseData.message
    } else if (responseData?.error) {
      message = responseData.error
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      message =
        'Request timed out. Please check your internet connection or backend status.'
    } else if (status === 0 || error.code === 'ERR_NETWORK') {
      message =
        'Unable to connect to the Schoolora backend server. Please check if the backend is running.'
    } else if (status === 400) {
      message = 'Invalid request parameters or payload.'
    } else if (status === 401) {
      message = 'Your session has expired or you are unauthenticated. Please sign in.'
    } else if (status === 403) {
      message = 'Access forbidden: you do not have permission to perform this action.'
    } else if (status === 404) {
      message = 'The requested resource was not found on the server.'
    } else if (status >= 500) {
      message = 'Schoolora backend server encountered an error. Please try again later.'
    }

    return new AppApiError({
      statusCode: status,
      code: responseData?.code || error.code,
      message,
      details: responseData?.details,
    })
  }

  if (error instanceof Error) {
    return new AppApiError({
      statusCode: 500,
      message: error.message,
    })
  }

  return new AppApiError({
    statusCode: 500,
    message: 'Unknown error occurred while contacting the server.',
  })
}
