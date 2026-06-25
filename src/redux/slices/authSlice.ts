import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { AdminUser } from '@/types'

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

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })
      const json = await res.json()
      if (!res.ok) return rejectWithValue(json.error ?? 'Login failed')
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', json.data.token)
        localStorage.setItem('user', JSON.stringify(json.data.user))
        if (rememberMe) localStorage.setItem('rememberMe', 'true')
      }
      return json.data as { token: string; user: AdminUser }
    } catch {
      return rejectWithValue('An unexpected error occurred')
    }
  }
)

export const initAuth = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  try {
    if (typeof window === 'undefined') return null

    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (res.ok) {
      const json = await res.json()
      const user = json.data as AdminUser
      const token = localStorage.getItem('authToken') ?? 'session'
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      return { token, user }
    }

    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    return null
  } catch {
    return rejectWithValue('Failed to restore session')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await fetch('/api/auth/logout', { method: 'POST' })
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
  }
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
        state.isLoading = true
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
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
