import { describe, it, expect } from 'vitest'
import { axiosClient, AUTH_TOKEN_KEY } from '@/api/axiosClient'
import { env } from '@/config/env'

describe('Axios Client Configuration', () => {
  it('configures the base URL from env', () => {
    expect(axiosClient.defaults.baseURL).toBe(env.apiBaseUrl)
  })

  it('configures default 15s timeout', () => {
    expect(axiosClient.defaults.timeout).toBe(15000)
  })

  it('sets application/json content-type and accept headers', () => {
    const headers = axiosClient.defaults.headers
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Accept']).toBe('application/json')
  })

  it('exports correct auth token key constant', () => {
    expect(AUTH_TOKEN_KEY).toBe('schoolora_access_token')
  })
})
