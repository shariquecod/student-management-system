import type { SchoolClass } from '@/types'

type ClassWithCount = SchoolClass & { studentCount?: number }

export function computeClassPageStats(classes: ClassWithCount[]) {
  const totalStudents = classes.reduce(
    (sum, cls) => sum + (cls.studentCount ?? cls.studentIds.length),
    0
  )

  return {
    total: classes.length,
    totalStudents,
    avgSize: classes.length ? Math.round(totalStudents / classes.length) : 0,
    withHomeroom: classes.filter((cls) => cls.homeroomTeacherId).length,
  }
}
