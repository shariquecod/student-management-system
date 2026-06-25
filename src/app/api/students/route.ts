import { NextRequest, NextResponse } from 'next/server'
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const id = sp.get('id')
  if (id) {
    const student = getStudentById(id)
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: student })
  }
  const result = getStudents({
    search: sp.get('search') ?? undefined,
    classId: sp.get('classId') ?? undefined,
    status: sp.get('status') ?? undefined,
    year: sp.get('year') ? Number(sp.get('year')) : undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    limit: sp.get('limit') ? Number(sp.get('limit')) : 10,
  })
  return NextResponse.json({
    data: result.data,
    meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const student = createStudent(body)
    return NextResponse.json({ data: student }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 400 })
  }
}
