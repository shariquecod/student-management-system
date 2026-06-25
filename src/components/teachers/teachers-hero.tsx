'use client'

import Link from 'next/link'
import { Users, UserPlus, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/use-translation'

interface TeachersHeroProps {
  total: number
  active: number
  onRefresh: () => void
  refreshing?: boolean
}

export function TeachersHero({ total, active, onRefresh, refreshing }: TeachersHeroProps) {
  const { t } = useTranslation()

  return (
    <div className="teachers-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
      <div className="teachers-hero-mesh pointer-events-none" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="teachers-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <Users className="h-3 w-3" />
            {t('teachers.registry')}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('teachers.heroTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {t('teachers.heroSubtitle', { active, total })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="teachers-hero-btn"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm" className="teachers-hero-btn">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {t('common.export')}
          </Button>
          <Button size="sm" className="teachers-hero-primary" asChild>
            <Link href="/teachers/new">
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              {t('teachers.addTeacher')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
