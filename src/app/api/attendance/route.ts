import { NextRequest, NextResponse } from 'next/server'
import { getAttendance, saveAttendance, getAttendanceSummary } from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  if (sp.get('summary') === 'true') {
    const data = getAttendanceSummary({
      studentId: sp.get('studentId') ?? undefined,
      classId: sp.get('classId') ?? undefined,
      from: sp.get('from') ?? undefined,
      to: sp.get('to') ?? undefined,
    })
    return NextResponse.json({ data })
  }
  const data = getAttendance({
    date: sp.get('date') ?? undefined,
    classId: sp.get('classId') ?? undefined,
    studentId: sp.get('studentId') ?? undefined,
    from: sp.get('from') ?? undefined,
    to: sp.get('to') ?? undefined,
  })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const data = saveAttendance(body)
  return NextResponse.json({ data }, { status: 201 })
}
