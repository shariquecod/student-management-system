'use client'

import { BookOpen, CalendarDays, School } from 'lucide-react'
import { BentoCard, BentoGrid, StatusBadge } from '@/components/shared'
import { DetailField } from '@/components/students/detail/detail-field'
import type { StudentTabProps } from './types'
import { getClassName } from './types'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { StudentStatus } from '@/types'

export function StudentAcademicTab({
  profile,
  isEditing,
  draft,
  onDraftChange,
  classes,
}: StudentTabProps) {
  const { student } = profile
  const className = isEditing ? getClassName(classes, draft.classId, student.className) : student.className

  return (
    <BentoGrid>
      <BentoCard colSpan={4} accent="students" delay={0}>
        <div className="flex items-start gap-3">
          <div
            className="metric-stat-icon flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ '--stat-accent': 'var(--metric-students)' } as React.CSSProperties}
          >
            <School className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Current class</p>
            {isEditing ? (
              <Select value={draft.classId} onValueChange={(v) => onDraftChange({ classId: v })}>
                <SelectTrigger className="students-form-input mt-1 h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xl font-bold text-foreground">{className}</p>
            )}
          </div>
        </div>
      </BentoCard>
      <BentoCard colSpan={4} accent="classes" delay={60}>
        <div className="flex items-start gap-3">
          <div
            className="metric-stat-icon flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ '--stat-accent': 'var(--metric-classes)' } as React.CSSProperties}
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Academic year</p>
            {isEditing ? (
              <Input
                type="number"
                className="students-form-input mt-1 h-9 text-xl font-bold"
                value={draft.year}
                onChange={(e) => onDraftChange({ year: Number(e.target.value) || draft.year })}
              />
            ) : (
              <p className="text-xl font-bold text-foreground">{student.year}</p>
            )}
          </div>
        </div>
      </BentoCard>
      <BentoCard colSpan={4} accent="exams" delay={120}>
        <div className="flex items-start gap-3">
          <div
            className="metric-stat-icon flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ '--stat-accent': 'var(--metric-exams)' } as React.CSSProperties}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Enrollment status</p>
            <div className="mt-1">
              {isEditing ? (
                <Select
                  value={draft.status}
                  onValueChange={(v) => onDraftChange({ status: v as StudentStatus })}
                >
                  <SelectTrigger className="students-form-input h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <StatusBadge status={student.status} />
              )}
            </div>
          </div>
        </div>
      </BentoCard>

      <BentoCard colSpan={12} delay={180}>
        <h3 className="text-sm font-semibold text-foreground">Academic record</h3>
        <p className="mt-1 text-xs text-muted-foreground">Class placement and enrollment timeline</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailField
            label="Class section"
            value={className}
            isEditing={false}
          />
          <DetailField
            label="Roll number"
            value={isEditing ? draft.rollNumber : student.rollNumber}
            isEditing={isEditing}
            onChange={(v) => onDraftChange({ rollNumber: v })}
          />
          <DetailField
            label="Cohort year"
            value={String(isEditing ? draft.year : student.year)}
            isEditing={isEditing}
            type="number"
            onChange={(v) => onDraftChange({ year: Number(v) || draft.year })}
          />
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</p>
            <div className="mt-1">
              {isEditing ? (
                <Select
                  value={draft.status}
                  onValueChange={(v) => onDraftChange({ status: v as StudentStatus })}
                >
                  <SelectTrigger className="students-form-input h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <StatusBadge status={student.status} />
              )}
            </div>
          </div>
        </div>
        {!isEditing && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/classes/${student.classId}`}
              className="student-detail-link-chip inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium"
            >
              View class details
            </Link>
            <span className="text-xs text-muted-foreground">
              Enrolled {format(new Date(student.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  )
}
