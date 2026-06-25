'use client'

import { User, BookOpen, Phone, Mail, StickyNote } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/shared'
import { DetailField } from '@/components/students/detail/detail-field'
import type { Teacher } from '@/types'
import type { TeacherDraft } from '@/lib/teacher-draft'
import { format } from 'date-fns'
import { useTranslation } from '@/i18n/use-translation'

interface TeacherOverviewProps {
  teacher: Teacher
  isEditing: boolean
  draft: TeacherDraft
  onDraftChange: (patch: Partial<TeacherDraft>) => void
}

export function TeacherOverview({ teacher, isEditing, draft, onDraftChange }: TeacherOverviewProps) {
  const { t } = useTranslation()

  return (
    <BentoGrid>
      <BentoCard colSpan={12} accent="teachers" delay={0}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-teachers">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('teachers.fields.personalInfo')}</h3>
            <p className="text-xs text-muted-foreground">{t('teachers.fields.contactInfo')}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            label={t('teachers.fields.firstName')}
            value={isEditing ? draft.firstName : teacher.firstName}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ firstName: v })}
          />
          <DetailField
            label={t('teachers.fields.lastName')}
            value={isEditing ? draft.lastName : teacher.lastName}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ lastName: v })}
          />
          <DetailField
            label={t('teachers.fields.employeeId')}
            value={isEditing ? draft.employeeId : teacher.employeeId}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ employeeId: v })}
          />
          <DetailField
            label={t('teachers.fields.email')}
            value={isEditing ? draft.email : teacher.email}
            isEditing={isEditing}
            type="email"
            onChange={(v) => onDraftChange({ email: v })}
          />
          <DetailField
            label={t('teachers.fields.phone')}
            value={isEditing ? draft.phone : teacher.phone}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ phone: v })}
          />
          <DetailField
            label={t('teachers.fields.joiningDate')}
            value={isEditing ? draft.joiningDate : teacher.joiningDate}
            isEditing={isEditing}
            type="date"
            onChange={(v) => onDraftChange({ joiningDate: v })}
          />
        </div>
      </BentoCard>

      <BentoCard colSpan={6} accent="classes" delay={60}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-teachers">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('teachers.fields.professionalInfo')}</h3>
            <p className="text-xs text-muted-foreground">{t('teachers.fields.department')}</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <DetailField
            label={t('teachers.fields.department')}
            value={isEditing ? draft.department : teacher.department}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ department: v })}
          />
          <DetailField
            label={t('teachers.fields.subjects')}
            value={isEditing ? draft.subjects : teacher.subjects.join(', ')}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ subjects: v })}
          />
        </div>
      </BentoCard>

      <BentoCard colSpan={6} accent="exams" delay={120}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-teachers">
            <StickyNote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('teachers.fields.notes')}</h3>
          </div>
        </div>
        {isEditing ? (
          <DetailField
            label={t('teachers.fields.notes')}
            value={draft.notes}
            isEditing
            multiline
            onChange={(v) => onDraftChange({ notes: v })}
            className="mt-4"
          />
        ) : (
          <p className="mt-4 rounded-xl border p-4 text-sm text-muted-foreground">
            {teacher.notes?.trim() || '—'}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="teacher-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Joined</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {format(new Date(teacher.joiningDate), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="teacher-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Last updated</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {format(new Date(teacher.updatedAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </BentoCard>

      <BentoCard colSpan={6} accent="attendance" delay={180}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 text-[hsl(var(--metric-attendance))]" />
          {t('teachers.fields.phone')}
        </div>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {isEditing ? draft.phone : teacher.phone}
        </p>
      </BentoCard>
      <BentoCard colSpan={6} accent="fees" delay={240}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-[hsl(var(--metric-fees))]" />
          {t('teachers.fields.email')}
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">
          {isEditing ? draft.email : teacher.email}
        </p>
      </BentoCard>
    </BentoGrid>
  )
}
