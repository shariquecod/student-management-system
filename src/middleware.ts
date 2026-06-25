import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/students',
  '/teachers',
  '/classes',
  '/attendance',
  '/exams',
  '/fees',
  '/settings',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
  const token = request.cookies.get('authToken')?.value

  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/students/:path*',
    '/teachers/:path*',
    '/classes/:path*',
    '/attendance/:path*',
    '/exams/:path*',
    '/fees/:path*',
    '/settings/:path*',
  ],
}
