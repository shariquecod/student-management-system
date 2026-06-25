'use client'

import { useMemo } from 'react'
import { BarChart3, History, Search, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AttendanceSummary, SchoolClass } from '@/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'

interface AttendanceHistoryPanelProps {
  histClass: string
  histStudent: string
  classes: SchoolClass[]
  summary: AttendanceSummary[]
  loading?: boolean
  onClassChange: (classId: string) => void
  onStudentChange: (studentId: string) => void
  onLoad: () => void
}

function ratePercent(row: AttendanceSummary) {
  if (row.total <= 0) return 0
  return Math.round((row.present / row.total) * 100)
}

export function AttendanceHistoryPanel({
  histClass,
  histStudent,
  classes,
  summary,
  loading,
  onClassChange,
  onStudentChange,
  onLoad,
}: AttendanceHistoryPanelProps) {
  const { t } = useTranslation()

  const aggregates = useMemo(() => {
    return summary.reduce(
      (acc, row) => ({
        present: acc.present + row.present,
        absent: acc.absent + row.absent,
        late: acc.late + row.late,
        total: acc.total + row.total,
        students: acc.students + 1,
      }),
      { present: 0, absent: 0, late: 0, total: 0, students: 0 }
    )
  }, [summary])

  const avgRate =
    aggregates.total > 0 ? Math.round((aggregates.present / aggregates.total) * 100) : 0

  const hasData = summary.length > 0

  return (
    <div className="attendance-history space-y-5">
      <div className="attendance-history-sidebar grid gap-5 lg:grid-cols-[minmax(0,17rem)_1fr]">
        <aside className="attendance-history-filters rounded-2xl border p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="attendance-history-filter-icon flex h-9 w-9 items-center justify-center rounded-xl">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t('attendance.historyFilters')}</p>
              <p className="text-[11px] text-muted-foreground">{t('attendance.historyFiltersHint')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('common.class')}
              </label>
              <Select value={histClass} onValueChange={onClassChange}>
                <SelectTrigger className="attendance-history-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('attendance.allClasses')}</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {getTranslatedClassName(c.name, t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('attendance.studentIdOptional')}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('attendance.studentIdPlaceholder')}
                  value={histStudent}
                  onChange={(e) => onStudentChange(e.target.value)}
                  className="attendance-history-input pl-9"
                />
              </div>
            </div>
            <Button
              onClick={onLoad}
              disabled={loading}
              className="attendance-history-load w-full"
            >
              {loading ? t('attendance.loadingSummary') : t('attendance.loadSummary')}
            </Button>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          {loading ? (
            <div className="attendance-history-stats grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="attendance-history-stat-card rounded-2xl border p-4">
                  <div className="dashboard-skeleton mb-2 h-3 w-16 rounded" />
                  <div className="dashboard-skeleton h-7 w-12 rounded" />
                </div>
              ))}
            </div>
          ) : hasData ? (
            <div className="attendance-history-stats grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="attendance-history-stat-card attendance-history-stat-rate rounded-2xl border p-4">
                <p className="text-[11px] font-medium text-muted-foreground">{t('attendance.avgRate')}</p>
                <p className="mt-1 flex items-end gap-1 text-2xl font-bold tabular-nums text-foreground">
                  {avgRate}
                  <span className="mb-0.5 text-sm font-medium text-muted-foreground">%</span>
                </p>
              </div>
              <div className="attendance-history-stat-card attendance-history-stat-present rounded-2xl border p-4">
                <p className="text-[11px] font-medium text-muted-foreground">{t('dashboard.present')}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregates.present}</p>
              </div>
              <div className="attendance-history-stat-card attendance-history-stat-absent rounded-2xl border p-4">
                <p className="text-[11px] font-medium text-muted-foreground">{t('dashboard.absent')}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregates.absent}</p>
              </div>
              <div className="attendance-history-stat-card attendance-history-stat-late rounded-2xl border p-4">
                <p className="text-[11px] font-medium text-muted-foreground">{t('attendance.late')}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{aggregates.late}</p>
              </div>
            </div>
          ) : (
            <div className="attendance-history-empty rounded-2xl border p-10 text-center lg:min-h-[14rem] lg:flex lg:flex-col lg:items-center lg:justify-center">
              <div className="attendance-history-empty-icon mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                <History className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">{t('attendance.noSummary')}</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                {t('attendance.noSummaryHint')}
              </p>
            </div>
          )}

          {!loading && hasData && (
            <div className="attendance-history-list space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{t('attendance.studentBreakdown')}</p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {t('attendance.studentsLoaded', { count: aggregates.students })}
                </span>
              </div>

              {summary.map((row, index) => {
                const rate = ratePercent(row)
                const presentPct = row.total > 0 ? (row.present / row.total) * 100 : 0
                const absentPct = row.total > 0 ? (row.absent / row.total) * 100 : 0
                const latePct = row.total > 0 ? (row.late / row.total) * 100 : 0

                return (
                  <div
                    key={row.studentId}
                    className={cn(
                      'attendance-history-row students-list-item-enter rounded-2xl border p-4',
                      rate >= 90 && 'attendance-history-row-good',
                      rate < 75 && rate > 0 && 'attendance-history-row-warn'
                    )}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{row.studentName}</p>
                        <p className="text-[11px] text-muted-foreground">{row.rollNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="attendance-history-rate-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums">
                          {rate}%
                        </div>
                        <div className="text-right text-[11px] tabular-nums text-muted-foreground">
                          <p>{t('attendance.total')}: {row.total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="attendance-history-bar-present h-full transition-all duration-500"
                        style={{ width: `${presentPct}%` }}
                      />
                      <div
                        className="attendance-history-bar-absent h-full transition-all duration-500"
                        style={{ width: `${absentPct}%` }}
                      />
                      <div
                        className="attendance-history-bar-late h-full transition-all duration-500"
                        style={{ width: `${latePct}%` }}
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                      <span className="attendance-history-legend attendance-history-legend-present">
                        {t('dashboard.present')}: {row.present}
                      </span>
                      <span className="attendance-history-legend attendance-history-legend-absent">
                        {t('dashboard.absent')}: {row.absent}
                      </span>
                      <span className="attendance-history-legend attendance-history-legend-late">
                        {t('attendance.late')}: {row.late}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
