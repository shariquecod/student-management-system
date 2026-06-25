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
import { teacherQuickFilters } from '@/data/teachers-page'
import type { TeacherDirectoryFilters } from '@/types/teacher-page'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

interface TeachersFiltersProps {
  filters: TeacherDirectoryFilters
  onFilterChange: <K extends keyof TeacherDirectoryFilters>(
    key: K,
    value: TeacherDirectoryFilters[K]
  ) => void
  onClear: () => void
  activeFilterCount: number
  departments: string[]
  totalFiltered: number
  total: number
  viewMode: 'table' | 'compact'
  onViewModeChange: (mode: 'table' | 'compact') => void
}

export function TeachersFilters({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
  departments,
  totalFiltered,
  total,
  viewMode,
  onViewModeChange,
}: TeachersFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="teachers-filters space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="teachers-search relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('teachers.searchPlaceholder')}
              className="teachers-search-input pl-9"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Select value={filters.department} onValueChange={(v) => onFilterChange('department', v)}>
              <SelectTrigger className="teachers-filter-select">
                <SelectValue placeholder={t('teachers.fields.department')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('teachers.allDepartments')}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => onFilterChange('status', v)}>
              <SelectTrigger className="teachers-filter-select">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('teachers.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                <SelectItem value="archived">{t('status.archived')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="teachers-view-toggle flex rounded-lg border p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'teachers-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'table' && 'teachers-view-toggle-btn-active'
              )}
              aria-label={t('teachers.tableView')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={cn(
                'teachers-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'compact' && 'teachers-view-toggle-btn-active'
              )}
              aria-label={t('teachers.compactView')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" className="teachers-filter-clear" onClick={onClear}>
              <X className="mr-1 h-3.5 w-3.5" />
              {t('teachers.clearFilters')} ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {teacherQuickFilters.map((chip) => {
            const label = t(chip.labelKey)
            const isActive =
              chip.labelKey === 'teachers.allTeachers'
                ? filters.status === 'all' && filters.department === 'all'
                : chip.patch.status === filters.status
            return (
              <button
                key={chip.labelKey}
                type="button"
                onClick={() => {
                  if (chip.patch.status) onFilterChange('status', chip.patch.status)
                  if (chip.patch.department) onFilterChange('department', chip.patch.department)
                }}
                className={cn(
                  'teachers-filter-chip rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                  `teachers-filter-chip-${chip.accent}`,
                  isActive && 'teachers-filter-chip-active'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t('teachers.showing', { filtered: totalFiltered, total })}</span>
        </div>
      </div>
    </div>
  )
}
