'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Teacher } from '@/types'
import type {
  TeacherDirectoryFilters,
  TeacherSortDirection,
  TeacherSortField,
} from '@/types/teacher-page'
import { computeTeacherPageStats } from '@/lib/teacher-stats'
import { fetchTeachers } from '@/services/school-api'

const PAGE_SIZE = 8

const defaultFilters: TeacherDirectoryFilters = {
  search: '',
  department: 'all',
  status: 'all',
}

function compareTeachers(
  a: Teacher,
  b: Teacher,
  field: TeacherSortField,
  direction: TeacherSortDirection
) {
  let result = 0
  switch (field) {
    case 'name':
      result = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      break
    case 'employeeId':
      result = a.employeeId.localeCompare(b.employeeId)
      break
    case 'department':
      result = a.department.localeCompare(b.department)
      break
    case 'status':
      result = a.status.localeCompare(b.status)
      break
  }
  return direction === 'asc' ? result : -result
}

export function useTeachersDirectory() {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TeacherDirectoryFilters>(defaultFilters)
  const [sortField, setSortField] = useState<TeacherSortField>('name')
  const [sortDirection, setSortDirection] = useState<TeacherSortDirection>('asc')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchTeachers({ limit: 200 })
      setAllTeachers(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => computeTeacherPageStats(allTeachers), [allTeachers])

  const departments = useMemo(
    () => Array.from(new Set(allTeachers.map((t) => t.department))).sort(),
    [allTeachers]
  )

  const filteredTeachers = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return allTeachers
      .filter((teacher) => {
        if (filters.department !== 'all' && teacher.department !== filters.department) return false
        if (filters.status !== 'all' && teacher.status !== filters.status) return false
        if (!search) return true
        const haystack = [
          teacher.firstName,
          teacher.lastName,
          teacher.employeeId,
          teacher.email,
          teacher.department,
          teacher.subjects.join(' '),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(search)
      })
      .sort((a, b) => compareTeachers(a, b, sortField, sortDirection))
  }, [allTeachers, filters, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginatedTeachers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredTeachers.slice(start, start + PAGE_SIZE)
  }, [filteredTeachers, safePage])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.department !== 'all') count++
    if (filters.status !== 'all') count++
    return count
  }, [filters])

  const updateFilter = useCallback(
    <K extends keyof TeacherDirectoryFilters>(key: K, value: TeacherDirectoryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPage(1)
    },
    []
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
    setPage(1)
  }, [])

  const toggleSort = useCallback((field: TeacherSortField) => {
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

  const initialLoading = loading && allTeachers.length === 0
  const refreshing = loading && allTeachers.length > 0

  return {
    allTeachers,
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
    filteredTeachers,
    paginatedTeachers,
    page: safePage,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    totalFiltered: filteredTeachers.length,
    departments,
    reload: load,
  }
}
