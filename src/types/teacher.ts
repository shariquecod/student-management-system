export type TeacherStatus = 'active' | 'inactive' | 'archived'

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  email: string
  phone: string
  department: string
  subjects: string[]
  assignedClassIds: string[]
  joiningDate: string
  status: TeacherStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type TeacherCreateInput = Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>
export type TeacherUpdateInput = Partial<TeacherCreateInput>
