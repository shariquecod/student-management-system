import type { TeacherDirectoryFilters } from '@/types/teacher-page'

export const teacherQuickFilters: {
  labelKey: string
  patch: Partial<TeacherDirectoryFilters>
  accent: string
}[] = [
  { labelKey: 'teachers.allTeachers', patch: { status: 'all', department: 'all' }, accent: 'teachers' },
  { labelKey: 'teachers.active', patch: { status: 'active' }, accent: 'classes' },
  { labelKey: 'teachers.inactive', patch: { status: 'inactive' }, accent: 'fees' },
  { labelKey: 'teachers.archived', patch: { status: 'archived' }, accent: 'exams' },
]

export function getTeacherInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0)
  const second = lastName ? lastName.charAt(0) : firstName.charAt(1) || first
  return `${first}${second}`.toUpperCase()
}
