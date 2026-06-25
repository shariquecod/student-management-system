import { NextRequest, NextResponse } from 'next/server'
import { getStudentFeeSummaries, createPayment } from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const overdueOnly = request.nextUrl.searchParams.get('overdueOnly') === 'true'
  return NextResponse.json({ data: getStudentFeeSummaries({ overdueOnly }) })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const payment = createPayment(body)
  return NextResponse.json({ data: payment }, { status: 201 })
}
