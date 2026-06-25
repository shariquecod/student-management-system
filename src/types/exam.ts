export interface Exam {
  id: string
  name: string
  term: string
  academicYear: string
  classIds: string[]
  subjects: string[]
  maxScore: number
  passScore: number
  createdAt: string
}

export interface SubjectMark {
  subject: string
  score: number
  maxScore: number
}

export interface ExamResult {
  id: string
  examId: string
  studentId: string
  studentName: string
  rollNumber: string
  classId: string
  marks: SubjectMark[]
  total: number
  maxTotal: number
  percentage: number
  status: 'pass' | 'fail'
}

export type ExamCreateInput = Omit<Exam, 'id' | 'createdAt'>
export type ExamUpdateInput = Partial<ExamCreateInput>
