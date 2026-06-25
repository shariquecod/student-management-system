'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/shared'
import type { StudentFeeSummary } from '@/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'
import { FeesTableSkeleton } from './fees-skeleton'

interface FeesBalancesPanelProps {
  summaries: StudentFeeSummary[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  overdueOnly: boolean
  onOverdueOnlyChange: (value: boolean) => void
  onPay: (summary: StudentFeeSummary) => void
  page: number
  totalPages: number
  totalFiltered: number
  start: number
  end: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function FeesBalancesPanel({
  summaries,
  loading,
  search,
  onSearchChange,
  overdueOnly,
  onOverdueOnlyChange,
  onPay,
  page,
  totalPages,
  totalFiltered,
  start,
  end,
  pageSize,
  onPageChange,
}: FeesBalancesPanelProps) {
  const { t } = useTranslation()
  const showSkeleton = loading && totalFiltered === 0 && summaries.length === 0

  return (
    <div className="fees-balances space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="fees-search relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('fees.searchPlaceholder')}
            className="fees-input pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t('fees.showing', { count: totalFiltered })}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOverdueOnlyChange(false)}
          className={cn(
            'fees-filter-chip rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
            !overdueOnly && 'fees-filter-chip-active'
          )}
        >
          {t('fees.allAccounts')}
        </button>
        <button
          type="button"
          onClick={() => onOverdueOnlyChange(true)}
          className={cn(
            'fees-filter-chip rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
            overdueOnly && 'fees-filter-chip-active'
          )}
        >
          {t('fees.overdueOnly')}
        </button>
      </div>

      <div className="students-table-shell overflow-hidden rounded-xl border">
        <table className="students-table w-full">
          <thead>
            <tr className="students-table-head">
              <th>{t('common.student')}</th>
              <th>{t('common.class')}</th>
              <th>{t('fees.due')}</th>
              <th>{t('fees.paid')}</th>
              <th>{t('fees.balance')}</th>
              <th className="hidden md:table-cell">{t('fees.lastPayment')}</th>
              <th className="w-[5rem] text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody key={page}>
            {showSkeleton ? (
              <FeesTableSkeleton rows={pageSize} />
            ) : summaries.length === 0 ? (
              <tr>
                <td colSpan={7} className="students-table-empty">
                  {t('fees.noAccountsMatch')}
                </td>
              </tr>
            ) : (
              summaries.map((s) => (
                <tr
                  key={s.studentId}
                  className={cn(
                    'students-table-row',
                    s.isOverdue && s.balance > 0 && 'fees-table-row-overdue'
                  )}
                >
                  <td>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{s.studentName}</p>
                      <p className="text-[11px] text-muted-foreground">{s.rollNumber}</p>
                    </div>
                  </td>
                  <td>
                    <span className="students-class-pill text-xs">
                      {getTranslatedClassName(s.className, t)}
                    </span>
                  </td>
                  <td className="tabular-nums">${s.totalDue.toLocaleString()}</td>
                  <td className="tabular-nums">${s.totalPaid.toLocaleString()}</td>
                  <td
                    className={cn(
                      'tabular-nums font-semibold',
                      s.balance > 0 ? 'text-[hsl(var(--metric-fees))]' : 'text-foreground'
                    )}
                  >
                    ${s.balance.toLocaleString()}
                  </td>
                  <td className="hidden md:table-cell text-muted-foreground">
                    {s.lastPaymentDate ?? '—'}
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="fees-pay-btn h-8"
                        disabled={s.balance <= 0}
                        onClick={() => onPay(s)}
                      >
                        {t('fees.pay')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          totalFiltered={totalFiltered}
          onPageChange={onPageChange}
          emptyLabelKey="fees.noResults"
          rangeLabelKey="fees.showingRange"
        />
      </div>
    </div>
  )
}
