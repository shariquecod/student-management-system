import { NextRequest, NextResponse } from 'next/server'
import { endpoints } from '@/services/api'
import { proxyToBackend, setAuthCookie } from '@/lib/backend-proxy'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const backendResponse = await proxyToBackend({
    method: 'POST',
    path: endpoints.auth.refresh,
    body,
  })

  const data = await backendResponse.json()
  const response = NextResponse.json(data, { status: backendResponse.status })

  if (backendResponse.ok && data?.success && data?.data?.accessToken) {
    setAuthCookie(response, data.data.accessToken)
  }

  return response
}
