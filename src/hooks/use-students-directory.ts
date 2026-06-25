'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Student, SchoolClass } from '@/types'
import type {
  StudentDirectoryFilters,
  StudentSortDirection,
  StudentSortField,
} from '@/types/student-page'
import { computeStudentPageStats } from '@/lib/student-stats'
import { fetchStudents, fetchClasses } from '@/services/school-api'

const PAGE_SIZE = 8

const defaultFilters: StudentDirectoryFilters = {
  search: '',
  classId: 'all',
  status: 'all',
  year: 'all',
}

function compareStudents(
  a: Student,
  b: Student,
  field: StudentSortField,
  direction: StudentSortDirection
) {
  let result = 0
  switch (field) {
    case 'name':
      result = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      break
    case 'rollNumber':
      result = a.rollNumber.localeCompare(b.rollNumber)
      break
    case 'className':
      result = a.className.localeCompare(b.className)
      break
    case 'status':
      result = a.status.localeCompare(b.status)
      break
    case 'year':
      result = a.year - b.year
      break
  }
  return direction === 'asc' ? result : -result
}

export function useStudentsDirectory() {
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<(SchoolClass & { studentCount?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StudentDirectoryFilters>(defaultFilters)
  const [sortField, setSortField] = useState<StudentSortField>('name')
  const [sortDirection, setSortDirection] = useState<StudentSortDirection>('asc')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetchStudents({ limit: 200 }),
        fetchClasses({ limit: 50 }),
      ])
      setAllStudents(studentsRes.data)
      setClasses(classesRes.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => computeStudentPageStats(allStudents), [allStudents])

  const filteredStudents = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return allStudents
      .filter((student) => {
        if (filters.classId !== 'all' && student.classId !== filters.classId) return false
        if (filters.status !== 'all' && student.status !== filters.status) return false
        if (filters.year !== 'all' && student.year !== Number(filters.year)) return false
        if (!search) return true
        const haystack = [
          student.firstName,
          student.lastName,
          student.firstNameUr,
          student.lastNameUr,
          student.rollNumber,
          student.email,
          student.className,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(search)
      })
      .sort((a, b) => compareStudents(a, b, sortField, sortDirection))
  }, [allStudents, filters, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginatedStudents = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredStudents.slice(start, start + PAGE_SIZE)
  }, [filteredStudents, safePage])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.classId !== 'all') count++
    if (filters.status !== 'all') count++
    if (filters.year !== 'all') count++
    return count
  }, [filters])

  const updateFilter = useCallback(
    <K extends keyof StudentDirectoryFilters>(key: K, value: StudentDirectoryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPage(1)
    },
    []
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
    setPage(1)
  }, [])

  const toggleSort = useCallback((field: StudentSortField) => {
    setSortField((current) => {
      if (current === field) {
        setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'))
        return current
      }
      setSortDirection('asc')
      return field
    })
    setPage(1)
  }, [])

  const availableYears = useMemo(
    () => Array.from(new Set(allStudents.map((s) => s.year))).sort((a, b) => b - a),
    [allStudents]
  )

  const initialLoading = loading && allStudents.length === 0
  const refreshing = loading && allStudents.length > 0

  return {
    allStudents,
    classes,
    loading,
    initialLoading,
    refreshing,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    sortField,
    sortDirection,
    toggleSort,
    stats,
    filteredStudents,
    paginatedStudents,
    page: safePage,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    totalFiltered: filteredStudents.length,
    availableYears,
    reload: load,
  }
}
