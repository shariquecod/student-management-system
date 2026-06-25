import type { Teacher, TeacherUpdateInput } from '@/types'

export interface TeacherDraft {
  firstName: string
  lastName: string
  employeeId: string
  email: string
  phone: string
  department: string
  subjects: string
  joiningDate: string
  status: Teacher['status']
  notes: string
}

export function teacherToDraft(teacher: Teacher): TeacherDraft {
  return {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    employeeId: teacher.employeeId,
    email: teacher.email,
    phone: teacher.phone,
    department: teacher.department,
    subjects: teacher.subjects.join(', '),
    joiningDate: teacher.joiningDate,
    status: teacher.status,
    notes: teacher.notes ?? '',
  }
}

export function draftToUpdatePayload(draft: TeacherDraft): TeacherUpdateInput {
  return {
    firstName: draft.firstName,
    lastName: draft.lastName,
    employeeId: draft.employeeId,
    email: draft.email,
    phone: draft.phone,
    department: draft.department,
    subjects: draft.subjects.split(',').map((s) => s.trim()).filter(Boolean),
    joiningDate: draft.joiningDate,
    status: draft.status,
    notes: draft.notes || undefined,
  }
}

export function getTeacherInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0)
  const second = lastName ? lastName.charAt(0) : firstName.charAt(1) || first
  return `${first}${second}`.toUpperCase()
}

export function getTeacherDisplayName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim()
}
