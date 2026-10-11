import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {
  AuthState,
  AuthenticatedUser,
  LoginCredentials,
  ChangePasswordPayload,
} from './types'
import { authService } from './authService'
import { tokenStorage } from '@/utils/tokenStorage'

const initialState: AuthState = {
  user: null,
  token: tokenStorage.getAccessToken(),
  refreshToken: tokenStorage.getRefreshToken(),
  isAuthenticated: false,
  isInitialized: false,
  mustChangePassword: false,
  status: 'idle',
  error: null,
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const accessToken = tokenStorage.getAccessToken()
    const refreshToken = tokenStorage.getRefreshToken()

    if (!accessToken && !refreshToken) {
      return rejectWithValue('No saved session tokens found')
    }

    try {
      const data = await authService.getMe()
      return data.user
    } catch (err: unknown) {
      tokenStorage.clearTokens()
      return rejectWithValue(
        err instanceof Error ? err.message : 'Session verification failed'
      )
    }
  }
)

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials)
      tokenStorage.setTokens({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      })
      if (data.user?.tenantId) {
        tokenStorage.setTenantId(data.user.tenantId)
      }
      return data
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Invalid credentials'
      )
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const refreshToken = tokenStorage.getRefreshToken()
  try {
    await authService.logout(refreshToken)
  } catch {
    // Gracefully handle backend error so UI local logout always succeeds
  } finally {
    tokenStorage.clearTokens()
    tokenStorage.clearTenantId()
  }
})

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const result = await authService.changePassword(payload)
      return result
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to update password'
      )
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthenticatedUser
        token: string
        refreshToken?: string
        mustChangePassword?: boolean
      }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken ?? null
      state.mustChangePassword = action.payload.mustChangePassword ?? action.payload.user.mustChangePassword ?? false
      state.isAuthenticated = true
      state.isInitialized = true
      state.error = null
    },
    logout: (state) => {
      tokenStorage.clearTokens()
      tokenStorage.clearTenantId()
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isInitialized = true
      state.mustChangePassword = false
      state.status = 'idle'
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload
        if (action.payload?.tenantId) {
          tokenStorage.setTenantId(action.payload.tenantId)
        }
        state.isAuthenticated = true
        state.isInitialized = true
        state.mustChangePassword = action.payload.mustChangePassword
        state.token = tokenStorage.getAccessToken()
        state.refreshToken = tokenStorage.getRefreshToken()
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.isInitialized = true
        state.mustChangePassword = false
        state.status = 'idle'
        state.error = null
      })

    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.tokens.accessToken
        state.refreshToken = action.payload.tokens.refreshToken
        state.isAuthenticated = true
        state.isInitialized = true
        state.mustChangePassword = action.payload.mustChangePassword
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Authentication failed'
      })

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isInitialized = true
      state.mustChangePassword = false
      state.status = 'idle'
      state.error = null
    })

    // Change Password
    builder
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.mustChangePassword = false
        if (state.user) {
          state.user.mustChangePassword = false
        }
      })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions
export default authSlice.reducer
