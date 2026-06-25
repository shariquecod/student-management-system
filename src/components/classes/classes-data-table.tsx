'use client'

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  BookOpen,
} from 'lucide-react'
import type { SchoolClass } from '@/types'
import type { ClassSortDirection, ClassSortField } from '@/types/class-page'
import { ClassesCompactSkeleton, ClassesTableSkeleton } from '@/components/classes/classes-skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'

type ClassWithCount = SchoolClass & { studentCount?: number }

interface ClassesDataTableProps {
  classes: ClassWithCount[]
  loading?: boolean
  refreshing?: boolean
  sortField: ClassSortField
  sortDirection: ClassSortDirection
  onSort: (field: ClassSortField) => void
  onView: (cls: ClassWithCount) => void
  onDelete: (cls: ClassWithCount) => void
  page: number
  totalPages: number
  totalFiltered: number
  pageSize: number
  onPageChange: (page: number) => void
  viewMode: 'table' | 'compact'
}

const sortableColumns: { field: ClassSortField; labelKey: string; className?: string }[] = [
  { field: 'name', labelKey: 'classes.className' },
  { field: 'grade', labelKey: 'classes.grade' },
  { field: 'section', labelKey: 'classes.section', className: 'hidden md:table-cell' },
  { field: 'studentCount', labelKey: 'classes.students' },
  { field: 'homeroomTeacherName', labelKey: 'classes.homeroom', className: 'hidden lg:table-cell' },
]

function handleRowKeyDown(event: React.KeyboardEvent, onActivate: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate()
  }
}

function ClassRowActions({
  cls,
  onView,
  onDelete,
  t,
}: {
  cls: ClassWithCount
  onView: (cls: ClassWithCount) => void
  onDelete: (cls: ClassWithCount) => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
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
        aria-label={t('classes.viewClass', { name: cls.name })}
        onClick={() => onView(cls)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="students-table-action students-table-action-delete h-8 w-8"
        aria-label={t('classes.deleteClassAction', { name: cls.name })}
        onClick={() => onDelete(cls)}
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
  field: ClassSortField
  sortField: ClassSortField
  sortDirection: ClassSortDirection
}) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-[hsl(var(--metric-classes))]" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-[hsl(var(--metric-classes))]" />
  )
}

function getStudentCount(cls: ClassWithCount) {
  return cls.studentCount ?? cls.studentIds.length
}

export function ClassesDataTable({
  classes,
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
}: ClassesDataTableProps) {
  const { t } = useTranslation()
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalFiltered)
  const showSkeleton = loading && classes.length === 0

  if (viewMode === 'compact') {
    return (
      <div className="space-y-3">
        <div
          className={cn('students-compact-grid', refreshing && 'pointer-events-none opacity-60')}
          key={page}
          aria-busy={loading || undefined}
        >
          {showSkeleton ? (
            <div className="col-span-full">
              <ClassesCompactSkeleton rows={pageSize} />
            </div>
          ) : classes.length === 0 ? (
            <div className="students-table-empty col-span-full">{t('classes.noClassesMatch')}</div>
          ) : (
            classes.map((cls, index) => (
              <div
                key={cls.id}
                role="button"
                tabIndex={0}
                className="students-compact-card students-compact-card-clickable students-list-item-enter group cursor-pointer"
                style={{ animationDelay: `${index * 55}ms` }}
                onClick={() => onView(cls)}
                onKeyDown={(e) => handleRowKeyDown(e, () => onView(cls))}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="classes-avatar flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {getTranslatedClassName(cls.name, t)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('classes.grade')} {cls.grade} · {cls.section}
                      </p>
                    </div>
                  </div>
                  <span className="classes-count-pill text-xs">
                    {getStudentCount(cls)} {t('classes.students')}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>{cls.homeroomTeacherName}</p>
                  <p className="truncate">{cls.scheduleSummary}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <ClassRowActions cls={cls} onView={onView} onDelete={onDelete} t={t} />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="students-table-shell overflow-hidden rounded-xl border">
          <ClassesPagination
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
        refreshing && 'pointer-events-none opacity-60'
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
            <th className="hidden xl:table-cell">{t('classes.schedule')}</th>
            <th className="w-[4.5rem] text-right">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody key={page}>
          {showSkeleton ? (
            <ClassesTableSkeleton rows={pageSize} />
          ) : classes.length === 0 ? (
            <tr>
              <td colSpan={7} className="students-table-empty">
                {t('classes.noClassesMatch')}
              </td>
            </tr>
          ) : (
            classes.map((cls, index) => (
              <tr
                key={cls.id}
                tabIndex={0}
                className="students-table-row students-table-row-clickable students-list-item-enter group cursor-pointer"
                style={{ animationDelay: `${index * 55}ms` }}
                onClick={() => onView(cls)}
                onKeyDown={(e) => handleRowKeyDown(e, () => onView(cls))}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="classes-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {getTranslatedClassName(cls.name, t)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{cls.scheduleSummary}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="students-roll-badge font-mono text-xs">{cls.grade}</span>
                </td>
                <td className="hidden md:table-cell">
                  <span className="students-class-pill text-xs">{cls.section}</span>
                </td>
                <td>
                  <span className="classes-count-pill text-xs">{getStudentCount(cls)}</span>
                </td>
                <td className="hidden lg:table-cell">
                  <span className="truncate text-xs text-foreground">{cls.homeroomTeacherName}</span>
                </td>
                <td className="hidden xl:table-cell">
                  <span className="truncate text-xs text-muted-foreground">{cls.scheduleSummary}</span>
                </td>
                <td>
                  <ClassRowActions cls={cls} onView={onView} onDelete={onDelete} t={t} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ClassesPagination
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

function ClassesPagination({
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
          ? t('classes.noResults')
          : t('classes.showingRange', { start, end, total: totalFiltered })}
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
              className={cn('h-8 w-8 p-0 text-xs', pageNum === page && 'classes-page-btn-active')}
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
