import type {
  AttendanceBulkInput,
  AttendanceRecord,
  AttendanceSummary,
  Exam,
  ExamCreateInput,
  ExamResult,
  ExamUpdateInput,
  FeeCategory,
  FeeStructure,
  Payment,
  SchoolClass,
  SchoolClassCreateInput,
  SchoolClassUpdateInput,
  Student,
  StudentCreateInput,
  StudentFeeSummary,
  StudentUpdateInput,
  SubjectMark,
  Teacher,
  TeacherCreateInput,
  TeacherUpdateInput,
  AdminUser,
  AdminUserCreateInput,
  AdminUserUpdateInput,
  SchoolProfile,
  AcademicConfig,
} from '@/types'
import {
  students,
  teachers,
  classes,
  attendanceRecords,
  exams,
  examResults,
  feeCategories,
  feeStructures,
  payments,
  mockUsers,
  mockPasswords,
  schoolProfile,
  academicConfig,
  addActivity,
} from './seed'
import { generateId, paginate, filterBySearch } from './utils'

// --- Auth ---
export function authenticateUser(email: string, password: string) {
  const stored = mockPasswords[email.toLowerCase()]
  if (!stored || stored !== password) return null
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive)
  return user ?? null
}

export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id) ?? null
}

// --- Students ---
export function getStudents(params?: {
  search?: string
  classId?: string
  status?: string
  year?: number
  page?: number
  limit?: number
}) {
  let result = [...students]
  if (params?.classId) result = result.filter((s) => s.classId === params.classId)
  if (params?.status) result = result.filter((s) => s.status === params.status)
  if (params?.year) result = result.filter((s) => s.year === params.year)
  result = filterBySearch(result, params?.search, [
    'firstName',
    'lastName',
    'rollNumber',
    'email',
  ])
  return paginate(result, params?.page, params?.limit)
}

export function getStudentById(id: string) {
  return students.find((s) => s.id === id) ?? null
}

export function getStudentProfile(studentId: string) {
  const student = getStudentById(studentId)
  if (!student) return null
  const attendanceSummary = getAttendanceSummary({ studentId })
  const feeSummaries = getStudentFeeSummaries()
  return {
    student,
    attendance: getAttendance({ studentId }),
    attendanceSummary: attendanceSummary[0] ?? null,
    feeSummary: feeSummaries.find((f) => f.studentId === studentId) ?? null,
    examResults: examResults.filter((r) => r.studentId === studentId),
  }
}

export function createStudent(input: StudentCreateInput): Student {
  const cls = classes.find((c) => c.id === input.classId)
  const student: Student = {
    ...input,
    id: generateId('stu'),
    className: cls?.name ?? 'Unassigned',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  students.push(student)
  if (cls) {
    cls.studentIds.push(student.id)
    cls.updatedAt = new Date().toISOString()
  }
  addActivity('student_added', `${student.firstName} ${student.lastName} enrolled in ${student.className}`)
  return student
}

export function updateStudent(id: string, input: StudentUpdateInput): Student | null {
  const idx = students.findIndex((s) => s.id === id)
  if (idx === -1) return null
  const oldClassId = students[idx].classId
  const updated: Student = {
    ...students[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  if (input.classId && input.classId !== oldClassId) {
    const oldCls = classes.find((c) => c.id === oldClassId)
    const newCls = classes.find((c) => c.id === input.classId)
    if (oldCls) oldCls.studentIds = oldCls.studentIds.filter((sid) => sid !== id)
    if (newCls) {
      newCls.studentIds.push(id)
      updated.className = newCls.name
    }
  }
  students[idx] = updated
  return updated
}

export function deleteStudent(id: string): boolean {
  const idx = students.findIndex((s) => s.id === id)
  if (idx === -1) return false
  const cls = classes.find((c) => c.id === students[idx].classId)
  if (cls) cls.studentIds = cls.studentIds.filter((sid) => sid !== id)
  students.splice(idx, 1)
  return true
}

// --- Teachers ---
export function getTeachers(params?: {
  search?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}) {
  let result = [...teachers]
  if (params?.department) result = result.filter((t) => t.department === params.department)
  if (params?.status) result = result.filter((t) => t.status === params.status)
  result = filterBySearch(result, params?.search, [
    'firstName',
    'lastName',
    'employeeId',
    'email',
  ])
  return paginate(result, params?.page, params?.limit)
}

export function getTeacherById(id: string) {
  return teachers.find((t) => t.id === id) ?? null
}

export function createTeacher(input: TeacherCreateInput): Teacher {
  const teacher: Teacher = {
    ...input,
    id: generateId('tch'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  teachers.push(teacher)
  addActivity('teacher_added', `${teacher.firstName} ${teacher.lastName} joined as ${teacher.department}`)
  return teacher
}

export function updateTeacher(id: string, input: TeacherUpdateInput): Teacher | null {
  const idx = teachers.findIndex((t) => t.id === id)
  if (idx === -1) return null
  teachers[idx] = { ...teachers[idx], ...input, updatedAt: new Date().toISOString() }
  return teachers[idx]
}

export function deleteTeacher(id: string): boolean {
  const idx = teachers.findIndex((t) => t.id === id)
  if (idx === -1) return false
  teachers[idx].status = 'archived'
  teachers[idx].updatedAt = new Date().toISOString()
  return true
}

// --- Classes ---
export function getClasses(params?: { search?: string; page?: number; limit?: number }) {
  let result = classes.map((c) => ({
    ...c,
    studentCount: c.studentIds.length,
  }))
  if (params?.search) {
    result = filterBySearch(result, params.search, ['name', 'grade', 'section'])
  }
  return paginate(result, params?.page, params?.limit)
}

export function getClassById(id: string) {
  const cls = classes.find((c) => c.id === id)
  if (!cls) return null
  return {
    ...cls,
    students: students.filter((s) => cls.studentIds.includes(s.id)),
    subjectTeachers: teachers.filter((t) => cls.subjectTeacherIds.includes(t.id)),
  }
}

export function createClass(input: SchoolClassCreateInput): SchoolClass {
  const homeroom = teachers.find((t) => t.id === input.homeroomTeacherId)
  const cls: SchoolClass = {
    ...input,
    id: generateId('cls'),
    homeroomTeacherName: homeroom ? `${homeroom.firstName} ${homeroom.lastName}` : 'Unassigned',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  classes.push(cls)
  return cls
}

export function updateClass(id: string, input: SchoolClassUpdateInput): SchoolClass | null {
  const idx = classes.findIndex((c) => c.id === id)
  if (idx === -1) return null
  const homeroom = input.homeroomTeacherId
    ? teachers.find((t) => t.id === input.homeroomTeacherId)
    : null
  classes[idx] = {
    ...classes[idx],
    ...input,
    homeroomTeacherName: homeroom
      ? `${homeroom.firstName} ${homeroom.lastName}`
      : classes[idx].homeroomTeacherName,
    updatedAt: new Date().toISOString(),
  }
  return classes[idx]
}

export function deleteClass(id: string): boolean {
  const idx = classes.findIndex((c) => c.id === id)
  if (idx === -1) return false
  classes.splice(idx, 1)
  return true
}

// --- Attendance ---
export function getAttendance(params?: {
  date?: string
  classId?: string
  studentId?: string
  from?: string
  to?: string
}) {
  let result = [...attendanceRecords]
  if (params?.date) result = result.filter((r) => r.date === params.date)
  if (params?.classId) result = result.filter((r) => r.classId === params.classId)
  if (params?.studentId) result = result.filter((r) => r.studentId === params.studentId)
  if (params?.from) result = result.filter((r) => r.date >= params.from!)
  if (params?.to) result = result.filter((r) => r.date <= params.to!)
  return result
}

export function saveAttendance(input: AttendanceBulkInput): AttendanceRecord[] {
  const cls = classes.find((c) => c.id === input.classId)
  const saved: AttendanceRecord[] = []
  for (const rec of input.records) {
    const student = students.find((s) => s.id === rec.studentId)
    if (!student) continue
    const existingIdx = attendanceRecords.findIndex(
      (r) => r.date === input.date && r.studentId === rec.studentId
    )
    const record: AttendanceRecord = {
      id: existingIdx >= 0 ? attendanceRecords[existingIdx].id : generateId('att'),
      date: input.date,
      classId: input.classId,
      className: cls?.name ?? '',
      studentId: rec.studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      status: rec.status,
      recordedAt: new Date().toISOString(),
    }
    if (existingIdx >= 0) attendanceRecords[existingIdx] = record
    else attendanceRecords.push(record)
    saved.push(record)
  }
  addActivity('attendance_updated', `Attendance recorded for ${cls?.name ?? input.classId}`)
  return saved
}

export function getAttendanceSummary(params: {
  studentId?: string
  classId?: string
  from?: string
  to?: string
}): AttendanceSummary[] {
  let records = getAttendance(params)
  const byStudent = new Map<string, AttendanceRecord[]>()
  for (const r of records) {
    if (!byStudent.has(r.studentId)) byStudent.set(r.studentId, [])
    byStudent.get(r.studentId)!.push(r)
  }
  return Array.from(byStudent.entries()).map(([studentId, recs]) => ({
    studentId,
    studentName: recs[0].studentName,
    rollNumber: recs[0].rollNumber,
    present: recs.filter((r) => r.status === 'present').length,
    absent: recs.filter((r) => r.status === 'absent').length,
    late: recs.filter((r) => r.status === 'late').length,
    total: recs.length,
  }))
}

// --- Exams ---
export function getExams() {
  return [...exams]
}

export function getExamById(id: string) {
  return exams.find((e) => e.id === id) ?? null
}

export function createExam(input: ExamCreateInput): Exam {
  const exam: Exam = { ...input, id: generateId('exam'), createdAt: new Date().toISOString() }
  exams.push(exam)
  return exam
}

export function updateExam(id: string, input: ExamUpdateInput): Exam | null {
  const idx = exams.findIndex((e) => e.id === id)
  if (idx === -1) return null
  exams[idx] = { ...exams[idx], ...input }
  return exams[idx]
}

export function deleteExam(id: string): boolean {
  const idx = exams.findIndex((e) => e.id === id)
  if (idx === -1) return false
  exams.splice(idx, 1)
  const remaining = examResults.filter((r) => r.examId !== id)
  examResults.splice(0, examResults.length, ...remaining)
  return true
}

export function getExamResults(examId: string, classId?: string) {
  let result = examResults.filter((r) => r.examId === examId)
  if (classId) result = result.filter((r) => r.classId === classId)
  return result
}

export function saveExamResults(
  examId: string,
  classId: string,
  results: { studentId: string; marks: SubjectMark[] }[]
): ExamResult[] {
  const exam = getExamById(examId)
  if (!exam) return []
  const saved: ExamResult[] = []
  for (const r of results) {
    const student = students.find((s) => s.id === r.studentId)
    if (!student) continue
    const total = r.marks.reduce((s, m) => s + m.score, 0)
    const maxTotal = r.marks.reduce((s, m) => s + m.maxScore, 0)
    const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0
    const result: ExamResult = {
      id: generateId('res'),
      examId,
      studentId: r.studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      classId,
      marks: r.marks,
      total,
      maxTotal,
      percentage,
      status: percentage >= (exam.passScore / exam.maxScore) * 100 ? 'pass' : 'fail',
    }
    const idx = examResults.findIndex(
      (er) => er.examId === examId && er.studentId === r.studentId
    )
    if (idx >= 0) examResults[idx] = result
    else examResults.push(result)
    saved.push(result)
  }
  addActivity('exam_results', `Results updated for ${exam.name}`)
  return saved
}

// --- Fees ---
export function getFeeCategories() {
  return [...feeCategories]
}

export function createFeeCategory(input: Omit<FeeCategory, 'id'>): FeeCategory {
  const cat: FeeCategory = { ...input, id: generateId('fee_cat') }
  feeCategories.push(cat)
  return cat
}

export function getFeeStructures() {
  return [...feeStructures]
}

export function getStudentFeeSummaries(params?: { overdueOnly?: boolean }) {
  const summaries: StudentFeeSummary[] = students.map((s) => {
    const due = feeStructures
      .filter((f) => f.studentId === s.id)
      .reduce((sum, f) => sum + f.amount, 0)
    const paid = payments
      .filter((p) => p.studentId === s.id)
      .reduce((sum, p) => sum + p.amount, 0)
    const lastPayment = payments
      .filter((p) => p.studentId === s.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0]
    const balance = due - paid
    return {
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      rollNumber: s.rollNumber,
      className: s.className,
      totalDue: due,
      totalPaid: paid,
      balance,
      lastPaymentDate: lastPayment?.date,
      isOverdue: balance > 0 && new Date() > new Date('2025-06-30'),
    }
  })
  if (params?.overdueOnly) return summaries.filter((s) => s.isOverdue && s.balance > 0)
  return summaries
}

export function createPayment(input: Omit<Payment, 'id' | 'createdAt'>): Payment {
  const payment: Payment = {
    ...input,
    id: generateId('pay'),
    createdAt: new Date().toISOString(),
  }
  payments.push(payment)
  addActivity('payment_received', `Payment of $${payment.amount} received from ${payment.studentName}`)
  return payment
}

// --- Settings ---
export function getSchoolProfile() {
  return { ...schoolProfile }
}

export function updateSchoolProfile(input: Partial<SchoolProfile>) {
  Object.assign(schoolProfile, input)
  return { ...schoolProfile }
}

export function getAcademicConfig() {
  return { ...academicConfig }
}

export function updateAcademicConfig(input: Partial<AcademicConfig>) {
  Object.assign(academicConfig, input)
  return { ...academicConfig }
}

export function getAdminUsers() {
  return mockUsers.map((u) => ({ ...u }))
}

export function createAdminUser(input: AdminUserCreateInput): AdminUser {
  const user: AdminUser = {
    id: generateId('user'),
    name: input.name,
    email: input.email,
    role: input.role,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
  mockUsers.push(user)
  mockPasswords[input.email.toLowerCase()] = input.password
  return user
}

export function updateAdminUser(id: string, input: AdminUserUpdateInput): AdminUser | null {
  const idx = mockUsers.findIndex((u) => u.id === id)
  if (idx === -1) return null
  mockUsers[idx] = { ...mockUsers[idx], ...input }
  return mockUsers[idx]
}

export { getDashboardData } from './seed'
