import { apiClient } from '@/hooks/use-api'
import { SAME_ORIGIN_API_BASE } from '@/lib/api-config'
import { clearAuthSession } from '@/lib/auth-session'
import type { AuthApiResponse } from '@/types'

/** Same-origin Next.js proxy routes — avoids browser CORS to external API */
const authProxyRoutes = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',
} as const

export const authService = {
  login: async (email: string, password: string): Promise<AuthApiResponse> => {
    const response = await apiClient.post(
      authProxyRoutes.login,
      { email, password },
      undefined,
      SAME_ORIGIN_API_BASE,
      true
    )
    return response as AuthApiResponse
  },

  register: async (
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthApiResponse> => {
    const response = await apiClient.post(
      authProxyRoutes.register,
      { fullName, email, password },
      undefined,
      SAME_ORIGIN_API_BASE,
      true
    )
    return response as AuthApiResponse
  },

  refreshToken: async (): Promise<{ success: boolean; token?: string; message?: string }> => {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Refresh unavailable' }
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return { success: false, message: 'No refresh token' }
    }

    const response = (await apiClient.post(
      authProxyRoutes.refresh,
      { refreshToken },
      undefined,
      SAME_ORIGIN_API_BASE,
      true
    )) as AuthApiResponse

    if (response?.success && response.data?.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('authToken', response.data.accessToken)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
      document.cookie = `authToken=${encodeURIComponent(response.data.accessToken)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      return { success: true, token: response.data.accessToken }
    }

    return { success: false, message: response?.message ?? 'Token refresh failed' }
  },

  logout: async () => {
    try {
      await fetch(authProxyRoutes.logout, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Continue clearing local session even if the request fails
    }

    clearAuthSession()
    return { success: true }
  },
}
