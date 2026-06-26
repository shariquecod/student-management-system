import type { StudentDirectoryFilters } from '@/types/student-page'
import type { SchoolClass } from '@/types'

export const studentQuickFilters: {
  labelKey: string
  patch: Partial<StudentDirectoryFilters>
  accent: string
}[] = [
  { labelKey: 'students.allStudents', patch: { status: 'all', classId: 'all' }, accent: 'students' },
  { labelKey: 'students.active', patch: { status: 'active' }, accent: 'classes' },
  { labelKey: 'students.graduated', patch: { status: 'graduated' }, accent: 'exams' },
  { labelKey: 'students.inactive', patch: { status: 'inactive' }, accent: 'fees' },
]

export const studentTableColumns = [
  { key: 'name', labelKey: 'common.student', sortable: true },
  { key: 'rollNumber', labelKey: 'common.rollNo', sortable: true },
  { key: 'className', labelKey: 'common.class', sortable: true },
  { key: 'contact', labelKey: 'common.contact', sortable: false },
  { key: 'guardian', labelKey: 'common.guardian', sortable: false },
  { key: 'status', labelKey: 'common.status', sortable: true },
] as const

export function getStudentInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0)
  const second = lastName ? lastName.charAt(0) : firstName.charAt(1) || first
  return `${first}${second}`.toUpperCase()
}

export function formatStudentClassLabel(classes: (SchoolClass & { studentCount?: number })[]) {
  return classes.map((c) => ({
    id: c.id,
    label: c.name,
    count: c.studentCount ?? 0,
  }))
}
