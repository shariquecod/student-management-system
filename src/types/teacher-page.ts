export type TeacherSortField = 'name' | 'employeeId' | 'department' | 'status'
export type TeacherSortDirection = 'asc' | 'desc'

export interface TeacherDirectoryFilters {
  search: string
  department: string
  status: string
}

export interface TeacherPageStats {
  total: number
  active: number
  inactive: number
  archived: number
}
