import type { Student } from '@/types'
import type { StudentPageStats } from '@/types/student-page'

export function computeStudentPageStats(students: Student[]): StudentPageStats {
  let active = 0
  let inactive = 0
  let graduated = 0

  for (const student of students) {
    if (student.status === 'active') active++
    else if (student.status === 'inactive') inactive++
    else graduated++
  }

  return {
    total: students.length,
    active,
    inactive,
    graduated,
  }
}
