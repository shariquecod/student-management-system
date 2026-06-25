import { NextRequest, NextResponse } from 'next/server'
import { getExamResults, saveExamResults } from '@/lib/mock-store'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const classId = request.nextUrl.searchParams.get('classId') ?? undefined
  return NextResponse.json({ data: getExamResults(id, classId) })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const data = saveExamResults(id, body.classId, body.results)
  return NextResponse.json({ data })
}
