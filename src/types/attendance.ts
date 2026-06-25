export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface AttendanceRecord {
  id: string
  date: string
  classId: string
  className: string
  studentId: string
  studentName: string
  rollNumber: string
  status: AttendanceStatus
  recordedAt: string
}

export interface AttendanceBulkInput {
  date: string
  classId: string
  records: { studentId: string; status: AttendanceStatus }[]
}

export interface AttendanceSummary {
  studentId: string
  studentName: string
  rollNumber: string
  present: number
  absent: number
  late: number
  total: number
}
