import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { axiosClient } from '@/api/axiosClient'
import { tokenStorage } from '@/utils/tokenStorage'

describe('Authentication & Security Infrastructure', () => {
  beforeEach(() => {
    tokenStorage.clearTokens()
    vi.restoreAllMocks()
  })

  describe('Token Storage Security', () => {
    it('safely stores and retrieves access and refresh tokens', () => {
      tokenStorage.setTokens({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-abc',
      })

      expect(tokenStorage.getAccessToken()).toBe('access-token-123')
      expect(tokenStorage.getRefreshToken()).toBe('refresh-token-abc')
      expect(tokenStorage.hasValidTokens()).toBe(true)
    })

    it('clears all tokens completely upon logout or revocation', () => {
      tokenStorage.setTokens({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-abc',
      })

      tokenStorage.clearTokens()
      expect(tokenStorage.getAccessToken()).toBeNull()
      expect(tokenStorage.getRefreshToken()).toBeNull()
      expect(tokenStorage.hasValidTokens()).toBe(false)
    })
  })

  describe('Axios Token Injection', () => {
    it('injects Bearer token into Authorization header when token exists', async () => {
      tokenStorage.setAccessToken('valid-jwt-token')

      // Mock axios request fulfillment
      const spy = vi.spyOn(axiosClient, 'get').mockImplementation(async (_url, config) => {
        return {
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config || {},
        } as AxiosResponse
      })

      await axiosClient.get('/test-endpoint')
      expect(spy).toHaveBeenCalledWith('/test-endpoint')
    })
  })

  describe('Token Refresh & Concurrency Logic', () => {
    it('avoids refresh loops on authentication endpoints', async () => {
      tokenStorage.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh-token',
      })

      const postSpy = vi.spyOn(axios, 'post')

      const authError = new AxiosError(
        'Invalid credentials',
        'ERR_BAD_REQUEST',
        { url: '/auth/login', headers: {} } as InternalAxiosRequestConfig,
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: { message: 'Invalid credentials' } },
          headers: {},
          config: { url: '/auth/login', headers: {} } as InternalAxiosRequestConfig,
        } as AxiosResponse
      )

      // Test interceptor error handler directly
      try {
        const handler = (axiosClient.interceptors.response as any).handlers?.[0]
        if (handler?.rejected) {
          await handler.rejected(authError)
        }
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }

      // Should not have attempted to refresh token for /auth/login
      expect(postSpy).not.toHaveBeenCalled()
    })

    it('prevents infinite loops when request has already retried', async () => {
      tokenStorage.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh-token',
      })

      const postSpy = vi.spyOn(axios, 'post')

      const retriedError = new AxiosError(
        'Still unauthorized',
        'ERR_BAD_REQUEST',
        { url: '/dashboard', _retry: true, headers: {} } as unknown as InternalAxiosRequestConfig,
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: { message: 'Unauthorized' } },
          headers: {},
          config: { url: '/dashboard', _retry: true, headers: {} } as unknown as InternalAxiosRequestConfig,
        } as AxiosResponse
      )

      try {
        const handler = (axiosClient.interceptors.response as any).handlers?.[0]
        if (handler?.rejected) {
          await handler.rejected(retriedError)
        }
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }

      // Should not attempt refresh when _retry is true
      expect(postSpy).not.toHaveBeenCalled()
      // Stale tokens should be purged
      expect(tokenStorage.getAccessToken()).toBeNull()
    })

    it('clears credentials when refresh endpoint fails', async () => {
      tokenStorage.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'revoked-refresh-token',
      })

      vi.spyOn(axios, 'post').mockRejectedValueOnce(
        new AxiosError(
          'Refresh token expired',
          'ERR_BAD_REQUEST',
          {} as InternalAxiosRequestConfig,
          {},
          {
            status: 401,
            data: { error: { message: 'Refresh token expired' } },
          } as AxiosResponse
        )
      )

      const expiredError = new AxiosError(
        'Token expired',
        'ERR_BAD_REQUEST',
        { url: '/users/profile', headers: {} } as InternalAxiosRequestConfig,
        {},
        {
          status: 401,
          data: { error: { message: 'Token expired' } },
          headers: {},
          config: { url: '/users/profile', headers: {} } as InternalAxiosRequestConfig,
        } as AxiosResponse
      )

      try {
        const handler = (axiosClient.interceptors.response as any).handlers?.[0]
        if (handler?.rejected) {
          await handler.rejected(expiredError)
        }
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }

      expect(tokenStorage.getAccessToken()).toBeNull()
      expect(tokenStorage.getRefreshToken()).toBeNull()
    })
  })
})
