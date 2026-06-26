import { loadEnvConfig } from '@next/env'
import { NextRequest, NextResponse } from 'next/server'

/** Browser calls use same-origin `/api/v1/*` — never the external backend URL directly. */
export { SAME_ORIGIN_API_BASE } from '@/lib/api-config'

let envLoaded = false

function ensureEnvLoaded() {
  if (envLoaded) return
  loadEnvConfig(process.cwd())
  envLoaded = true
}

/** Read at request time — do not bake into next.config `env` (that can lock empty values). */
export function getBackendBaseUrl(): string {
  ensureEnvLoaded()

  const url =
    process.env.API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    ''

  return url.replace(/\/$/, '')
}

export function getProxyForwardHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {}
  const authorization = request.headers.get('authorization')

  if (authorization) {
    headers.Authorization = authorization
    return headers
  }

  const cookieToken = request.cookies.get('authToken')?.value
  if (cookieToken) {
    headers.Authorization = `Bearer ${cookieToken}`
  }

  return headers
}

export async function getProxyRequestBody(request: NextRequest): Promise<unknown> {
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'DELETE') {
    return undefined
  }

  try {
    return await request.json()
  } catch {
    return undefined
  }
}

interface ProxyOptions {
  method: string
  path: string
  body?: unknown
  headers?: Record<string, string>
}

export async function proxyToBackend({ method, path, body, headers = {} }: ProxyOptions) {
  const backendBaseUrl = getBackendBaseUrl()

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        success: false,
        message:
          'Backend API URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL in .env.local and restart the dev server.',
      },
      { status: 500 }
    )
  }

  const targetUrl = `${backendBaseUrl}${path.startsWith('/') ? path : `/${path}`}`

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid response from backend',
    }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to reach backend service' },
      { status: 502 }
    )
  }
}

export function setAuthCookie(response: NextResponse, accessToken: string) {
  response.cookies.set('authToken', accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
}
