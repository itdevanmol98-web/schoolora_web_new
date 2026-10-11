import { axiosClient } from '@/api/axiosClient'
import type {
  LoginCredentials,
  LoginResponseData,
  AuthTokens,
  AuthenticatedUser,
  ChangePasswordPayload,
  ResetPasswordPayload,
  OtpRequestPayload,
  OtpVerifyPayload,
  AuthSessionItem,
  LoginHistoryItem,
} from './types'

export class AuthService {
  /**
   * Authenticates user with email, password, and optional tenantCode.
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const response = await axiosClient.post<{ data: LoginResponseData }>(
      '/auth/login',
      credentials
    )
    return response.data.data
  }

  /**
   * Logs out the user and invalidates current session on the backend.
   */
  public async logout(refreshToken?: string | null): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/logout',
      { refreshToken: refreshToken || undefined }
    )
    return response.data.data
  }

  /**
   * Refreshes access token with rotation using a valid refresh token.
   */
  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await axiosClient.post<{ data: AuthTokens }>('/auth/refresh', {
      refreshToken,
    })
    return response.data.data
  }

  /**
   * Retrieves profile and session details for current authenticated user.
   */
  public async getMe(): Promise<{ user: AuthenticatedUser; session: { id: string } }> {
    const response = await axiosClient.get<{
      data: { user: AuthenticatedUser; session: { id: string } }
    }>('/auth/me')
    return response.data.data
  }

  /**
   * Dispatches a password reset request email link.
   */
  public async forgotPassword(
    email: string,
    tenantCode?: string
  ): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/forgot-password',
      { email, tenantCode }
    )
    return response.data.data
  }

  /**
   * Resets password using single-use reset token and new complex password.
   */
  public async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/reset-password',
      payload
    )
    return response.data.data
  }

  /**
   * Changes authenticated user's password.
   */
  public async changePassword(
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/change-password',
      payload
    )
    return response.data.data
  }

  /**
   * Verifies email using verification token.
   */
  public async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/verify-email',
      { token }
    )
    return response.data.data
  }

  /**
   * Resends email verification link.
   */
  public async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await axiosClient.post<{ data: { message: string } }>(
      '/auth/resend-verification-email',
      { email }
    )
    return response.data.data
  }

  /**
   * Requests an OTP code for specified purpose.
   */
  public async requestOtp(
    payload: OtpRequestPayload
  ): Promise<{ identifier: string; purpose: string; expiresInSeconds: number; message: string }> {
    const response = await axiosClient.post<{
      data: {
        identifier: string
        purpose: string
        expiresInSeconds: number
        message: string
      }
    }>('/auth/otp/request', payload)
    return response.data.data
  }

  /**
   * Verifies an OTP code.
   */
  public async verifyOtp(
    payload: OtpVerifyPayload
  ): Promise<{ verified: boolean; message: string }> {
    const response = await axiosClient.post<{
      data: { verified: boolean; message: string }
    }>('/auth/otp/verify', payload)
    return response.data.data
  }

  /**
   * Retrieves list of active sessions for the authenticated user.
   */
  public async getSessions(): Promise<AuthSessionItem[]> {
    const response = await axiosClient.get<{ data: AuthSessionItem[] }>('/auth/sessions')
    return response.data.data
  }

  /**
   * Revokes a specific session by ID.
   */
  public async revokeSession(sessionId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ data: { message: string } }>(
      `/auth/sessions/${sessionId}`
    )
    return response.data.data
  }

  /**
   * Revokes all active user sessions (optionally preserving current).
   */
  public async revokeAllSessions(
    preserveCurrentSession = true
  ): Promise<{ message: string; revokedCount: number }> {
    const response = await axiosClient.post<{
      data: { message: string; revokedCount: number }
    }>('/auth/sessions/revoke-all', { preserveCurrentSession })
    return response.data.data
  }

  /**
   * Retrieves user login history with pagination.
   */
  public async getLoginHistory(
    limit = 20,
    offset = 0
  ): Promise<LoginHistoryItem[]> {
    const response = await axiosClient.get<{ data: LoginHistoryItem[] }>(
      `/auth/login-history?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  }
}

export const authService = new AuthService()
export default authService
