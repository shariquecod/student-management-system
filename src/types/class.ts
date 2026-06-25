export interface TimetableSlot {
  day: string
  startTime: string
  endTime: string
  subject: string
}

export interface SchoolClass {
  id: string
  name: string
  grade: string
  section: string
  homeroomTeacherId: string
  homeroomTeacherName: string
  studentIds: string[]
  subjectTeacherIds: string[]
  scheduleSummary: string
  timetable: TimetableSlot[]
  createdAt: string
  updatedAt: string
}

export type SchoolClassCreateInput = Omit<
  SchoolClass,
  'id' | 'homeroomTeacherName' | 'createdAt' | 'updatedAt'
>
export type SchoolClassUpdateInput = Partial<SchoolClassCreateInput>
