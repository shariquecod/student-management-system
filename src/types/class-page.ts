export type ClassSortField = 'name' | 'grade' | 'section' | 'studentCount' | 'homeroomTeacherName'
export type ClassSortDirection = 'asc' | 'desc'

export interface ClassDirectoryFilters {
  search: string
  grade: string
}
