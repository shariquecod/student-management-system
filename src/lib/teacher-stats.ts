import type { Teacher } from '@/types'
import type { TeacherPageStats } from '@/types/teacher-page'

export function computeTeacherPageStats(teachers: Teacher[]): TeacherPageStats {
  let active = 0
  let inactive = 0
  let archived = 0

  for (const teacher of teachers) {
    if (teacher.status === 'active') active++
    else if (teacher.status === 'inactive') inactive++
    else archived++
  }

  return {
    total: teachers.length,
    active,
    inactive,
    archived,
  }
}
