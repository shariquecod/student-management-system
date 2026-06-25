import { NextRequest, NextResponse } from 'next/server'
import { getExams, createExam } from '@/lib/mock-store'

export async function GET() {
  return NextResponse.json({ data: getExams() })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const exam = createExam(body)
  return NextResponse.json({ data: exam }, { status: 201 })
}
