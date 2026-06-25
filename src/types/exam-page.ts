export type ExamSortField = 'name' | 'term' | 'academicYear' | 'subjects'
export type ExamSortDirection = 'asc' | 'desc'

export interface ExamDirectoryFilters {
  search: string
  term: string
}
