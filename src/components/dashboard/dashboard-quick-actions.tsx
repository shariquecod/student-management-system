'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, GraduationCap, Users, Wallet } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

const links = [
  { href: '/students/new', labelKey: 'students.addStudent', icon: GraduationCap, accent: '--metric-students' },
  { href: '/teachers', labelKey: 'nav.teachers', icon: Users, accent: '--metric-teachers' },
  { href: '/classes', labelKey: 'nav.classes', icon: BookOpen, accent: '--metric-classes' },
  { href: '/fees', labelKey: 'nav.feesPayments', icon: Wallet, accent: '--metric-fees' },
]

export function DashboardQuickActions() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{t('dashboard.quickActions')}</h3>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="dashboard-quick-link group flex items-center gap-2.5 rounded-xl p-3 transition-all"
            style={{ '--qa-accent': `var(${link.accent})` } as React.CSSProperties}
          >
            <div className="dashboard-quick-link-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <link.icon className="h-4 w-4" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">{t(link.labelKey)}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  )
}
