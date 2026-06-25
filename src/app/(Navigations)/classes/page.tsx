'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Users, GraduationCap, Calendar } from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  ClassesHero,
  ClassesFilters,
  ClassesDataTable,
  ClassesFormDialog,
  ClassesDeleteDialog,
  ClassesStatSkeleton,
} from '@/components/classes'
import { useClassesDirectory } from '@/hooks/use-classes-directory'
import { createClass, deleteClass, fetchTeachers } from '@/services/school-api'
import type { SchoolClass, Teacher } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

type ClassWithCount = SchoolClass & { studentCount?: number }

export default function ClassesPage() {
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
    paginatedClasses,
    page,
    setPage,
    totalPages,
    pageSize,
    totalFiltered,
    availableGrades,
    reload,
  } = useClassesDirectory()

  const [deleteTarget, setDeleteTarget] = useState<ClassWithCount | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    fetchTeachers({ limit: 50 })
      .then((res) => setTeachers(res.data))
      .catch(console.error)
  }, [])

  const openView = (cls: ClassWithCount) => {
    router.push(`/classes/${cls.id}`)
  }

  const handleCreate = async (values: {
    name: string
    grade: string
    section: string
    homeroomTeacherId: string
    scheduleSummary: string
  }) => {
    try {
      await createClass({
        ...values,
        studentIds: [],
        subjectTeacherIds: [],
        timetable: [],
      })
      toast.success(t('classes.created'))
      reload()
    } catch {
      toast.error(t('classes.createFailed'))
      throw new Error('create failed')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteClass(deleteTarget.id)
      toast.success(t('classes.deleted'))
      setDeleteTarget(null)
      reload()
    } catch {
      toast.error(t('classes.deleteFailed'))
      throw new Error('delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="classes-page dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <ClassesHero
            total={stats.total}
            totalStudents={stats.totalStudents}
            onRefresh={reload}
            refreshing={refreshing}
            onAdd={() => setDialogOpen(true)}
          />
        </BentoCard>

        {initialLoading ? (
          <ClassesStatSkeleton />
        ) : (
          <>
            <BentoCard colSpan={3} accent="classes" delay={60}>
              <AnimatedStat
                title={t('classes.totalClasses')}
                value={stats.total}
                icon={BookOpen}
                accent="classes"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="students" delay={120}>
              <AnimatedStat
                title={t('classes.enrolledStudents')}
                value={stats.totalStudents}
                icon={Users}
                accent="students"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="teachers" delay={180}>
              <AnimatedStat
                title={t('classes.avgClassSize')}
                value={stats.avgSize}
                icon={GraduationCap}
                accent="teachers"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="attendance" delay={240}>
              <AnimatedStat
                title={t('classes.withHomeroom')}
                value={stats.withHomeroom}
                icon={Calendar}
                accent="attendance"
                compact
              />
            </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          <ClassesFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
            availableGrades={availableGrades}
            totalFiltered={totalFiltered}
            total={stats.total}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <div className="mt-4">
            <ClassesDataTable
              classes={paginatedClasses}
              loading={initialLoading}
              refreshing={refreshing}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onView={openView}
              onDelete={setDeleteTarget}
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

      <ClassesFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teachers={teachers}
        onSubmit={handleCreate}
      />

      <ClassesDeleteDialog
        target={deleteTarget}
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
