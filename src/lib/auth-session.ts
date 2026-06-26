import type { AdminUser, AuthTokenData } from '@/types'

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return
  document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'authToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
}

export function mapAuthUserToAdminUser(data: AuthTokenData): AdminUser {
  return {
    id: data.email,
    name: data.fullName,
    email: data.email,
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
}

export function persistAuthSession(data: AuthTokenData, rememberMe?: boolean) {
  if (typeof window === 'undefined') return

  const user = mapAuthUserToAdminUser(data)

  localStorage.setItem('token', data.accessToken)
  localStorage.setItem('authToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  localStorage.setItem('user', JSON.stringify(user))

  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true')
  } else {
    localStorage.removeItem('rememberMe')
  }

  setAuthCookie(data.accessToken)
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return

  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')
  clearAuthCookie()
}

export function readStoredAuthSession(): { token: string; user: AdminUser } | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const userRaw = localStorage.getItem('user')

  if (!token || !userRaw) return null

  try {
    const user = JSON.parse(userRaw) as AdminUser
    setAuthCookie(token)
    return { token, user }
  } catch {
    clearAuthSession()
    return null
  }
}
