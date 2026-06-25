import { z } from 'zod'
import type { TeacherCreateInput } from '@/types'

export const teacherFormSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  employeeId: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  subjects: z.string().min(1, 'Required'),
  joiningDate: z.string().min(1, 'Required'),
  status: z.enum(['active', 'inactive', 'archived']),
  notes: z.string().optional(),
})

export type TeacherFormValues = z.infer<typeof teacherFormSchema>

export function getTeacherFormDefaults(): TeacherFormValues {
  return {
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    subjects: '',
    joiningDate: '',
    status: 'active',
    notes: '',
  }
}

export function teacherFormValuesToPayload(values: TeacherFormValues): TeacherCreateInput {
  return {
    ...values,
    subjects: values.subjects.split(',').map((s) => s.trim()).filter(Boolean),
    assignedClassIds: [],
  }
}
