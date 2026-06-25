'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, UserCheck, UserX, Archive } from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  TeachersHero,
  TeachersFilters,
  TeachersDataTable,
  TeachersArchiveDialog,
  TeachersStatSkeleton,
} from '@/components/teachers'
import { useTeachersDirectory } from '@/hooks/use-teachers-directory'
import { deleteTeacher } from '@/services/school-api'
import type { Teacher } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function TeachersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
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
    paginatedTeachers,
    page,
    setPage,
    totalPages,
    pageSize,
    totalFiltered,
    departments,
    reload,
  } = useTeachersDirectory()

  const [archiveTarget, setArchiveTarget] = useState<Teacher | null>(null)
  const [archiving, setArchiving] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table')

  const openView = (teacher: Teacher) => {
    router.push(`/teachers/${teacher.id}`)
  }

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return
    setArchiving(true)
    try {
      await deleteTeacher(archiveTarget.id)
      toast.success(t('teachers.archived'))
      setArchiveTarget(null)
      reload()
    } catch {
      toast.error(t('teachers.archiveFailedShort'))
      throw new Error('archive failed')
    } finally {
      setArchiving(false)
    }
  }

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <TeachersHero
            total={stats.total}
            active={stats.active}
            onRefresh={reload}
            refreshing={refreshing}
          />
        </BentoCard>

        {initialLoading ? (
          <TeachersStatSkeleton />
        ) : (
          <>
            <BentoCard colSpan={3} accent="teachers" delay={60}>
              <AnimatedStat
                title={t('teachers.totalTeachers')}
                value={stats.total}
                icon={Users}
                accent="teachers"
                trend={4}
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="classes" delay={120}>
              <AnimatedStat
                title={t('teachers.active')}
                value={stats.active}
                icon={UserCheck}
                accent="classes"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="fees" delay={180}>
              <AnimatedStat
                title={t('teachers.inactive')}
                value={stats.inactive}
                icon={UserX}
                accent="fees"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="exams" delay={240}>
              <AnimatedStat
                title={t('teachers.archived')}
                value={stats.archived}
                icon={Archive}
                accent="exams"
                compact
              />
            </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          <TeachersFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
            departments={departments}
            totalFiltered={totalFiltered}
            total={stats.total}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <div className="mt-4">
            <TeachersDataTable
              teachers={paginatedTeachers}
              loading={initialLoading}
              refreshing={refreshing}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onView={openView}
              onArchive={setArchiveTarget}
              page={page}
              totalPages={totalPages}
              totalFiltered={totalFiltered}
              pageSize={pageSize}
              onPageChange={setPage}
              viewMode={viewMode}
            />
          </div>
        </BentoCard>
      </BentoGrid>

      <TeachersArchiveDialog
        teacher={archiveTarget}
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null)
        }}
        onConfirm={handleConfirmArchive}
        loading={archiving}
      />
    </div>
  )
}
