'use client'

import Link from 'next/link'
import { GraduationCap, UserPlus, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/use-translation'

interface StudentsHeroProps {
  total: number
  active: number
  onRefresh: () => void
  refreshing?: boolean
}

export function StudentsHero({
  total,
  active,
  onRefresh,
  refreshing,
}: StudentsHeroProps) {
  const { t } = useTranslation()

  return (
    <div className="students-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
      <div className="students-hero-mesh pointer-events-none" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="students-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <GraduationCap className="h-3 w-3" />
            {t('students.registry')}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('students.heroTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('students.heroSubtitle', { active, total })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="students-hero-btn"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm" className="students-hero-btn">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {t('common.export')}
          </Button>
          <Button size="sm" className="students-hero-primary" asChild>
            <Link href="/students/new">
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              {t('students.addStudent')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
