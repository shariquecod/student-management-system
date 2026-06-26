'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  UserCheck,
  UserX,
  Award,
} from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  StudentsHero,
  StudentsFilters,
  StudentsDataTable,
  StudentsDeleteDialog,
  StudentsStatSkeleton,
} from '@/components/students'
import { useStudentsDirectory } from '@/hooks/use-students-directory'
import { deleteStudentApi } from '@/services/student-api'
import type { Student } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function StudentsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    classes,
    initialLoading,
    refreshing,
    error,
    filters,
    searchInput,
    setSearchInput,
    applySearch,
    clearSearch,
    searchHighlight,
    updateFilter,
    clearFilters,
    activeFilterCount,
    sortField,
    sortDirection,
    toggleSort,
    stats,
    paginatedStudents,
    page,
    setPage,
    totalPages,
    pageSize,
    totalFiltered,
    availableYears,
    reload,
  } = useStudentsDirectory()

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table')

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const openView = (student: Student) => {
    router.push(`/students/${student.id}`)
  }

  const openDelete = (student: Student) => {
    setDeleteTarget(student)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteStudentApi(deleteTarget.id)
      toast.success(t('students.deleted'))
      setDeleteTarget(null)
      reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('students.deleteFailedShort'))
      throw new Error('delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <StudentsHero
            total={stats.total}
            active={stats.active}
            onRefresh={reload}
            refreshing={refreshing}
          />
        </BentoCard>

        {initialLoading ? (
          <StudentsStatSkeleton />
        ) : (
          <>
        <BentoCard colSpan={3} accent="students" delay={60}>
          <AnimatedStat
            title={t('students.totalStudents')}
            value={stats.total}
            icon={GraduationCap}
            accent="students"
            trend={8}
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="classes" delay={120}>
          <AnimatedStat
            title={t('students.active')}
            value={stats.active}
            icon={UserCheck}
            accent="classes"
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="fees" delay={180}>
          <AnimatedStat
            title={t('students.inactive')}
            value={stats.inactive}
            icon={UserX}
            accent="fees"
            compact
          />
        </BentoCard>
        <BentoCard colSpan={3} accent="exams" delay={240}>
          <AnimatedStat
            title={t('students.graduated')}
            value={stats.graduated}
            icon={Award}
            accent="exams"
            compact
          />
        </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          <StudentsFilters
            filters={filters}
            searchInput={searchInput}
            searchHighlight={searchHighlight}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={applySearch}
            onSearchClear={clearSearch}
            onFilterChange={updateFilter}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
            classes={classes}
            availableYears={availableYears}
            totalFiltered={totalFiltered}
            total={stats.total}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <div className="mt-4">
            <StudentsDataTable
              students={paginatedStudents}
              loading={initialLoading}
              refreshing={refreshing}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onView={openView}
              onDelete={openDelete}
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

      <StudentsDeleteDialog
        student={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  )
}
