export type UserRole = 'super_admin' | 'staff'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
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
