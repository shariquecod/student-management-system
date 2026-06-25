'use client'

import dynamic from 'next/dynamic'
import { BentoGrid, BentoCard } from '@/components/shared'
import {
  AttendanceHero,
  AttendanceRecordPanel,
  AttendanceStatSkeleton,
  AttendanceStatsCards,
} from '@/components/attendance'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAttendancePage } from '@/hooks/use-attendance-page'
import { useTranslation } from '@/i18n/use-translation'

const AttendanceHistoryPanel = dynamic(
  () =>
    import('@/components/attendance/attendance-history-panel').then((mod) => ({
      default: mod.AttendanceHistoryPanel,
    })),
  { ssr: false }
)

export default function AttendancePage() {
  const { t } = useTranslation()
  const {
    classes,
    classId,
    setClassId,
    date,
    setDate,
    students,
    statuses,
    summary,
    histClass,
    setHistClass,
    histStudent,
    setHistStudent,
    tab,
    setTab,
    stats,
    rosterLoading,
    loadingSummary,
    saving,
    refreshing,
    refresh,
    save,
    loadSummary,
    setStatus,
    bulkMark,
  } = useAttendancePage()

  return (
    <div className="dashboard-shell attendance-page space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <AttendanceHero
            present={stats.present}
            total={stats.total}
            onRefresh={refresh}
            onSave={save}
            refreshing={refreshing}
            saving={saving}
          />
        </BentoCard>

        {rosterLoading ? <AttendanceStatSkeleton /> : <AttendanceStatsCards stats={stats} />}

        <BentoCard colSpan={12} delay={300}>
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as 'record' | 'history')}
            className="attendance-tabs"
          >
            <TabsList className="attendance-tabs-list mb-4">
              <TabsTrigger value="record" className="attendance-tab-trigger">
                {t('attendance.record')}
              </TabsTrigger>
              <TabsTrigger value="history" className="attendance-tab-trigger">
                {t('attendance.history')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="record">
              {tab === 'record' && (
                <AttendanceRecordPanel
                  date={date}
                  classId={classId}
                  classes={classes}
                  students={students}
                  statuses={statuses}
                  stats={stats}
                  loading={rosterLoading}
                  onDateChange={setDate}
                  onClassChange={setClassId}
                  onStatusChange={setStatus}
                  onBulkMark={bulkMark}
                />
              )}
            </TabsContent>

            <TabsContent value="history">
              {tab === 'history' && (
                <AttendanceHistoryPanel
                  histClass={histClass}
                  histStudent={histStudent}
                  classes={classes}
                  summary={summary}
                  loading={loadingSummary}
                  onClassChange={setHistClass}
                  onStudentChange={setHistStudent}
                  onLoad={loadSummary}
                />
              )}
            </TabsContent>
          </Tabs>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}
