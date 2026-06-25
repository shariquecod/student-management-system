'use client'

import { User, Phone, Mail, Home, Users, StickyNote } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/shared'
import { DetailField } from '@/components/students/detail/detail-field'
import type { StudentTabProps } from './types'
import { format } from 'date-fns'
import { useTranslation } from '@/i18n/use-translation'
import { getStudentNameParts } from '@/i18n/student-display'

export function StudentOverviewTab({ profile, isEditing, draft, onDraftChange }: StudentTabProps) {
  const { student } = profile
  const { locale } = useTranslation()
  const displayName = getStudentNameParts(student, locale)

  return (
    <BentoGrid>
      <BentoCard colSpan={12} accent="students" delay={0}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-students">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
            <p className="text-xs text-muted-foreground">Core identity and contact details</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            label="First name"
            value={isEditing ? draft.firstName : displayName.firstName}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ firstName: v })}
          />
          <DetailField
            label="Last name"
            value={isEditing ? draft.lastName : displayName.lastName}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ lastName: v })}
          />
          <DetailField
            label="Roll number"
            value={isEditing ? draft.rollNumber : student.rollNumber}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ rollNumber: v })}
          />
          <DetailField
            label="Date of birth"
            value={isEditing ? draft.dateOfBirth : student.dateOfBirth}
            isEditing={isEditing}
            type="date"
            onChange={(v) => onDraftChange({ dateOfBirth: v })}
          />
          <DetailField
            label="Email"
            value={isEditing ? draft.email : student.email}
            isEditing={isEditing}
            type="email"
            onChange={(v) => onDraftChange({ email: v })}
          />
          <DetailField
            label="Phone"
            value={isEditing ? draft.phone : student.phone}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ phone: v })}
          />
          <DetailField
            label="Address"
            value={isEditing ? draft.address : student.address}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ address: v })}
            className="sm:col-span-2 lg:col-span-3"
          />
        </div>
      </BentoCard>

      <BentoCard colSpan={6} accent="teachers" delay={60}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-students">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Guardian</h3>
            <p className="text-xs text-muted-foreground">Primary emergency contact</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <DetailField
            label="Name"
            value={isEditing ? draft.guardianName : student.guardian.name}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ guardianName: v })}
          />
          <DetailField
            label="Relation"
            value={isEditing ? draft.guardianRelation : student.guardian.relation}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ guardianRelation: v })}
          />
          <DetailField
            label="Phone"
            value={isEditing ? draft.guardianPhone : student.guardian.phone}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ guardianPhone: v })}
          />
        </div>
      </BentoCard>

      <BentoCard colSpan={6} accent="classes" delay={120}>
        <div className="flex items-start gap-3">
          <div className="dialog-icon-badge dialog-icon-badge-students">
            <StickyNote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Notes</h3>
            <p className="text-xs text-muted-foreground">Administrative remarks</p>
          </div>
        </div>
        {isEditing ? (
          <DetailField
            label="Notes"
            value={draft.notes}
            isEditing
            multiline
            onChange={(v) => onDraftChange({ notes: v })}
            className="mt-4"
          />
        ) : (
          <p className="mt-4 rounded-xl border p-4 text-sm text-muted-foreground">
            {student.notes?.trim() || 'No notes recorded for this student.'}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Enrolled</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {format(new Date(student.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Last updated</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {format(new Date(student.updatedAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </BentoCard>

      <BentoCard colSpan={4} accent="attendance" delay={180}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 text-[hsl(var(--metric-attendance))]" />
          Quick contact
        </div>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {isEditing ? draft.phone : student.phone}
        </p>
        <p className="text-xs text-muted-foreground">{isEditing ? draft.email : student.email}</p>
      </BentoCard>
      <BentoCard colSpan={4} accent="fees" delay={240}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4 text-[hsl(var(--metric-fees))]" />
          Residence
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">
          {isEditing ? draft.address : student.address}
        </p>
      </BentoCard>
      <BentoCard colSpan={4} accent="exams" delay={300}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-[hsl(var(--metric-exams))]" />
          Guardian contact
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">
          {isEditing ? draft.guardianPhone : student.guardian.phone}
        </p>
      </BentoCard>
    </BentoGrid>
  )
}
