'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { FileText, BookOpen, Users, Award } from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  ExamsHero,
  ExamsFilters,
  ExamsDataTable,
  ExamsStatSkeleton,
} from '@/components/exams'
import type { ExamFormValues } from '@/components/exams'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useExamsDirectory } from '@/hooks/use-exams-directory'
import { useExamsMarks } from '@/hooks/use-exams-marks'
import { createExam } from '@/services/school-api'
import type { Exam, ExamResult } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

const ExamsMarksPanel = dynamic(
  () => import('@/components/exams/exams-marks-panel').then((m) => m.ExamsMarksPanel),
  { loading: () => <div className="dashboard-skeleton h-40 rounded-xl" /> }
)

const ExamsResultsPanel = dynamic(
  () => import('@/components/exams/exams-results-panel').then((m) => m.ExamsResultsPanel),
  { loading: () => <div className="dashboard-skeleton h-40 rounded-xl" /> }
)

const ExamsCreateDialog = dynamic(
  () => import('@/components/exams/exams-create-dialog').then((m) => m.ExamsCreateDialog),
  { ssr: false }
)

const ExamsResultDialog = dynamic(
  () => import('@/components/exams/exams-result-dialog').then((m) => m.ExamsResultDialog),
  { ssr: false }
)

export default function ExamsPage() {
  const { t } = useTranslation()
  const directory = useExamsDirectory()
  const {
    allExams,
    initialLoading,
    refreshing,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    sortField,
    sortDirection,
    toggleSort,
    stats,
    availableTerms,
    paginatedExams,
    page,
    setPage,
    totalPages,
    pageSize,
    totalFiltered,
    reload,
  } = directory

  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('exams')
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table')
  const [viewResult, setViewResult] = useState<ExamResult | null>(null)

  const marksEnabled = activeTab !== 'exams' || dialogOpen
  const {
    classes: markClasses,
    selectedExam,
    setSelectedExam,
    selectedClass,
    setSelectedClass,
    students,
    marks: markValues,
    results,
    selectedExamData,
    passCount,
    loadingRoster,
    saving,
    saveMarks,
    handleMarkChange,
    enterMarks,
  } = useExamsMarks({ allExams, enabled: marksEnabled, t })

  const handleCreateExam = useCallback(async (values: ExamFormValues) => {
    await createExam({
      name: values.name,
      term: values.term,
      academicYear: values.academicYear,
      classIds: values.classIds,
      subjects: values.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      maxScore: values.maxScore,
      passScore: values.passScore,
    })
    toast.success(t('exams.created'))
    await reload()
  }, [reload, t])

  const handleEnterMarks = useCallback((exam: Exam) => {
    enterMarks(exam)
    setActiveTab('marks')
  }, [enterMarks])

  const handleSaveMarks = useCallback(async () => {
    const saved = await saveMarks()
    if (saved) setActiveTab('results')
  }, [saveMarks])

  return (
    <div className="dashboard-shell exams-page space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <ExamsHero
            total={stats.total}
            subjects={stats.subjects}
            onRefresh={reload}
            onCreate={() => setDialogOpen(true)}
            refreshing={refreshing}
          />
        </BentoCard>

        {initialLoading ? (
          <ExamsStatSkeleton />
        ) : (
          <>
            <BentoCard colSpan={3} accent="exams" delay={60}>
              <AnimatedStat
                title={t('exams.totalExams')}
                value={stats.total}
                icon={FileText}
                accent="exams"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="classes" delay={120}>
              <AnimatedStat
                title={t('exams.totalSubjects')}
                value={stats.subjects}
                icon={BookOpen}
                accent="classes"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="teachers" delay={180}>
              <AnimatedStat
                title={t('exams.linkedClasses')}
                value={stats.classes}
                icon={Users}
                accent="teachers"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="attendance" delay={240}>
              <AnimatedStat
                title={t('exams.passedStudents')}
                value={passCount}
                icon={Award}
                accent="attendance"
                compact
              />
            </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="exams-tabs">
            <TabsList className="exams-tabs-list mb-4">
              <TabsTrigger value="exams" className="exams-tab-trigger">
                {t('exams.tabExams')}
              </TabsTrigger>
              <TabsTrigger value="marks" className="exams-tab-trigger">
                {t('exams.tabMarks')}
              </TabsTrigger>
              <TabsTrigger value="results" className="exams-tab-trigger">
                {t('exams.tabResults')}
              </TabsTrigger>
            </TabsList>

            {activeTab === 'exams' && (
              <>
                <ExamsFilters
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClear={clearFilters}
                  activeFilterCount={activeFilterCount}
                  availableTerms={availableTerms}
                  totalFiltered={totalFiltered}
                  total={stats.total}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                <div className="mt-4">
                  <ExamsDataTable
                    exams={paginatedExams}
                    loading={initialLoading}
                    refreshing={refreshing}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    onEnterMarks={handleEnterMarks}
                    page={page}
                    totalPages={totalPages}
                    totalFiltered={totalFiltered}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    viewMode={viewMode}
                  />
                </div>
              </>
            )}

            {activeTab === 'marks' && (
              <ExamsMarksPanel
                exams={allExams}
                classes={markClasses}
                selectedExam={selectedExam}
                selectedClass={selectedClass}
                students={students}
                marks={markValues}
                exam={selectedExamData}
                loading={initialLoading || loadingRoster}
                saving={saving}
                onExamChange={setSelectedExam}
                onClassChange={setSelectedClass}
                onMarkChange={handleMarkChange}
                onSave={handleSaveMarks}
              />
            )}

            {activeTab === 'results' && (
              <ExamsResultsPanel
                results={results}
                loading={loadingRoster}
                onView={setViewResult}
              />
            )}
          </Tabs>
        </BentoCard>
      </BentoGrid>

      {dialogOpen && (
        <ExamsCreateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          classes={markClasses}
          onSubmit={handleCreateExam}
        />
      )}

      {viewResult && (
        <ExamsResultDialog result={viewResult} onClose={() => setViewResult(null)} />
      )}
    </div>
  )
}
