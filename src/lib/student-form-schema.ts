import { z } from 'zod'
import type { Student, SchoolClass } from '@/types'

const MIN_STUDENT_AGE_YEARS = 4
const MAX_STUDENT_AGE_YEARS = 100

export function getStudentDobMinDate(): Date {
  return new Date(new Date().getFullYear() - MAX_STUDENT_AGE_YEARS, 0, 1)
}

export function getStudentDobMaxDate(): Date {
  const d = new Date()
  d.setFullYear(d.getFullYear() - MIN_STUDENT_AGE_YEARS)
  d.setHours(23, 59, 59, 999)
  return d
}

function parseDobString(value: string): Date | undefined {
  const [y, m, day] = value.split('-').map(Number)
  if (!y || !m || !day) return undefined
  const date = new Date(y, m - 1, day)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const studentFormSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  rollNumber: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Required'),
  classId: z.string().min(1, 'Select a class'),
  year: z.number().min(2000),
  status: z.enum(['active', 'inactive', 'graduated']),
  dateOfBirth: z
    .string()
    .min(1, 'Required')
    .refine((value) => {
      const date = parseDobString(value)
      if (!date) return false
      return date >= getStudentDobMinDate() && date <= getStudentDobMaxDate()
    }, `Student must be at least ${MIN_STUDENT_AGE_YEARS} years old`),
  address: z.string().min(1, 'Required'),
  guardianName: z.string().min(1, 'Required'),
  guardianPhone: z.string().min(1, 'Required'),
  guardianRelation: z.string().min(1, 'Required'),
  notes: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

export function getStudentFormDefaults(
  editing: Student | null,
  classes: (SchoolClass & { studentCount?: number })[]
): StudentFormValues {
  if (editing) {
    return {
      firstName: editing.firstName,
      lastName: editing.lastName,
      rollNumber: editing.rollNumber,
      email: editing.email,
      phone: editing.phone,
      classId: editing.classId,
      year: editing.year,
      status: editing.status,
      dateOfBirth: editing.dateOfBirth,
      address: editing.address,
      guardianName: editing.guardian.name,
      guardianPhone: editing.guardian.phone,
      guardianRelation: editing.guardian.relation,
      notes: editing.notes ?? '',
    }
  }
  return {
    firstName: '',
    lastName: '',
    rollNumber: '',
    email: '',
    phone: '',
    classId: classes[0]?.id ?? '',
    year: 2025,
    status: 'active',
    dateOfBirth: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Parent',
    notes: '',
  }
}

export function studentFormValuesToPayload(values: StudentFormValues) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    rollNumber: values.rollNumber,
    email: values.email,
    phone: values.phone,
    classId: values.classId,
    year: values.year,
    status: values.status,
    dateOfBirth: values.dateOfBirth,
    address: values.address,
    guardian: {
      name: values.guardianName,
      phone: values.guardianPhone,
      relation: values.guardianRelation,
    },
    notes: values.notes,
  }
}
