export type StudentStatus = 'active' | 'inactive' | 'graduated'

export interface GuardianInfo {
  name: string
  phone: string
  email?: string
  relation: string
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  firstNameUr?: string
  lastNameUr?: string
  rollNumber: string
  email: string
  phone: string
  classId: string
  className: string
  year: number
  status: StudentStatus
  dateOfBirth: string
  address: string
  guardian: GuardianInfo
  notes?: string
  createdAt: string
  updatedAt: string
}

export type StudentCreateInput = Omit<Student, 'id' | 'className' | 'createdAt' | 'updatedAt'>
export type StudentUpdateInput = Partial<StudentCreateInput>
