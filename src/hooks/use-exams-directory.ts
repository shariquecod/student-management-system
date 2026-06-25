'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Exam } from '@/types'
import type { ExamDirectoryFilters, ExamSortDirection, ExamSortField } from '@/types/exam-page'
import { fetchExams } from '@/services/school-api'

const PAGE_SIZE = 8

const defaultFilters: ExamDirectoryFilters = {
  search: '',
  term: 'all',
}

function compareExams(
  a: Exam,
  b: Exam,
  field: ExamSortField,
  direction: ExamSortDirection
) {
  let result = 0
  switch (field) {
    case 'name':
      result = a.name.localeCompare(b.name)
      break
    case 'term':
      result = a.term.localeCompare(b.term)
      break
    case 'academicYear':
      result = a.academicYear.localeCompare(b.academicYear)
      break
    case 'subjects':
      result = a.subjects.length - b.subjects.length
      break
  }
  return direction === 'asc' ? result : -result
}

export function useExamsDirectory() {
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<ExamDirectoryFilters>(defaultFilters)
  const [sortField, setSortField] = useState<ExamSortField>('name')
  const [sortDirection, setSortDirection] = useState<ExamSortDirection>('asc')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    const data = await fetchExams()
    setAllExams(data)
    return data
  }, [])

  useEffect(() => {
    load()
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [load])

  const reload = useCallback(async () => {
    setRefreshing(true)
    try {
      await load()
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }, [load])

  const stats = useMemo(() => ({
    total: allExams.length,
    subjects: new Set(allExams.flatMap((e) => e.subjects)).size,
    classes: new Set(allExams.flatMap((e) => e.classIds)).size,
  }), [allExams])

  const availableTerms = useMemo(
    () => Array.from(new Set(allExams.map((e) => e.term))).sort(),
    [allExams]
  )

  const filteredExams = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return allExams
      .filter((exam) => {
        if (filters.term !== 'all' && exam.term !== filters.term) return false
        if (!search) return true
        const haystack = [
          exam.name,
          exam.term,
          exam.academicYear,
          exam.subjects.join(' '),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(search)
      })
      .sort((a, b) => compareExams(a, b, sortField, sortDirection))
  }, [allExams, filters, sortField, sortDirection])

  const totalFiltered = filteredExams.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  const paginatedExams = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredExams.slice(start, start + PAGE_SIZE)
  }, [filteredExams, page])

  useEffect(() => {
    setPage(1)
  }, [filters, sortField, sortDirection])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const updateFilter = useCallback(
    <K extends keyof ExamDirectoryFilters>(key: K, value: ExamDirectoryFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search.trim()) count++
    if (filters.term !== 'all') count++
    return count
  }, [filters])

  const toggleSort = useCallback((field: ExamSortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setSortDirection('asc')
      return field
    })
  }, [])

  return {
    allExams,
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
    availableTerms,
    paginatedExams,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    totalFiltered,
    reload,
  }
}
