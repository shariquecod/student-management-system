'use client'

import type { RecentActivity } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Activity, BookOpen, ClipboardCheck, GraduationCap, Users, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

const activityConfig: Record<
  RecentActivity['type'],
  { icon: LucideIcon; accent: string }
> = {
  student_added: { icon: GraduationCap, accent: '--metric-students' },
  teacher_added: { icon: Users, accent: '--metric-teachers' },
  attendance_updated: { icon: ClipboardCheck, accent: '--metric-attendance' },
  exam_results: { icon: BookOpen, accent: '--metric-exams' },
  payment_received: { icon: Wallet, accent: '--metric-fees' },
}

interface DashboardActivityFeedProps {
  activities: RecentActivity[]
}

export function DashboardActivityFeed({ activities }: DashboardActivityFeedProps) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full min-h-[240px] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t('dashboard.recentActivity')}</h3>
          <p className="text-xs text-muted-foreground">{t('dashboard.latestSchoolEvents')}</p>
        </div>
      </div>
      <ul className="flex-1 space-y-1 overflow-auto pr-1">
        {activities.map((act, i) => {
          const config = activityConfig[act.type]
          const Icon = config.icon
          return (
            <li
              key={act.id}
              className="dashboard-activity-item group flex gap-3 rounded-xl p-2.5 transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `hsl(var(${config.accent}) / 0.12)`,
                  color: `hsl(var(${config.accent}))`,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground">{act.message}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
