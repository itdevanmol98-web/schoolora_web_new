export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'

export type OtpPurpose =
  | 'LOGIN'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFICATION'
  | 'TWO_FACTOR_AUTH'
  | 'TRANSACTION_VERIFICATION'

export type LoginStatus = 'SUCCESS' | 'FAILED' | 'BLOCKED'

export interface AuthenticatedUser {
  id: string
  tenantId: string
  schoolId?: string | null
  branchId?: string | null
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  status: UserStatus
  emailVerified: boolean
  mustChangePassword: boolean
  lastLoginAt?: string | null
  createdAt: string
}

// Backwards compatibility alias
export type UserProfile = AuthenticatedUser

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: string
}

export interface LoginResponseData {
  user: AuthenticatedUser
  tokens: AuthTokens
  session?: {
    id: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceInfo?: string | null
    createdAt: string
  }
  mustChangePassword: boolean
}

export interface AuthState {
  user: AuthenticatedUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  mustChangePassword: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  tenantCode?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface OtpRequestPayload {
  identifier: string
  purpose: OtpPurpose
  tenantCode?: string
}

export interface OtpVerifyPayload {
  identifier: string
  purpose: OtpPurpose
  code: string
}

export interface AuthSessionItem {
  id: string
  deviceInfo?: string | null
  ipAddress?: string | null
  isCurrent: boolean
  isCurrentSession?: boolean
  isRevoked: boolean
  createdAt: string
  expiresAt: string
}

export interface LoginHistoryItem {
  id: string
  status: LoginStatus
  failureReason?: string | null
  ipAddress?: string | null
  deviceInfo?: string | null
  createdAt: string
}
