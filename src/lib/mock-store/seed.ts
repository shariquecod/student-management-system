import type {
  AdminUser,
  AttendanceRecord,
  DashboardData,
  Exam,
  ExamResult,
  FeeCategory,
  FeeStructure,
  Payment,
  RecentActivity,
  SchoolClass,
  SchoolProfile,
  AcademicConfig,
  Student,
  Teacher,
} from '@/types'
import {
  studentSeedRecords,
  splitStudentName,
  getStudentClassFromLabel,
  buildStudentNotes,
  slugifyStudentEmail,
} from '@/data/students-page'
import { generateId } from './utils'

// Mock credentials: admin@school.edu / admin123 | staff@school.edu / staff123

export const mockUsers: AdminUser[] = [
  {
    id: 'user_1',
    name: 'Super Admin',
    email: 'admin@school.edu',
    role: 'super_admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user_2',
    name: 'Staff Member',
    email: 'staff@school.edu',
    role: 'staff',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
]

export const mockPasswords: Record<string, string> = {
  'admin@school.edu': 'admin123',
  'staff@school.edu': 'staff123',
}

export let schoolProfile: SchoolProfile = {
  name: 'Apex Valley Academy',
  logoUrl: 'https://dummyimage.com/120x120/1e3a5f/ffffff.png&text=AVA',
  address: '123 Education Lane, Springfield',
  phone: '+1 (555) 123-4567',
  email: 'info@apexvalley.edu',
  website: 'https://apexvalley.edu',
}

export let academicConfig: AcademicConfig = {
  academicYear: '2025-2026',
  currentTerm: 'Spring',
  terms: ['Fall', 'Spring', 'Summer'],
}

export let teachers: Teacher[] = [
  {
    id: 'tch_1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    employeeId: 'EMP001',
    email: 'sarah.j@school.edu',
    phone: '+1 555-0101',
    department: 'Mathematics',
    subjects: ['Mathematics', 'Statistics'],
    assignedClassIds: ['cls_3', 'cls_4'],
    joiningDate: '2020-08-15',
    status: 'active',
    createdAt: '2020-08-15T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_2',
    firstName: 'Michael',
    lastName: 'Chen',
    employeeId: 'EMP002',
    email: 'michael.c@school.edu',
    phone: '+1 555-0102',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    assignedClassIds: ['cls_2', 'cls_3'],
    joiningDate: '2019-09-01',
    status: 'active',
    createdAt: '2019-09-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_3',
    firstName: 'Emily',
    lastName: 'Davis',
    employeeId: 'EMP003',
    email: 'emily.d@school.edu',
    phone: '+1 555-0103',
    department: 'English',
    subjects: ['English Literature', 'Creative Writing'],
    assignedClassIds: ['cls_4'],
    joiningDate: '2021-01-10',
    status: 'active',
    createdAt: '2021-01-10T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_4',
    firstName: 'Robert',
    lastName: 'Wilson',
    employeeId: 'EMP004',
    email: 'robert.w@school.edu',
    phone: '+1 555-0104',
    department: 'History',
    subjects: ['World History', 'Civics'],
    assignedClassIds: ['cls_5'],
    joiningDate: '2018-08-20',
    status: 'active',
    createdAt: '2018-08-20T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_5',
    firstName: 'Priya',
    lastName: 'Patel',
    employeeId: 'EMP005',
    email: 'priya.p@school.edu',
    phone: '+1 555-0105',
    department: 'Computer Science',
    subjects: ['Programming', 'Data Structures'],
    assignedClassIds: ['cls_1', 'cls_6'],
    joiningDate: '2022-01-15',
    status: 'active',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_6',
    firstName: 'David',
    lastName: 'Kim',
    employeeId: 'EMP006',
    email: 'david.k@school.edu',
    phone: '+1 555-0106',
    department: 'Arts',
    subjects: ['Visual Arts', 'Design'],
    assignedClassIds: ['cls_1'],
    joiningDate: '2020-03-01',
    status: 'active',
    createdAt: '2020-03-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_7',
    firstName: 'Lisa',
    lastName: 'Nguyen',
    employeeId: 'EMP007',
    email: 'lisa.n@school.edu',
    phone: '+1 555-0107',
    department: 'Physical Education',
    subjects: ['PE', 'Health'],
    assignedClassIds: ['cls_6'],
    joiningDate: '2019-08-01',
    status: 'active',
    createdAt: '2019-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_8',
    firstName: 'James',
    lastName: 'Okafor',
    employeeId: 'EMP008',
    email: 'james.o@school.edu',
    phone: '+1 555-0108',
    department: 'Music',
    subjects: ['Music Theory', 'Choir'],
    assignedClassIds: ['cls_4'],
    joiningDate: '2021-09-01',
    status: 'active',
    createdAt: '2021-09-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_9',
    firstName: 'Anna',
    lastName: 'Schmidt',
    employeeId: 'EMP009',
    email: 'anna.s@school.edu',
    phone: '+1 555-0109',
    department: 'Languages',
    subjects: ['French', 'German'],
    assignedClassIds: ['cls_5'],
    joiningDate: '2017-08-15',
    status: 'active',
    createdAt: '2017-08-15T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_10',
    firstName: 'Carlos',
    lastName: 'Rivera',
    employeeId: 'EMP010',
    email: 'carlos.r@school.edu',
    phone: '+1 555-0110',
    department: 'Mathematics',
    subjects: ['Algebra', 'Calculus'],
    assignedClassIds: ['cls_5'],
    joiningDate: '2016-08-20',
    status: 'active',
    createdAt: '2016-08-20T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_11',
    firstName: 'Rachel',
    lastName: 'Brooks',
    employeeId: 'EMP011',
    email: 'rachel.b@school.edu',
    phone: '+1 555-0111',
    department: 'Science',
    subjects: ['Biology', 'Environmental Science'],
    assignedClassIds: ['cls_2', 'cls_5'],
    joiningDate: '2018-01-10',
    status: 'active',
    createdAt: '2018-01-10T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tch_12',
    firstName: 'Thomas',
    lastName: 'Wright',
    employeeId: 'EMP012',
    email: 'thomas.w@school.edu',
    phone: '+1 555-0112',
    department: 'Economics',
    subjects: ['Economics', 'Business Studies'],
    assignedClassIds: ['cls_6'],
    joiningDate: '2015-08-01',
    status: 'inactive',
    createdAt: '2015-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]

export let classes: SchoolClass[] = [
  {
    id: 'cls_1',
    name: 'Grade 7',
    grade: '7',
    section: 'A',
    homeroomTeacherId: 'tch_5',
    homeroomTeacherName: 'Priya Patel',
    studentIds: [],
    subjectTeacherIds: ['tch_5', 'tch_6'],
    scheduleSummary: 'Afternoon, 12:00 PM – 5:00 PM',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cls_2',
    name: 'Grade 8',
    grade: '8',
    section: 'A',
    homeroomTeacherId: 'tch_2',
    homeroomTeacherName: 'Michael Chen',
    studentIds: [],
    subjectTeacherIds: ['tch_2', 'tch_3'],
    scheduleSummary: 'Afternoon, 12:00 PM – 5:00 PM',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cls_3',
    name: 'Grade 9',
    grade: '9',
    section: 'A',
    homeroomTeacherId: 'tch_1',
    homeroomTeacherName: 'Sarah Johnson',
    studentIds: [],
    subjectTeacherIds: ['tch_1', 'tch_2'],
    scheduleSummary: 'Morning & Afternoon shifts',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cls_4',
    name: 'Grade 10',
    grade: '10',
    section: 'A',
    homeroomTeacherId: 'tch_3',
    homeroomTeacherName: 'Emily Davis',
    studentIds: [],
    subjectTeacherIds: ['tch_3', 'tch_4'],
    scheduleSummary: 'Morning & Afternoon shifts',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cls_5',
    name: 'Grade 12',
    grade: '12',
    section: 'A',
    homeroomTeacherId: 'tch_4',
    homeroomTeacherName: 'Robert Wilson',
    studentIds: [],
    subjectTeacherIds: ['tch_4', 'tch_9'],
    scheduleSummary: 'Friday shift',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cls_6',
    name: 'Unassigned',
    grade: '',
    section: '',
    homeroomTeacherId: 'tch_12',
    homeroomTeacherName: 'Thomas Wright',
    studentIds: [],
    subjectTeacherIds: ['tch_12'],
    scheduleSummary: 'Pending class assignment',
    timetable: [],
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]

const birthYearByGrade: Record<string, number> = {
  '7': 2013,
  '8': 2012,
  '9': 2011,
  '10': 2010,
  '12': 2008,
}

export let students: Student[] = studentSeedRecords.map((record) => {
  const { firstName, lastName } = splitStudentName(record.fullName)
  const { firstName: firstNameUr, lastName: lastNameUr } = splitStudentName(record.fullNameUr)
  const cls = getStudentClassFromLabel(record.classLabel)
  const grade = cls.grade || '9'
  const birthYear = birthYearByGrade[grade] ?? 2011

  return {
    id: `stu_${record.serialNo}`,
    firstName,
    lastName,
    firstNameUr,
    lastNameUr,
    rollNumber: String(record.serialNo).padStart(3, '0'),
    email: slugifyStudentEmail(record.fullName, record.serialNo),
    phone: `+91 ${record.mobile}`,
    classId: cls.id,
    className: cls.name,
    year: cls.year,
    status: 'active' as const,
    dateOfBirth: `${birthYear}-06-15`,
    address: record.village ? `${record.village}, Maharashtra` : 'Not specified',
    guardian: {
      name: `Guardian of ${firstName}`,
      phone: `+91 ${record.mobile}`,
      relation: 'Parent',
    },
    notes: buildStudentNotes(record),
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z',
  }
})

for (const cls of classes) {
  cls.studentIds = students.filter((s) => s.classId === cls.id).map((s) => s.id)
}

export let attendanceRecords: AttendanceRecord[] = []
export let exams: Exam[] = [
  {
    id: 'exam_1',
    name: 'Midterm Examination',
    term: 'Spring',
    academicYear: '2025-2026',
    classIds: ['cls_3', 'cls_4'],
    subjects: ['Mathematics', 'Physics', 'English'],
    maxScore: 100,
    passScore: 40,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'exam_2',
    name: 'Unit Test 1',
    term: 'Spring',
    academicYear: '2025-2026',
    classIds: ['cls_2'],
    subjects: ['Chemistry', 'History'],
    maxScore: 50,
    passScore: 20,
    createdAt: '2025-04-01T00:00:00Z',
  },
  {
    id: 'exam_3',
    name: 'Final Examination',
    term: 'Spring',
    academicYear: '2025-2026',
    classIds: ['cls_5'],
    subjects: ['Mathematics', 'English', 'Science'],
    maxScore: 100,
    passScore: 40,
    createdAt: '2025-05-01T00:00:00Z',
  },
]

export let examResults: ExamResult[] = []
export let feeCategories: FeeCategory[] = [
  { id: 'fee_cat_1', name: 'Tuition', description: 'Annual tuition fee', defaultAmount: 5000 },
  { id: 'fee_cat_2', name: 'Transport', description: 'School bus service', defaultAmount: 800 },
  { id: 'fee_cat_3', name: 'Lab', description: 'Science lab fee', defaultAmount: 300 },
]

export let feeStructures: FeeStructure[] = studentSeedRecords.map((record) => ({
  id: `fs_stu_${record.serialNo}`,
  categoryId: 'fee_cat_1',
  categoryName: 'Tuition',
  studentId: `stu_${record.serialNo}`,
  amount: record.fee ?? 1000,
  dueDate: '2025-06-30',
}))

export let payments: Payment[] = students.slice(0, 8).map((s, i) => ({
  id: `pay_${i + 1}`,
  studentId: s.id,
  studentName: `${s.firstName} ${s.lastName}`,
  amount: Math.round((studentSeedRecords[i]?.fee ?? 1000) * 0.5),
  method: (['cash', 'card', 'bank_transfer', 'online'] as const)[i % 4],
  date: `2025-0${(i % 5) + 1}-15`,
  createdAt: `2025-0${(i % 5) + 1}-15T10:00:00Z`,
}))

export let recentActivities: RecentActivity[] = [
  {
    id: 'act_1',
    type: 'student_added',
    message: 'Abdul Jabir Parwan enrolled in Grade 12',
    timestamp: '2025-06-20T09:00:00Z',
  },
  {
    id: 'act_2',
    type: 'attendance_updated',
    message: 'Attendance recorded for Grade 9',
    timestamp: '2025-06-22T08:30:00Z',
  },
  {
    id: 'act_3',
    type: 'payment_received',
    message: 'Payment of ₹500 received from Syed Abdul Haris Jawan',
    timestamp: '2025-06-21T14:00:00Z',
  },
  {
    id: 'act_4',
    type: 'exam_results',
    message: 'Midterm results published for Grade 10',
    timestamp: '2025-06-19T16:00:00Z',
  },
]

export function addActivity(type: RecentActivity['type'], message: string) {
  recentActivities.unshift({
    id: generateId('act'),
    type,
    message,
    timestamp: new Date().toISOString(),
  })
  if (recentActivities.length > 20) recentActivities.pop()
}

export function getDashboardData(): DashboardData {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const feesThisMonth = payments
    .filter((p) => new Date(p.date) >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0)

  const today = now.toISOString().split('T')[0]
  const todayRecords = attendanceRecords.filter((r) => r.date === today)
  const attendanceRateToday =
    todayRecords.length > 0
      ? Math.round(
          (todayRecords.filter((r) => r.status === 'present').length / todayRecords.length) * 100
        )
      : 92

  return {
    stats: {
      totalStudents: students.filter((s) => s.status === 'active').length,
      totalTeachers: teachers.filter((t) => t.status === 'active').length,
      totalClasses: classes.length,
      feesCollectedThisMonth: feesThisMonth,
      attendanceRateToday,
    },
    enrollmentTrend: [
      { month: 'Jan', count: 10 },
      { month: 'Feb', count: 11 },
      { month: 'Mar', count: 12 },
      { month: 'Apr', count: 13 },
      { month: 'May', count: 14 },
      { month: 'Jun', count: students.filter((s) => s.status === 'active').length },
    ],
    recentActivities: recentActivities.slice(0, 8),
  }
}
