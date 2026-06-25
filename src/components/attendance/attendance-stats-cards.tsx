'use client'

import { ClipboardCheck, Clock, UserCheck, UserX } from 'lucide-react'
import { BentoCard, AnimatedStat } from '@/components/shared'
import { useTranslation } from '@/i18n/use-translation'

interface AttendanceStatsCardsProps {
  stats: { total: number; present: number; absent: number; late: number }
}

export function AttendanceStatsCards({ stats }: AttendanceStatsCardsProps) {
  const { t } = useTranslation()

  return (
    <>
      <BentoCard colSpan={3} accent="attendance" delay={60}>
        <AnimatedStat
          title={t('attendance.roster')}
          value={stats.total}
          icon={ClipboardCheck}
          accent="attendance"
          compact
        />
      </BentoCard>
      <BentoCard colSpan={3} accent="classes" delay={120}>
        <AnimatedStat
          title={t('dashboard.present')}
          value={stats.present}
          icon={UserCheck}
          accent="classes"
          compact
        />
      </BentoCard>
      <BentoCard colSpan={3} accent="fees" delay={180}>
        <AnimatedStat
          title={t('dashboard.absent')}
          value={stats.absent}
          icon={UserX}
          accent="fees"
          compact
        />
      </BentoCard>
      <BentoCard colSpan={3} accent="exams" delay={240}>
        <AnimatedStat
          title={t('attendance.late')}
          value={stats.late}
          icon={Clock}
          accent="exams"
          compact
        />
      </BentoCard>
    </>
  )
}
