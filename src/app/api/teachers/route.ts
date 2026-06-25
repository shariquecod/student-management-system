import { NextRequest, NextResponse } from 'next/server'
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const result = getTeachers({
    search: sp.get('search') ?? undefined,
    department: sp.get('department') ?? undefined,
    status: sp.get('status') ?? undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    limit: sp.get('limit') ? Number(sp.get('limit')) : 10,
  })
  return NextResponse.json({
    data: result.data,
    meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const teacher = createTeacher(body)
  return NextResponse.json({ data: teacher }, { status: 201 })
}
