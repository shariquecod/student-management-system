import { NextResponse } from 'next/server'

/** Read at request time so Next.js does not inline an empty build-time value. */
export function getBackendBaseUrl(): string {
  const url =
    process.env['NEXT_PUBLIC_API_BASE_URL'] ??
    process.env['API_BASE_URL'] ??
    ''

  return url.trim().replace(/\/$/, '')
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
          'Backend API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local and restart the dev server.',
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${backendBaseUrl}${path}`, {
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
