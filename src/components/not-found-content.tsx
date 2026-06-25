'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

export function NotFoundContent() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-10 text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">{t('common.notFoundTitle')}</h1>
        <p className="text-muted-foreground mt-2 mb-6">{t('common.notFoundDescription')}</p>
        <Link href="/dashboard">
          <Button>{t('common.backToDashboard')}</Button>
        </Link>
      </div>
    </div>
  )
}
