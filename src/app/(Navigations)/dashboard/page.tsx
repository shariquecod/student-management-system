'use client'

import { useEffect, useState } from 'react'
import {
  GraduationCap,
  Users,
  BookOpen,
  Wallet,
  FileText,
  ClipboardCheck,
} from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  DashboardHero,
  DashboardEnrollmentChart,
  DashboardActivityFeed,
  DashboardAttendanceGauge,
  DashboardQuickActions,
  DashboardSkeleton,
} from '@/components/dashboard'
import { getDashboardStats } from '@/services/school-api'
import type { DashboardData } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return <DashboardSkeleton />
  }

  const { stats, enrollmentTrend, recentActivities } = data

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className='!p-0'>
          <DashboardHero />
        </BentoCard>

        <BentoCard colSpan={3} accent="students" delay={60}>
          <AnimatedStat
            title={t('dashboard.totalStudents')}
            value={stats.totalStudents}
            icon={GraduationCap}
            accent="students"
            trend={8}
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="teachers" delay={120}>
          <AnimatedStat
            title={t('dashboard.totalTeachers')}
            value={stats.totalTeachers}
            icon={Users}
            accent="teachers"
            trend={4}
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="classes" delay={180}>
          <AnimatedStat
            title={t('dashboard.activeClasses')}
            value={stats.totalClasses}
            icon={BookOpen}
            accent="classes"
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="fees" delay={240}>
          <AnimatedStat
            title={t('dashboard.feesThisMonth')}
            value={stats.feesCollectedThisMonth}
            icon={Wallet}
            accent="fees"
            prefix="$"
            trend={15}
            compact
          />
        </BentoCard>

        <BentoCard colSpan={8} rowSpan={2} delay={300}>
          <DashboardEnrollmentChart data={enrollmentTrend} />
        </BentoCard>
        <BentoCard colSpan={4} accent="attendance" delay={360}>
          <DashboardAttendanceGauge rate={stats.attendanceRateToday} />
        </BentoCard>
        <BentoCard colSpan={4} accent="exams" delay={420}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: 'hsl(var(--metric-exams) / 0.12)',
                  color: 'hsl(var(--metric-exams))',
                }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('dashboard.upcomingExams')}</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">3</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                t('dashboard.midTermScience'),
                t('dashboard.mathFinals'),
                t('dashboard.englishOral'),
              ].map((exam) => (
                <div
                  key={exam}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs dark:bg-muted/20"
                >
                  <span className="font-medium text-foreground">{exam}</span>
                  <span className="text-muted-foreground">{t('common.soon')}</span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={7} rowSpan={2} delay={480}>
          <DashboardActivityFeed activities={recentActivities} />
        </BentoCard>
        <BentoCard colSpan={5} delay={540}>
          <DashboardQuickActions />
        </BentoCard>
        <BentoCard colSpan={5} accent="attendance" delay={600}>
          <div className="flex h-full items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: 'hsl(var(--metric-attendance) / 0.12)',
                color: 'hsl(var(--metric-attendance))',
              }}
            >
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.attendanceStatus')}</p>
              <p className="text-lg font-semibold text-foreground">
                {stats.attendanceRateToday >= 90 ? t('common.onTrack') : t('common.needsReview')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.studentsAcrossClasses', {
                  students: stats.totalStudents,
                  classes: stats.totalClasses,
                })}
              </p>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}
