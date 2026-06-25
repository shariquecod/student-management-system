'use client'

import type { FeeCategory } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

interface FeesCategoriesPanelProps {
  categories: FeeCategory[]
  loading?: boolean
}

export function FeesCategoriesPanel({ categories, loading }: FeesCategoriesPanelProps) {
  const { t } = useTranslation()
  const showSkeleton = loading && categories.length === 0

  return (
    <div className="students-table-shell overflow-hidden rounded-xl border">
      <table className="students-table w-full">
        <thead>
          <tr className="students-table-head">
            <th>{t('fees.category')}</th>
            <th>{t('fees.categoryDescription')}</th>
            <th className="text-right">{t('fees.defaultAmount')}</th>
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="students-table-row">
                  <td><div className="dashboard-skeleton h-3 w-24 rounded" /></td>
                  <td><div className="dashboard-skeleton h-3 w-40 rounded" /></td>
                  <td><div className="dashboard-skeleton ml-auto h-3 w-16 rounded" /></td>
                </tr>
              ))}
            </>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="students-table-empty">
                {t('fees.noCategories')}
              </td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c.id} className="students-table-row">
                <td className="font-medium text-foreground">{c.name}</td>
                <td className="text-muted-foreground">{c.description ?? '—'}</td>
                <td className="text-right tabular-nums font-medium">
                  ${c.defaultAmount.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
