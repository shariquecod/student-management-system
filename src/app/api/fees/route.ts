import { NextRequest, NextResponse } from 'next/server'
import { getFeeCategories, createFeeCategory, getFeeStructures } from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')
  if (type === 'structures') {
    return NextResponse.json({ data: getFeeStructures() })
  }
  return NextResponse.json({ data: getFeeCategories() })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const category = createFeeCategory(body)
  return NextResponse.json({ data: category }, { status: 201 })
}
