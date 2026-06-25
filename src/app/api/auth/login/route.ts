import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/mock-store'
import { createAuthToken } from '@/lib/auth-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    const user = authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    const token = createAuthToken(user.id)
    const response = NextResponse.json({
      data: { token, user, expiresAt: new Date(Date.now() + 86400000).toISOString() },
    })
    response.cookies.set('authToken', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
