'use client'

import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ClassDirectoryFilters } from '@/types/class-page'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

interface ClassesFiltersProps {
  filters: ClassDirectoryFilters
  onFilterChange: <K extends keyof ClassDirectoryFilters>(
    key: K,
    value: ClassDirectoryFilters[K]
  ) => void
  onClear: () => void
  activeFilterCount: number
  availableGrades: string[]
  totalFiltered: number
  total: number
  viewMode: 'table' | 'compact'
  onViewModeChange: (mode: 'table' | 'compact') => void
}

export function ClassesFilters({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
  availableGrades,
  totalFiltered,
  total,
  viewMode,
  onViewModeChange,
}: ClassesFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="classes-filters space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="classes-search relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('classes.searchPlaceholder')}
              className="classes-search-input pl-9"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <Select value={filters.grade} onValueChange={(v) => onFilterChange('grade', v)}>
            <SelectTrigger className="classes-filter-select w-full sm:w-40">
              <SelectValue placeholder={t('classes.grade')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('classes.allGrades')}</SelectItem>
              {availableGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="classes-view-toggle flex rounded-lg border p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'classes-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'table' && 'classes-view-toggle-btn-active'
              )}
              aria-label={t('classes.tableView')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={cn(
                'classes-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'compact' && 'classes-view-toggle-btn-active'
              )}
              aria-label={t('classes.compactView')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" className="classes-filter-clear" onClick={onClear}>
              <X className="mr-1 h-3.5 w-3.5" />
              {t('classes.clearFilters')} ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{t('classes.showing', { filtered: totalFiltered, total })}</span>
      </div>
    </div>
  )
}
