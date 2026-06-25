import { NextRequest, NextResponse } from 'next/server'
import {
  getSchoolProfile,
  updateSchoolProfile,
  getAcademicConfig,
  updateAcademicConfig,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
} from '@/lib/mock-store'

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section')
  if (section === 'academic') return NextResponse.json({ data: getAcademicConfig() })
  if (section === 'users') return NextResponse.json({ data: getAdminUsers() })
  return NextResponse.json({ data: getSchoolProfile() })
}

export async function PUT(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section')
  const body = await request.json()
  if (section === 'academic') return NextResponse.json({ data: updateAcademicConfig(body) })
  if (section === 'users' && body.id) {
    const user = updateAdminUser(body.id, body)
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: user })
  }
  return NextResponse.json({ data: updateSchoolProfile(body) })
}

export async function POST(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section')
  if (section === 'users') {
    const body = await request.json()
    const user = createAdminUser(body)
    return NextResponse.json({ data: user }, { status: 201 })
  }
  return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
}
