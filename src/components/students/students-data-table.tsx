'use client'

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from 'lucide-react'
import type { Student } from '@/types'
import type { StudentSortDirection, StudentSortField } from '@/types/student-page'
import { getStudentDisplayName, getStudentDisplayInitials } from '@/i18n/student-display'
import { StatusBadge } from '@/components/shared'
import { StudentsCompactSkeleton, StudentsTableSkeleton } from '@/components/students/students-skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'
import {
  getTranslatedClassName,
  getTranslatedGuardianName,
  getTranslatedRelation,
} from '@/i18n/student-display'

interface StudentsDataTableProps {
  students: Student[]
  loading?: boolean
  refreshing?: boolean
  sortField: StudentSortField
  sortDirection: StudentSortDirection
  onSort: (field: StudentSortField) => void
  onView: (student: Student) => void
  onDelete: (student: Student) => void
  page: number
  totalPages: number
  totalFiltered: number
  pageSize: number
  onPageChange: (page: number) => void
  viewMode: 'table' | 'compact'
}

const sortableColumns: { field: StudentSortField; labelKey: string; className?: string }[] = [
  { field: 'name', labelKey: 'common.student' },
  { field: 'rollNumber', labelKey: 'common.rollNo' },
  { field: 'className', labelKey: 'common.class', className: 'hidden md:table-cell' },
  { field: 'status', labelKey: 'common.status' },
]

function handleRowKeyDown(event: React.KeyboardEvent, onActivate: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate()
  }
}

function StudentRowActions({
  student,
  onView,
  onDelete,
  t,
  locale,
}: {
  student: Student
  onView: (student: Student) => void
  onDelete: (student: Student) => void
  t: (key: string, params?: Record<string, string | number>) => string
  locale: 'en' | 'ur'
}) {
  const fullName = getStudentDisplayName(student, locale)

  return (
    <div
      className="students-table-actions flex items-center justify-end gap-0.5"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        className="students-table-action h-8 w-8"
        aria-label={t('students.viewStudent', { name: fullName })}
        onClick={() => onView(student)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="students-table-action students-table-action-delete h-8 w-8"
        aria-label={t('students.deleteStudentAction', { name: fullName })}
        onClick={() => onDelete(student)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: StudentSortField
  sortField: StudentSortField
  sortDirection: StudentSortDirection
}) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-[hsl(var(--metric-students))]" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-[hsl(var(--metric-students))]" />
  )
}

export function StudentsDataTable({
  students,
  loading,
  refreshing,
  sortField,
  sortDirection,
  onSort,
  onView,
  onDelete,
  page,
  totalPages,
  totalFiltered,
  pageSize,
  onPageChange,
  viewMode,
}: StudentsDataTableProps) {
  const { t, locale } = useTranslation()
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalFiltered)
  const showSkeleton = loading && students.length === 0

  if (viewMode === 'compact') {
    return (
      <div className="space-y-3">
        <div
          className={cn('students-compact-grid', refreshing && 'opacity-60 pointer-events-none')}
          key={page}
          aria-busy={loading || undefined}
        >
          {showSkeleton ? (
            <div className="col-span-full">
              <StudentsCompactSkeleton rows={pageSize} />
            </div>
          ) : students.length === 0 ? (
            <div className="students-table-empty col-span-full">{t('students.noStudentsMatch')}</div>
          ) : (
            students.map((student, index) => (
            <div
              key={student.id}
              role="button"
              tabIndex={0}
              className="students-compact-card students-compact-card-clickable students-list-item-enter group cursor-pointer"
              style={{ animationDelay: `${index * 55}ms` }}
              onClick={() => onView(student)}
              onKeyDown={(e) => handleRowKeyDown(e, () => onView(student))}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="students-avatar flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
                    {getStudentDisplayInitials(student, locale)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {getStudentDisplayName(student, locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                  </div>
                </div>
                <StatusBadge status={student.status} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>{getTranslatedClassName(student.className, t)}</p>
                <p className="truncate">{student.email}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <StudentRowActions student={student} onView={onView} onDelete={onDelete} t={t} locale={locale} />
              </div>
            </div>
            ))
          )}
        </div>
        <div className="students-table-shell overflow-hidden rounded-xl border">
          <StudentsPagination
            page={page}
            totalPages={totalPages}
            start={start}
            end={end}
            totalFiltered={totalFiltered}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'students-table-shell overflow-hidden rounded-xl border',
        refreshing && 'opacity-60 pointer-events-none'
      )}
      aria-busy={loading || undefined}
    >
      <table className="students-table w-full">
          <thead>
            <tr className="students-table-head">
              {sortableColumns.map((col) => (
                <th key={col.field} className={col.className}>
                  <button
                    type="button"
                    className="students-table-sort-btn"
                    onClick={() => onSort(col.field)}
                    disabled={loading}
                  >
                    {t(col.labelKey)}
                    <SortIcon field={col.field} sortField={sortField} sortDirection={sortDirection} />
                  </button>
                </th>
              ))}
              <th className="hidden lg:table-cell">{t('common.contact')}</th>
              <th className="hidden xl:table-cell">{t('common.guardian')}</th>
              <th className="w-[4.5rem] text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody key={page}>
            {showSkeleton ? (
              <StudentsTableSkeleton rows={pageSize} />
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="students-table-empty">
                  {t('students.noStudentsMatch')}
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr
                  key={student.id}
                  tabIndex={0}
                  className="students-table-row students-table-row-clickable students-list-item-enter group cursor-pointer"
                  style={{ animationDelay: `${index * 55}ms` }}
                  onClick={() => onView(student)}
                  onKeyDown={(e) => handleRowKeyDown(e, () => onView(student))}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="students-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                        {getStudentDisplayInitials(student, locale)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {getStudentDisplayName(student, locale)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{t('common.year')} {student.year}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="students-roll-badge font-mono text-xs">{student.rollNumber}</span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="students-class-pill text-xs">
                      {getTranslatedClassName(student.className, t)}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="text-xs">
                      <p className="truncate text-foreground">{student.email}</p>
                      <p className="text-muted-foreground">{student.phone}</p>
                    </div>
                  </td>
                  <td className="hidden xl:table-cell">
                    <div className="text-xs">
                      <p className="truncate text-foreground">
                        {getTranslatedGuardianName(student.guardian.name, t, student, locale)}
                      </p>
                      <p className="text-muted-foreground">
                        {getTranslatedRelation(student.guardian.relation, t)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <StudentRowActions student={student} onView={onView} onDelete={onDelete} t={t} locale={locale} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      <StudentsPagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        totalFiltered={totalFiltered}
        onPageChange={onPageChange}
      />
    </div>
  )
}

function StudentsPagination({
  page,
  totalPages,
  start,
  end,
  totalFiltered,
  onPageChange,
}: {
  page: number
  totalPages: number
  start: number
  end: number
  totalFiltered: number
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="students-pagination flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {totalFiltered === 0
          ? t('students.noResults')
          : t('students.showingRange', { start, end, total: totalFiltered })}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
          const pageNum = i + 1
          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'default' : 'outline'}
              size="sm"
              className={cn('h-8 w-8 p-0 text-xs', pageNum === page && 'students-page-btn-active')}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
