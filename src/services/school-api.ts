import type {
  AdminUser,
  AttendanceBulkInput,
  AttendanceRecord,
  AttendanceSummary,
  DashboardData,
  Exam,
  ExamCreateInput,
  ExamResult,
  ExamUpdateInput,
  FeeCategory,
  PaginatedResponse,
  Payment,
  SchoolClass,
  SchoolClassCreateInput,
  SchoolProfile,
  AcademicConfig,
  Student,
  StudentCreateInput,
  StudentFeeSummary,
  StudentUpdateInput,
  SubjectMark,
  Teacher,
  TeacherCreateInput,
  TeacherUpdateInput,
  AdminUserCreateInput,
  AdminUserUpdateInput,
  SchoolClassUpdateInput,
} from '@/types'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Request failed')
  return json.data as T
}

// Auth
export const login = (email: string, password: string, rememberMe?: boolean) =>
  apiFetch<{ token: string; user: AdminUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  })

export const logout = () => apiFetch<{ success: boolean }>('/api/auth/logout', { method: 'POST' })

export const getMe = () => apiFetch<AdminUser>('/api/auth/me')

// Dashboard
export const getDashboardStats = () => apiFetch<DashboardData>('/api/dashboard')

// Students
export const getStudents = (params?: Record<string, string | number>) => {
  const qs = new URLSearchParams(
    Object.entries(params ?? {}).map(([k, v]) => [k, String(v)])
  ).toString()
  return apiFetch<PaginatedResponse<Student>['data'] & { meta?: PaginatedResponse<Student>['meta'] }>(
    `/api/students?${qs}`
  ).then(async () => {
    const res = await fetch(`/api/students?${qs}`)
    return res.json()
  })
}

export async function fetchStudents(params?: {
  search?: string
  classId?: string
  status?: string
  year?: number
  page?: number
  limit?: number
}) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.classId) qs.set('classId', params.classId)
  if (params?.status) qs.set('status', params.status)
  if (params?.year) qs.set('year', String(params.year))
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const res = await fetch(`/api/students?${qs}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json as PaginatedResponse<Student>
}

export const getStudent = (id: string) => apiFetch<Student>(`/api/students/${id}`)
export const fetchStudentProfile = (id: string) =>
  apiFetch<import('@/types/student-profile').StudentProfileData>(`/api/students/${id}?profile=true`)
export const createStudent = (data: StudentCreateInput) =>
  apiFetch<Student>('/api/students', { method: 'POST', body: JSON.stringify(data) })
export const updateStudent = (id: string, data: StudentUpdateInput) =>
  apiFetch<Student>(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteStudent = (id: string) =>
  apiFetch<{ success: boolean }>(`/api/students/${id}`, { method: 'DELETE' })

// Teachers
export async function fetchTeachers(params?: {
  search?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.department) qs.set('department', params.department)
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const res = await fetch(`/api/teachers?${qs}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json as PaginatedResponse<Teacher>
}

export const createTeacher = (data: TeacherCreateInput) =>
  apiFetch<Teacher>('/api/teachers', { method: 'POST', body: JSON.stringify(data) })
export const updateTeacher = (id: string, data: TeacherUpdateInput) =>
  apiFetch<Teacher>(`/api/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTeacher = (id: string) =>
  apiFetch<{ success: boolean }>(`/api/teachers/${id}`, { method: 'DELETE' })

// Classes
export async function fetchClasses(params?: { search?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  const res = await fetch(`/api/classes?${qs}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json as PaginatedResponse<SchoolClass & { studentCount: number }>
}

export const getClass = (id: string) =>
  apiFetch<
    SchoolClass & {
      students: Student[]
      subjectTeachers: Teacher[]
    }
  >(`/api/classes/${id}`)

export const createClass = (data: SchoolClassCreateInput) =>
  apiFetch<SchoolClass>('/api/classes', { method: 'POST', body: JSON.stringify(data) })
export const updateClass = (id: string, data: SchoolClassUpdateInput) =>
  apiFetch<SchoolClass>(`/api/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteClass = (id: string) =>
  apiFetch<{ success: boolean }>(`/api/classes/${id}`, { method: 'DELETE' })

// Attendance
export const fetchAttendance = (params?: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString()
  return apiFetch<AttendanceRecord[]>(`/api/attendance?${qs}`)
}
export const fetchAttendanceSummary = (params?: Record<string, string>) => {
  const qs = new URLSearchParams({ ...params, summary: 'true' }).toString()
  return apiFetch<AttendanceSummary[]>(`/api/attendance?${qs}`)
}
export const recordAttendance = (data: AttendanceBulkInput) =>
  apiFetch<AttendanceRecord[]>('/api/attendance', { method: 'POST', body: JSON.stringify(data) })

// Exams
export const fetchExams = () => apiFetch<Exam[]>('/api/exams')
export const createExam = (data: ExamCreateInput) =>
  apiFetch<Exam>('/api/exams', { method: 'POST', body: JSON.stringify(data) })
export const updateExam = (id: string, data: ExamUpdateInput) =>
  apiFetch<Exam>(`/api/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteExam = (id: string) =>
  apiFetch<{ success: boolean }>(`/api/exams/${id}`, { method: 'DELETE' })
export const fetchExamResults = (examId: string, classId?: string) => {
  const qs = classId ? `?classId=${classId}` : ''
  return apiFetch<ExamResult[]>(`/api/exams/${examId}/results${qs}`)
}
export const saveExamResults = (
  examId: string,
  classId: string,
  results: { studentId: string; marks: SubjectMark[] }[]
) =>
  apiFetch<ExamResult[]>(`/api/exams/${examId}/results`, {
    method: 'PUT',
    body: JSON.stringify({ classId, results }),
  })

// Fees
export const fetchFeeCategories = () => apiFetch<FeeCategory[]>('/api/fees')
export const fetchFeeStructures = () =>
  apiFetch<import('@/types').FeeStructure[]>('/api/fees?type=structures')
export const fetchStudentFeeSummaries = (overdueOnly?: boolean) =>
  apiFetch<StudentFeeSummary[]>(`/api/payments?overdueOnly=${overdueOnly ?? false}`)
export const recordPayment = (data: Omit<Payment, 'id' | 'createdAt'>) =>
  apiFetch<Payment>('/api/payments', { method: 'POST', body: JSON.stringify(data) })

// Settings
export const fetchSchoolProfile = () => apiFetch<SchoolProfile>('/api/settings')
export const updateSchoolProfile = (data: Partial<SchoolProfile>) =>
  apiFetch<SchoolProfile>('/api/settings', { method: 'PUT', body: JSON.stringify(data) })
export const fetchAcademicConfig = () =>
  apiFetch<AcademicConfig>('/api/settings?section=academic')
export const updateAcademicConfig = (data: Partial<AcademicConfig>) =>
  apiFetch<AcademicConfig>('/api/settings?section=academic', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
export const fetchAdminUsers = () => apiFetch<AdminUser[]>('/api/settings?section=users')
export const createAdminUser = (data: AdminUserCreateInput) =>
  apiFetch<AdminUser>('/api/settings?section=users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const updateAdminUser = (id: string, data: AdminUserUpdateInput) =>
  apiFetch<AdminUser>('/api/settings?section=users', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })
