'use client'

import { Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import type { ExamResult } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

interface ExamsResultsPanelProps {
  results: ExamResult[]
  loading?: boolean
  onView: (result: ExamResult) => void
}

export function ExamsResultsPanel({ results, loading, onView }: ExamsResultsPanelProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="students-table-shell rounded-xl border p-8">
        <div className="dashboard-skeleton mx-auto h-4 w-48 rounded" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="exams-results-empty rounded-2xl border p-10 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
        <p className="mt-3 text-sm font-medium text-foreground">{t('exams.noResults')}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t('exams.noResultsHint')}</p>
      </div>
    )
  }

  const passCount = results.filter((r) => r.status === 'pass').length
  const passRate = Math.round((passCount / results.length) * 100)

  return (
    <div className="space-y-4">
      <div className="exams-results-stats grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="exams-results-stat-card rounded-2xl border p-4">
          <p className="text-[11px] font-medium text-muted-foreground">{t('exams.studentsGraded')}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{results.length}</p>
        </div>
        <div className="exams-results-stat-card exams-results-stat-pass rounded-2xl border p-4">
          <p className="text-[11px] font-medium text-muted-foreground">{t('exams.passedStudents')}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{passCount}</p>
        </div>
        <div className="exams-results-stat-card exams-results-stat-rate col-span-2 rounded-2xl border p-4 sm:col-span-1">
          <p className="text-[11px] font-medium text-muted-foreground">{t('exams.passRate')}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{passRate}%</p>
        </div>
      </div>

      <div className="students-table-shell overflow-x-auto rounded-xl border">
        <table className="students-table w-full">
          <thead>
            <tr className="students-table-head">
              <th>{t('common.student')}</th>
              <th>{t('exams.total')}</th>
              <th>{t('exams.percentage')}</th>
              <th>{t('common.status')}</th>
              <th className="text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => (
              <tr
                key={r.id}
                className="students-table-row students-list-item-enter"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <td className="font-medium">{r.studentName}</td>
                <td className="tabular-nums">
                  {r.total}/{r.maxTotal}
                </td>
                <td className="tabular-nums">{r.percentage}%</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="exams-hero-btn"
                    onClick={() => onView(r)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    {t('common.view')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
