'use client'

import { BookOpen, Plus, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/use-translation'

interface ClassesHeroProps {
  total: number
  totalStudents: number
  onRefresh: () => void
  onAdd: () => void
  refreshing?: boolean
}

export function ClassesHero({
  total,
  totalStudents,
  onRefresh,
  onAdd,
  refreshing,
}: ClassesHeroProps) {
  const { t } = useTranslation()

  return (
    <div className="classes-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
      <div className="classes-hero-mesh pointer-events-none" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="classes-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <BookOpen className="h-3 w-3" />
            {t('classes.registry')}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('classes.heroTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('classes.heroSubtitle', { total, students: totalStudents })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="classes-hero-btn"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm" className="classes-hero-btn">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {t('common.export')}
          </Button>
          <Button size="sm" className="classes-hero-primary" onClick={onAdd}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t('classes.addClass')}
          </Button>
        </div>
      </div>
    </div>
  )
}
