import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/mock-store'
import { parseUserIdFromToken } from '@/lib/auth-token'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = parseUserIdFromToken(token)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = getUserById(userId)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ data: user })
}
