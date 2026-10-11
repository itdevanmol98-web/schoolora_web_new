import { describe, it, expect } from 'vitest'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { handleAxiosError, AppApiError } from '@/api/apiErrors'

describe('Centralized API Error Handling', () => {
  it('passes through existing AppApiError instances', () => {
    const original = new AppApiError({ statusCode: 403, message: 'Forbidden' })
    const result = handleAxiosError(original)
    expect(result).toBe(original)
    expect(result.statusCode).toBe(403)
  })

  it('normalizes 401 unauthenticated errors', () => {
    const error = new AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      {} as InternalAxiosRequestConfig,
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Token expired' },
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      } as AxiosResponse
    )

    const normalized = handleAxiosError(error)
    expect(normalized).toBeInstanceOf(AppApiError)
    expect(normalized.statusCode).toBe(401)
    expect(normalized.message).toBe('Token expired')
  })

  it('normalizes network errors gracefully without swallowing failure', () => {
    const error = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
      {} as InternalAxiosRequestConfig,
      null,
      undefined
    )

    const normalized = handleAxiosError(error)
    expect(normalized).toBeInstanceOf(AppApiError)
    expect(normalized.statusCode).toBe(0)
    expect(normalized.message).toContain(
      'Unable to connect to the Schoolora backend server'
    )
  })

  it('normalizes timeout errors gracefully', () => {
    const error = new AxiosError(
      'timeout of 15000ms exceeded',
      'ECONNABORTED',
      {} as InternalAxiosRequestConfig,
      null,
      undefined
    )

    const normalized = handleAxiosError(error)
    expect(normalized).toBeInstanceOf(AppApiError)
    expect(normalized.message).toContain('timed out')
  })
})
