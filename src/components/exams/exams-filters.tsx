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
import type { ExamDirectoryFilters } from '@/types/exam-page'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

interface ExamsFiltersProps {
  filters: ExamDirectoryFilters
  onFilterChange: <K extends keyof ExamDirectoryFilters>(
    key: K,
    value: ExamDirectoryFilters[K]
  ) => void
  onClear: () => void
  activeFilterCount: number
  availableTerms: string[]
  totalFiltered: number
  total: number
  viewMode: 'table' | 'compact'
  onViewModeChange: (mode: 'table' | 'compact') => void
}

export function ExamsFilters({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
  availableTerms,
  totalFiltered,
  total,
  viewMode,
  onViewModeChange,
}: ExamsFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="exams-filters space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="exams-search relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('exams.searchPlaceholder')}
              className="exams-search-input pl-9"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <Select value={filters.term} onValueChange={(v) => onFilterChange('term', v)}>
            <SelectTrigger className="exams-filter-select w-full sm:w-40">
              <SelectValue placeholder={t('exams.term')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('exams.allTerms')}</SelectItem>
              {availableTerms.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="exams-view-toggle flex rounded-lg border p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'exams-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'table' && 'exams-view-toggle-btn-active'
              )}
              aria-label={t('exams.tableView')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={cn(
                'exams-view-toggle-btn rounded-md p-1.5 transition-colors',
                viewMode === 'compact' && 'exams-view-toggle-btn-active'
              )}
              aria-label={t('exams.compactView')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" className="exams-filter-clear" onClick={onClear}>
              <X className="mr-1 h-3.5 w-3.5" />
              {t('exams.clearFilters')} ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{t('exams.showing', { filtered: totalFiltered, total })}</span>
      </div>
    </div>
  )
}
