'use client'

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Archive,
} from 'lucide-react'
import type { Teacher } from '@/types'
import type { TeacherSortDirection, TeacherSortField } from '@/types/teacher-page'
import { getTeacherDisplayName, getTeacherInitials } from '@/lib/teacher-draft'
import { StatusBadge } from '@/components/shared'
import { TeachersCompactSkeleton, TeachersTableSkeleton } from '@/components/teachers/teachers-skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

interface TeachersDataTableProps {
  teachers: Teacher[]
  loading?: boolean
  refreshing?: boolean
  sortField: TeacherSortField
  sortDirection: TeacherSortDirection
  onSort: (field: TeacherSortField) => void
  onView: (teacher: Teacher) => void
  onArchive: (teacher: Teacher) => void
  page: number
  totalPages: number
  totalFiltered: number
  pageSize: number
  onPageChange: (page: number) => void
  viewMode: 'table' | 'compact'
}

const sortableColumns: { field: TeacherSortField; labelKey: string; className?: string }[] = [
  { field: 'name', labelKey: 'common.name' },
  { field: 'employeeId', labelKey: 'teachers.fields.employeeId' },
  { field: 'department', labelKey: 'teachers.fields.department', className: 'hidden md:table-cell' },
  { field: 'status', labelKey: 'common.status' },
]

function handleRowKeyDown(event: React.KeyboardEvent, onActivate: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate()
  }
}

function TeacherRowActions({
  teacher,
  onView,
  onArchive,
  t,
}: {
  teacher: Teacher
  onView: (teacher: Teacher) => void
  onArchive: (teacher: Teacher) => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const fullName = getTeacherDisplayName(teacher.firstName, teacher.lastName)

  return (
    <div
      className="teachers-table-actions flex items-center justify-end gap-0.5"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        className="teachers-table-action h-8 w-8"
        aria-label={t('teachers.viewTeacher', { name: fullName })}
        onClick={() => onView(teacher)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="teachers-table-action teachers-table-action-delete h-8 w-8"
        aria-label={t('teachers.archiveTeacherAction', { name: fullName })}
        onClick={() => onArchive(teacher)}
      >
        <Archive className="h-4 w-4" />
      </Button>
    </div>
  )
}

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: TeacherSortField
  sortField: TeacherSortField
  sortDirection: TeacherSortDirection
}) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-[hsl(var(--metric-teachers))]" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-[hsl(var(--metric-teachers))]" />
  )
}

export function TeachersDataTable({
  teachers,
  loading,
  refreshing,
  sortField,
  sortDirection,
  onSort,
  onView,
  onArchive,
  page,
  totalPages,
  totalFiltered,
  pageSize,
  onPageChange,
  viewMode,
}: TeachersDataTableProps) {
  const { t } = useTranslation()
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalFiltered)
  const showSkeleton = loading && teachers.length === 0

  if (viewMode === 'compact') {
    return (
      <div className="space-y-3">
        <div
          className={cn('teachers-compact-grid', refreshing && 'opacity-60 pointer-events-none')}
          key={page}
          aria-busy={loading || undefined}
        >
          {showSkeleton ? (
            <div className="col-span-full">
              <TeachersCompactSkeleton rows={pageSize} />
            </div>
          ) : teachers.length === 0 ? (
            <div className="teachers-table-empty col-span-full">{t('teachers.noTeachersMatch')}</div>
          ) : (
            teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                role="button"
                tabIndex={0}
                className="teachers-compact-card teachers-compact-card-clickable teachers-list-item-enter group cursor-pointer"
                style={{ animationDelay: `${index * 55}ms` }}
                onClick={() => onView(teacher)}
                onKeyDown={(e) => handleRowKeyDown(e, () => onView(teacher))}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="teachers-avatar flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
                      {getTeacherInitials(teacher.firstName, teacher.lastName)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {getTeacherDisplayName(teacher.firstName, teacher.lastName)}
                      </p>
                      <p className="text-xs text-muted-foreground">{teacher.employeeId}</p>
                    </div>
                  </div>
                  <StatusBadge status={teacher.status === 'archived' ? 'archived' : teacher.status} />
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>{teacher.department}</p>
                  <p className="truncate">{teacher.email}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <TeacherRowActions teacher={teacher} onView={onView} onArchive={onArchive} t={t} />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="teachers-table-shell overflow-hidden rounded-xl border">
          <TeachersPagination
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
        'teachers-table-shell overflow-hidden rounded-xl border',
        refreshing && 'opacity-60 pointer-events-none'
      )}
      aria-busy={loading || undefined}
    >
      <table className="teachers-table w-full">
        <thead>
          <tr className="teachers-table-head">
            {sortableColumns.map((col) => (
              <th key={col.field} className={col.className}>
                <button
                  type="button"
                  className="teachers-table-sort-btn"
                  onClick={() => onSort(col.field)}
                  disabled={loading}
                >
                  {t(col.labelKey)}
                  <SortIcon field={col.field} sortField={sortField} sortDirection={sortDirection} />
                </button>
              </th>
            ))}
            <th className="hidden lg:table-cell">{t('common.contact')}</th>
            <th className="hidden xl:table-cell">{t('teachers.fields.subjects')}</th>
            <th className="w-[4.5rem] text-right">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody key={page}>
          {showSkeleton ? (
            <TeachersTableSkeleton rows={pageSize} />
          ) : teachers.length === 0 ? (
            <tr>
              <td colSpan={7} className="teachers-table-empty">
                {t('teachers.noTeachersMatch')}
              </td>
            </tr>
          ) : (
            teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                tabIndex={0}
                className="teachers-table-row teachers-table-row-clickable teachers-list-item-enter group cursor-pointer"
                style={{ animationDelay: `${index * 55}ms` }}
                onClick={() => onView(teacher)}
                onKeyDown={(e) => handleRowKeyDown(e, () => onView(teacher))}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="teachers-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                      {getTeacherInitials(teacher.firstName, teacher.lastName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {getTeacherDisplayName(teacher.firstName, teacher.lastName)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{teacher.department}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="teachers-id-badge font-mono text-xs">{teacher.employeeId}</span>
                </td>
                <td className="hidden md:table-cell">
                  <span className="teachers-dept-pill text-xs">{teacher.department}</span>
                </td>
                <td>
                  <StatusBadge status={teacher.status === 'archived' ? 'archived' : teacher.status} />
                </td>
                <td className="hidden lg:table-cell">
                  <div className="text-xs">
                    <p className="truncate text-foreground">{teacher.email}</p>
                    <p className="text-muted-foreground">{teacher.phone}</p>
                  </div>
                </td>
                <td className="hidden xl:table-cell">
                  <p className="truncate text-xs text-muted-foreground">{teacher.subjects.join(', ')}</p>
                </td>
                <td>
                  <TeacherRowActions teacher={teacher} onView={onView} onArchive={onArchive} t={t} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <TeachersPagination
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

function TeachersPagination({
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
    <div className="teachers-pagination flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {totalFiltered === 0
          ? t('teachers.noResults')
          : t('teachers.showingRange', { start, end, total: totalFiltered })}
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
              className={cn('h-8 w-8 p-0 text-xs', pageNum === page && 'teachers-page-btn-active')}
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
