import { NextRequest, NextResponse } from 'next/server'
import { getTeacherById, updateTeacher, deleteTeacher } from '@/lib/mock-store'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const teacher = getTeacherById(id)
  if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: teacher })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const teacher = updateTeacher(id, body)
  if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: teacher })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ok = deleteTeacher(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: { success: true } })
}
