import type { Student, StudentStatus, StudentUpdateInput } from '@/types'

export interface StudentDraft {
  firstName: string
  lastName: string
  rollNumber: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  classId: string
  year: number
  status: StudentStatus
  guardianName: string
  guardianPhone: string
  guardianRelation: string
  notes: string
}

export function studentToDraft(student: Student): StudentDraft {
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    rollNumber: student.rollNumber,
    email: student.email,
    phone: student.phone,
    address: student.address,
    dateOfBirth: student.dateOfBirth,
    classId: student.classId,
    year: student.year,
    status: student.status,
    guardianName: student.guardian.name,
    guardianPhone: student.guardian.phone,
    guardianRelation: student.guardian.relation,
    notes: student.notes ?? '',
  }
}

export function draftToUpdatePayload(draft: StudentDraft): StudentUpdateInput {
  return {
    firstName: draft.firstName,
    lastName: draft.lastName,
    rollNumber: draft.rollNumber,
    email: draft.email,
    phone: draft.phone,
    address: draft.address,
    dateOfBirth: draft.dateOfBirth,
    classId: draft.classId,
    year: draft.year,
    status: draft.status,
    guardian: {
      name: draft.guardianName,
      phone: draft.guardianPhone,
      relation: draft.guardianRelation,
    },
    notes: draft.notes,
  }
}

export function getDraftDisplayName(draft: StudentDraft) {
  return `${draft.firstName} ${draft.lastName}`.trim() || 'Student'
}
