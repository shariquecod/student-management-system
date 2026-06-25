import { NextRequest, NextResponse } from 'next/server'
import { getClasses, createClass } from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const result = getClasses({
    search: sp.get('search') ?? undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    limit: sp.get('limit') ? Number(sp.get('limit')) : 20,
  })
  return NextResponse.json({
    data: result.data,
    meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const cls = createClass(body)
  return NextResponse.json({ data: cls }, { status: 201 })
}
