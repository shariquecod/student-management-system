import type { AttendanceRecord, AttendanceSummary, ExamResult, Student, StudentFeeSummary } from '@/types'

export interface StudentProfileData {
  student: Student
  attendance: AttendanceRecord[]
  attendanceSummary: AttendanceSummary | null
  feeSummary: StudentFeeSummary | null
  examResults: ExamResult[]
}

export type StudentDetailTab = 'overview' | 'academic' | 'attendance' | 'exams' | 'fees'
