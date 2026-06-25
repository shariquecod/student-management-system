'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchClasses,
  getClass,
  fetchAttendance,
  fetchAttendanceSummary,
  recordAttendance,
} from '@/services/school-api'
import type { AttendanceStatus, AttendanceSummary, SchoolClass, Student } from '@/types'
import { computeAttendanceStats } from '@/lib/attendance-stats'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export function useAttendancePage() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<Student[]>([])
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [summary, setSummary] = useState<AttendanceSummary[]>([])
  const [histClass, setHistClass] = useState('all')
  const [histStudent, setHistStudent] = useState('')
  const [tab, setTab] = useState<'record' | 'history'>('record')
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadClasses = useCallback(async () => {
    const result = await fetchClasses({ limit: 50 })
    setClasses(result.data)
    setClassId((prev) => prev || result.data[0]?.id || '')
  }, [])

  const loadRoster = useCallback(async () => {
    if (!classId) return
    setLoadingRoster(true)
    try {
      const [schoolClass, records] = await Promise.all([
        getClass(classId),
        fetchAttendance({ date, classId }),
      ])
      setStudents(schoolClass.students)
      const map: Record<string, AttendanceStatus> = {}
      schoolClass.students.forEach((s) => {
        map[s.id] = 'present'
      })
      records.forEach((r) => {
        map[r.studentId] = r.status
      })
      setStatuses(map)
    } catch {
      toast.error(t('attendance.loadFailed'))
    } finally {
      setLoadingRoster(false)
    }
  }, [classId, date, t])

  useEffect(() => {
    loadClasses()
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [loadClasses])

  useEffect(() => {
    if (tab !== 'record') return
    loadRoster()
  }, [loadRoster, tab])

  const stats = useMemo(
    () => computeAttendanceStats(students.length, statuses),
    [statuses, students.length]
  )

  const rosterLoading = initialLoading || loadingRoster

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await loadRoster()
    } finally {
      setRefreshing(false)
    }
  }, [loadRoster])

  const save = useCallback(async () => {
    if (!classId) return
    setSaving(true)
    try {
      await recordAttendance({
        date,
        classId,
        records: Object.entries(statuses).map(([studentId, status]) => ({ studentId, status })),
      })
      toast.success(t('attendance.saved'))
    } catch {
      toast.error(t('attendance.saveFailed'))
    } finally {
      setSaving(false)
    }
  }, [classId, date, statuses, t])

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true)
    try {
      const data = await fetchAttendanceSummary({
        ...(histClass !== 'all' ? { classId: histClass } : {}),
        ...(histStudent ? { studentId: histStudent } : {}),
      })
      setSummary(data)
    } catch {
      toast.error(t('attendance.loadFailed'))
    } finally {
      setLoadingSummary(false)
    }
  }, [histClass, histStudent, t])

  const setStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }))
  }, [])

  const bulkMark = useCallback(
    (status: AttendanceStatus) => {
      setStatuses((prev) => {
        const next = { ...prev }
        students.forEach((s) => {
          next[s.id] = status
        })
        return next
      })
    },
    [students]
  )

  return {
    classes,
    classId,
    setClassId,
    date,
    setDate,
    students,
    statuses,
    summary,
    histClass,
    setHistClass,
    histStudent,
    setHistStudent,
    tab,
    setTab,
    stats,
    rosterLoading,
    loadingSummary,
    saving,
    refreshing,
    refresh,
    save,
    loadSummary,
    setStatus,
    bulkMark,
  }
}
