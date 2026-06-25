'use client'

import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { studentQuickFilters } from '@/data/students-page'
import type { StudentDirectoryFilters } from '@/types/student-page'
import type { SchoolClass } from '@/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'

interface StudentsFiltersProps {
  filters: StudentDirectoryFilters
  onFilterChange: <K extends keyof StudentDirectoryFilters>(
    key: K,
    value: StudentDirectoryFilters[K]
  ) => void
  onClear: () => void
  activeFilterCount: number
  classes: (SchoolClass & { studentCount?: number })[]
  availableYears: number[]
  totalFiltered: number
  total: number
  viewMode: 'table' | 'compact'
  onViewModeChange: (mode: 'table' | 'compact') => void
}

export function StudentsFilters({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
  classes,
  availableYears,
  totalFiltered,
  total,
  viewMode,
  onViewModeChange,
}: StudentsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="students-filters space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="students-search relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('students.searchPlaceholder')}
              className="students-search-input pl-9"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={filters.classId} onValueChange={(v) => onFilterChange('classId', v)}>
              <SelectTrigger className="students-filter-select">
                <SelectValue placeholder={t('common.class')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('students.allClasses')}</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {getTranslatedClassName(c.name, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => onFilterChange('status', v)}>
              <SelectTrigger className="students-filter-select">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('students.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                <SelectItem value="graduated">{t('status.graduated')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.year} onValueChange={(v) => onFilterChange('year', v)}>
              <SelectTrigger className="students-filter-select">
                <SelectValue placeholder={t('common.year')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('students.allYears')}</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="students-view-toggle flex rounded-lg border p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'students-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'table' && 'students-view-toggle-btn-active'
              )}
              aria-label={t('students.tableView')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={cn(
                'students-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'compact' && 'students-view-toggle-btn-active'
              )}
              aria-label={t('students.compactView')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" className="students-filter-clear" onClick={onClear}>
              <X className="mr-1 h-3.5 w-3.5" />
              {t('students.clearFilters')} ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {studentQuickFilters.map((chip) => {
            const label = t(chip.labelKey)
            const isActive =
              chip.labelKey === 'students.allStudents'
                ? filters.status === 'all' && filters.classId === 'all'
                : chip.patch.status === filters.status
            return (
              <button
                key={chip.labelKey}
                type="button"
                onClick={() => {
                  if (chip.patch.status) onFilterChange('status', chip.patch.status)
                  if (chip.patch.classId) onFilterChange('classId', chip.patch.classId)
                }}
                className={cn(
                  'students-filter-chip rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                  `students-filter-chip-${chip.accent}`,
                  isActive && 'students-filter-chip-active'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t('students.showing', { filtered: totalFiltered, total })}</span>
        </div>
      </div>
    </div>
  )
}
