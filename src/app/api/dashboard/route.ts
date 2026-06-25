import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/mock-store'

export async function GET() {
  return NextResponse.json({ data: getDashboardData() })
}
