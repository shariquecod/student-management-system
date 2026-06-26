import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AdminUser } from '@/types'
import { authService } from '@/services/auth-services'
import {
  clearAuthSession,
  mapAuthUserToAdminUser,
  persistAuthSession,
  readStoredAuthSession,
} from '@/lib/auth-session'

interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function resolveAuthError(response: { message?: string; error?: string } | null | undefined, fallback: string) {
  return response?.message ?? response?.error ?? fallback
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password)

      if (!response?.success || !response.data?.accessToken) {
        return rejectWithValue(resolveAuthError(response, 'Login failed'))
      }

      persistAuthSession(response.data, rememberMe)

      return {
        token: response.data.accessToken,
        user: mapAuthUserToAdminUser(response.data),
      }
    } catch {
      return rejectWithValue('An unexpected error occurred')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    { fullName, email, password }: { fullName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(fullName, email, password)

      if (!response?.success || !response.data?.accessToken) {
        return rejectWithValue(resolveAuthError(response, 'Registration failed'))
      }

      persistAuthSession(response.data, true)

      return {
        token: response.data.accessToken,
        user: mapAuthUserToAdminUser(response.data),
      }
    } catch {
      return rejectWithValue('An unexpected error occurred')
    }
  }
)

export const initAuth = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  try {
    const session = readStoredAuthSession()
    return session
  } catch {
    clearAuthSession()
    return rejectWithValue('Failed to restore session')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(initAuth.pending, (state) => {
        if (!state.isAuthenticated) {
          state.isLoading = true
        }
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.isAuthenticated = true
          state.token = action.payload.token
          state.user = action.payload.user
        } else {
          state.isAuthenticated = false
          state.token = null
          state.user = null
        }
      })
      .addCase(initAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
