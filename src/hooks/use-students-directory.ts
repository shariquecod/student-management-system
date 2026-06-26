'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Student } from '@/types'
import type {
  StudentDirectoryFilters,
  StudentSortDirection,
  StudentSortField,
} from '@/types/student-page'
import { computeStudentPageStats } from '@/lib/student-stats'
import { fetchStudentsList } from '@/services/student-api'

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
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<StudentDirectoryFilters>(defaultFilters)
  const [searchInput, setSearchInput] = useState('')
  const [sortField, setSortField] = useState<StudentSortField>('name')
  const [sortDirection, setSortDirection] = useState<StudentSortDirection>('asc')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchStudentsList({
        page: 1,
        limit: 200,
        search: filters.search.trim() || undefined,
        classId: filters.classId !== 'all' ? filters.classId : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        year: filters.year !== 'all' ? Number(filters.year) : undefined,
      })
      setStudents(res.data)
    } catch (err) {
      setStudents([])
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  const applySearch = useCallback(() => {
    const next = searchInput.trim()
    setFilters((prev) => (prev.search === next ? prev : { ...prev, search: next }))
    setPage(1)
  }, [searchInput])

  const clearSearch = useCallback(() => {
    setSearchInput('')
    setFilters((prev) => (prev.search === '' ? prev : { ...prev, search: '' }))
    setPage(1)
  }, [])

  const classes = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const student of students) {
      if (student.classId && student.className && !map.has(student.classId)) {
        map.set(student.classId, { id: student.classId, name: student.className })
      }
    }
    return Array.from(map.values())
  }, [students])

  const stats = useMemo(() => computeStudentPageStats(students), [students])

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => compareStudents(a, b, sortField, sortDirection)),
    [students, sortField, sortDirection]
  )

  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginatedStudents = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return sortedStudents.slice(start, start + PAGE_SIZE)
  }, [sortedStudents, safePage])

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
    setSearchInput('')
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
    () => Array.from(new Set(students.map((s) => s.year))).sort((a, b) => b - a),
    [students]
  )

  const initialLoading = loading && students.length === 0 && !error
  const refreshing = loading && students.length > 0
  const searchHighlight = searchInput.trim().length > 0

  return {
    students,
    classes,
    loading,
    error,
    initialLoading,
    refreshing,
    filters,
    searchInput,
    setSearchInput,
    applySearch,
    clearSearch,
    searchHighlight,
    updateFilter,
    clearFilters,
    activeFilterCount,
    sortField,
    sortDirection,
    toggleSort,
    stats,
    paginatedStudents,
    page: safePage,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    totalFiltered: sortedStudents.length,
    availableYears,
    reload: load,
  }
}
