import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { env } from '@/config/env'
import { handleAxiosError } from './apiErrors'
import { tokenStorage, ACCESS_TOKEN_KEY } from '@/utils/tokenStorage'

export const AUTH_TOKEN_KEY = ACCESS_TOKEN_KEY

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * Centrally configured Axios client instance for Schoolora ERP.
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request Interceptor: inject Bearer auth token if present
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = tokenStorage.getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      const tenantId = tokenStorage.getTenantId()
      if (tenantId && config.headers && !config.headers['x-tenant-id']) {
        config.headers['x-tenant-id'] = tenantId
      }
      const schoolId = tokenStorage.getSchoolId()
      if (schoolId && config.headers && !config.headers['x-school-id']) {
        config.headers['x-school-id'] = schoolId
      }
    } catch {
      // Ignore token access failures in restricted environments
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(handleAxiosError(error))
  }
)

// Response Interceptor: handle responses and refresh token on 401
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(handleAxiosError(error))
    }

    const originalRequest = error.config as CustomAxiosRequestConfig | undefined
    const status = error.response?.status
    const url = originalRequest?.url || ''

    // Never attempt to refresh the refresh/login/logout endpoints to avoid infinite loops
    const isAuthBypassUrl =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthBypassUrl) {
      const currentRefreshToken = tokenStorage.getRefreshToken()

      if (!currentRefreshToken) {
        tokenStorage.clearTokens()
        return Promise.reject(handleAxiosError(error))
      }

      if (isRefreshing) {
        // Enqueue concurrent request while refresh is in progress
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return axiosClient(originalRequest)
          })
          .catch((err) => Promise.reject(handleAxiosError(err)))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Direct call to refresh endpoint using raw axios to avoid interceptor recursion
        const refreshResponse = await axios.post<{
          data: { accessToken: string; refreshToken?: string }
        }>(`${env.apiBaseUrl}/auth/refresh`, {
          refreshToken: currentRefreshToken,
        })

        const newTokens = refreshResponse.data.data
        tokenStorage.setTokens({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken ?? currentRefreshToken,
        })

        processQueue(null, newTokens.accessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
        }

        return axiosClient(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        tokenStorage.clearTokens()
        return Promise.reject(handleAxiosError(refreshErr))
      } finally {
        isRefreshing = false
      }
    }

    if (status === 401 && originalRequest?._retry) {
      tokenStorage.clearTokens()
    }

    return Promise.reject(handleAxiosError(error))
  }
)

export default axiosClient
