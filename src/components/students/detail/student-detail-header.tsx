'use client'

import { ChevronLeft, Pencil, X, Check } from 'lucide-react'
import type { Student, SchoolClass } from '@/types'
import type { StudentDraft } from '@/lib/student-draft'
import { getDraftDisplayName } from '@/lib/student-draft'
import { StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/i18n/use-translation'
import { getStudentDisplayName, getStudentDisplayInitials } from '@/i18n/student-display'

interface StudentDetailHeaderProps {
  student: Student
  draft: StudentDraft
  isEditing: boolean
  saving?: boolean
  onBack: () => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDraftChange: (patch: Partial<StudentDraft>) => void
}

export function StudentDetailHeader({
  student,
  draft,
  isEditing,
  saving,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDraftChange,
}: StudentDetailHeaderProps) {
  const { t, locale } = useTranslation()
  const displayName = isEditing
    ? getDraftDisplayName(draft)
    : getStudentDisplayName(student, locale)
  const initials = isEditing
    ? getStudentDisplayInitials(
        { firstName: draft.firstName || 'S', lastName: draft.lastName || 'T' },
        locale
      )
    : getStudentDisplayInitials(student, locale)

  return (
    <div className="student-detail-header relative overflow-hidden rounded-2xl border p-4 sm:p-5">
      <div className="student-detail-header-mesh pointer-events-none" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={onBack}
            aria-label={t('common.back')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="students-avatar flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={isEditing ? draft.status : student.status} />
              <span className="students-accent-pill students-accent-pill-students">{t('students.profileBadge')}</span>
            </div>
            {isEditing ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  className="students-form-input h-9 text-base font-bold"
                  value={draft.firstName}
                  placeholder={t('students.fields.firstName')}
                  onChange={(e) => onDraftChange({ firstName: e.target.value })}
                />
                <Input
                  className="students-form-input h-9 text-base font-bold"
                  value={draft.lastName}
                  placeholder={t('students.fields.lastName')}
                  onChange={(e) => onDraftChange({ lastName: e.target.value })}
                />
              </div>
            ) : (
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{displayName}</h1>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              Roll {isEditing ? draft.rollNumber : student.rollNumber} · {student.className} · {t('common.year')}{' '}
              {isEditing ? draft.year : student.year}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
                <X className="mr-1.5 h-4 w-4" />
                {t('common.cancel')}
              </Button>
              <Button type="button" onClick={onSave} disabled={saving}>
                <Check className="mr-1.5 h-4 w-4" />
                {saving ? t('common.saving') : t('common.save')}
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={onEdit}>
              <Pencil className="mr-1.5 h-4 w-4" />
              {t('common.edit')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
