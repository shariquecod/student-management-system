export type UserRole = 'super_admin' | 'staff'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface AuthTokenData {
  accessToken: string
  refreshToken: string
  email: string
  fullName: string
  tokenType: string
}

export interface AuthApiResponse {
  timestamp?: string
  status?: number
  message?: string
  data?: AuthTokenData
  success: boolean
  error?: string
}

export interface AuthSession {
  token: string
  user: AdminUser
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  fullName: string
  email: string
  password: string
}
