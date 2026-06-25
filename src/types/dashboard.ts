export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  feesCollectedThisMonth: number
  attendanceRateToday: number
}

export interface EnrollmentTrend {
  month: string
  count: number
}

export type ActivityType =
  | 'student_added'
  | 'attendance_updated'
  | 'exam_results'
  | 'payment_received'
  | 'teacher_added'

export interface RecentActivity {
  id: string
  type: ActivityType
  message: string
  timestamp: string
}

export interface DashboardData {
  stats: DashboardStats
  enrollmentTrend: EnrollmentTrend[]
  recentActivities: RecentActivity[]
}
