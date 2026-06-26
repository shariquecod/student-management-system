import { NextRequest } from 'next/server'
import { proxyToBackend, getProxyForwardHeaders, getProxyRequestBody } from '@/lib/backend-proxy'

type RouteContext = { params: Promise<{ path: string[] }> }

async function handleProxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const backendPath = `/api/v1/${path.join('/')}${request.nextUrl.search}`

  return proxyToBackend({
    method: request.method,
    path: backendPath,
    body: await getProxyRequestBody(request),
    headers: getProxyForwardHeaders(request),
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context)
}
