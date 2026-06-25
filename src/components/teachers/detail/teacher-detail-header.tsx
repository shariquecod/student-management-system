'use client'

import { ChevronLeft, Pencil, X, Check } from 'lucide-react'
import type { Teacher } from '@/types'
import type { TeacherDraft } from '@/lib/teacher-draft'
import { getTeacherDisplayName, getTeacherInitials } from '@/lib/teacher-draft'
import { StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/i18n/use-translation'
import { mainCardShadow } from '@/utils/theme'
import { cn } from '@/lib/utils'

interface TeacherDetailHeaderProps {
  teacher: Teacher
  draft: TeacherDraft
  isEditing: boolean
  saving?: boolean
  onBack: () => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDraftChange: (patch: Partial<TeacherDraft>) => void
}

export function TeacherDetailHeader({
  teacher,
  draft,
  isEditing,
  saving,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDraftChange,
}: TeacherDetailHeaderProps) {
  const { t } = useTranslation()
  const displayName = isEditing
    ? getTeacherDisplayName(draft.firstName, draft.lastName)
    : getTeacherDisplayName(teacher.firstName, teacher.lastName)
  const initials = isEditing
    ? getTeacherInitials(draft.firstName || 'T', draft.lastName || 'E')
    : getTeacherInitials(teacher.firstName, teacher.lastName)

  return (
    <div className={cn('teacher-detail-header relative rounded-2xl border p-4 sm:p-5', mainCardShadow)}>
      <div className="teacher-detail-header-mesh pointer-events-none overflow-hidden rounded-[inherit]" aria-hidden />
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
          <div className="teachers-avatar flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={isEditing ? draft.status : teacher.status} />
              <span className="teachers-accent-pill teachers-accent-pill-teachers">
                {t('teachers.profileBadge')}
              </span>
            </div>
            {isEditing ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  className="teachers-form-input h-9 text-base font-bold"
                  value={draft.firstName}
                  placeholder={t('teachers.fields.firstName')}
                  onChange={(e) => onDraftChange({ firstName: e.target.value })}
                />
                <Input
                  className="teachers-form-input h-9 text-base font-bold"
                  value={draft.lastName}
                  placeholder={t('teachers.fields.lastName')}
                  onChange={(e) => onDraftChange({ lastName: e.target.value })}
                />
              </div>
            ) : (
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{displayName}</h1>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing ? draft.employeeId : teacher.employeeId} · {isEditing ? draft.department : teacher.department}
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
