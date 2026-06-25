'use client'

import { FileText, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/use-translation'

interface ExamsHeroProps {
  total: number
  subjects: number
  onRefresh: () => void
  onCreate: () => void
  refreshing?: boolean
}

export function ExamsHero({
  total,
  subjects,
  onRefresh,
  onCreate,
  refreshing,
}: ExamsHeroProps) {
  const { t } = useTranslation()

  return (
    <div className="exams-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
      <div className="exams-hero-mesh pointer-events-none" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="exams-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <FileText className="h-3 w-3" />
            {t('exams.registry')}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('exams.heroTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('exams.heroSubtitle', { total, subjects })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="exams-hero-btn"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button size="sm" className="exams-hero-primary" onClick={onCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t('exams.addExam')}
          </Button>
        </div>
      </div>
    </div>
  )
}
