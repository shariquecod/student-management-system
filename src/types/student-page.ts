export type StudentSortField = 'name' | 'rollNumber' | 'className' | 'status' | 'year'
export type StudentSortDirection = 'asc' | 'desc'

export interface StudentDirectoryFilters {
  search: string
  classId: string
  status: string
  year: string
}

export interface StudentPageStats {
  total: number
  active: number
  inactive: number
  graduated: number
}
