import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import { authService } from '@/features/auth/authService'
import {
  loginThunk,
  logoutThunk,
  initializeAuth,
  changePasswordThunk,
} from '@/features/auth/authSlice'
import { createStore } from '@/app/store'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { tokenStorage } from '@/utils/tokenStorage'
import type { AuthenticatedUser, LoginResponseData } from '@/features/auth/types'

const mockUser: AuthenticatedUser = {
  id: 'usr-123',
  tenantId: 'ten-456',
  email: 'admin@schoolora.edu',
  firstName: 'John',
  lastName: 'Doe',
  status: 'ACTIVE',
  emailVerified: true,
  mustChangePassword: false,
  createdAt: new Date().toISOString(),
}

const mockLoginResponse: LoginResponseData = {
  user: mockUser,
  tokens: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    tokenType: 'Bearer',
    expiresIn: '15m',
  },
  mustChangePassword: false,
}

describe('Authentication State & Route Flows', () => {
  beforeEach(() => {
    tokenStorage.clearTokens()
    vi.restoreAllMocks()
  })

  describe('Redux Login Thunk', () => {
    it('sets user, tokens, and authenticated status on successful login', async () => {
      vi.spyOn(authService, 'login').mockResolvedValueOnce(mockLoginResponse)

      const store = createStore()
      await store.dispatch(
        loginThunk({ email: 'admin@schoolora.edu', password: 'Password@123' })
      )

      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.email).toBe('admin@schoolora.edu')
      expect(state.token).toBe('mock-access-token')
      expect(tokenStorage.getAccessToken()).toBe('mock-access-token')
      expect(state.status).toBe('succeeded')
    })

    it('sets failure state and error message on invalid credentials', async () => {
      vi.spyOn(authService, 'login').mockRejectedValueOnce(
        new Error('Invalid email or password')
      )

      const store = createStore()
      await store.dispatch(
        loginThunk({ email: 'wrong@schoolora.edu', password: 'wrong' })
      )

      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(false)
      expect(state.status).toBe('failed')
      expect(state.error).toBe('Invalid email or password')
      expect(tokenStorage.getAccessToken()).toBeNull()
    })
  })

  describe('Redux Logout Thunk', () => {
    it('clears state, user profile, and cached tokens on logout', async () => {
      tokenStorage.setTokens({
        accessToken: 'valid-token',
        refreshToken: 'valid-refresh',
      })
      vi.spyOn(authService, 'logout').mockResolvedValueOnce({
        message: 'Successfully logged out',
      })

      const store = createStore({
        auth: {
          user: mockUser,
          token: 'valid-token',
          refreshToken: 'valid-refresh',
          isAuthenticated: true,
          isInitialized: true,
          mustChangePassword: false,
          status: 'idle',
          error: null,
        },
      })

      await store.dispatch(logoutThunk())

      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(tokenStorage.getAccessToken()).toBeNull()
      expect(tokenStorage.getRefreshToken()).toBeNull()
    })
  })

  describe('Authentication Initialization', () => {
    it('restores authenticated user session when valid tokens exist', async () => {
      tokenStorage.setTokens({
        accessToken: 'valid-token',
        refreshToken: 'valid-refresh',
      })
      vi.spyOn(authService, 'getMe').mockResolvedValueOnce({
        user: mockUser,
        session: { id: 'sess-1' },
      })

      const store = createStore()
      await store.dispatch(initializeAuth())

      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(true)
      expect(state.isInitialized).toBe(true)
      expect(state.user?.email).toBe('admin@schoolora.edu')
    })

    it('clears tokens and marks unauthenticated if session verification fails', async () => {
      tokenStorage.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'invalid-refresh',
      })
      vi.spyOn(authService, 'getMe').mockRejectedValueOnce(new Error('Session expired'))

      const store = createStore()
      await store.dispatch(initializeAuth())

      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(false)
      expect(state.isInitialized).toBe(true)
      expect(tokenStorage.getAccessToken()).toBeNull()
    })
  })

  describe('Forced Password Change Flow', () => {
    it('records mustChangePassword requirement and clears it upon changePassword success', async () => {
      const userMustChange = { ...mockUser, mustChangePassword: true }
      const responseWithMustChange = {
        ...mockLoginResponse,
        user: userMustChange,
        mustChangePassword: true,
      }

      vi.spyOn(authService, 'login').mockResolvedValueOnce(responseWithMustChange)
      vi.spyOn(authService, 'changePassword').mockResolvedValueOnce({
        message: 'Password updated successfully',
      })

      const store = createStore()
      await store.dispatch(
        loginThunk({ email: 'admin@schoolora.edu', password: 'TempPassword@123' })
      )

      expect(store.getState().auth.mustChangePassword).toBe(true)

      await store.dispatch(
        changePasswordThunk({
          currentPassword: 'TempPassword@123',
          newPassword: 'NewSecurePassword@999',
        })
      )

      expect(store.getState().auth.mustChangePassword).toBe(false)
      expect(store.getState().auth.user?.mustChangePassword).toBe(false)
    })
  })

  describe('Protected Route Navigation Guard', () => {
    it('renders child content when user is authenticated and initialized', () => {
      renderWithProviders(<ProtectedRoute />, {
        preloadedState: {
          auth: {
            user: mockUser,
            token: 'valid-token',
            refreshToken: 'valid-refresh',
            isAuthenticated: true,
            isInitialized: true,
            mustChangePassword: false,
            status: 'idle',
            error: null,
          },
        },
      })

      // When authenticated, Outlet renders (no redirect or loading)
      expect(screen.queryByText(/verifying session/i)).not.toBeInTheDocument()
    })

    it('displays loading screen while authentication is initializing', async () => {
      renderWithProviders(<ProtectedRoute />, {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isInitialized: false,
            mustChangePassword: false,
            status: 'loading',
            error: null,
          },
        },
      })

      await waitFor(() => {
        expect(screen.getByText(/verifying session/i)).toBeInTheDocument()
      })
    })
  })
})
