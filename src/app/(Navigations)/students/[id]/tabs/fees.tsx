'use client'

import { BentoCard, BentoGrid } from '@/components/shared'
import type { StudentProfileData } from '@/types'
import { format } from 'date-fns'

interface StudentFeesTabProps {
  profile: StudentProfileData
}

export function StudentFeesTab({ profile }: StudentFeesTabProps) {
  const { feeSummary } = profile

  if (!feeSummary) {
    return (
      <BentoGrid>
        <BentoCard colSpan={12}>
          <p className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
            No fee records found for this student.
          </p>
        </BentoCard>
      </BentoGrid>
    )
  }

  return (
    <BentoGrid>
      <BentoCard colSpan={3} accent="fees" delay={0}>
        <p className="text-xs text-muted-foreground">Total due</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          ${feeSummary.totalDue.toLocaleString()}
        </p>
      </BentoCard>
      <BentoCard colSpan={3} accent="classes" delay={60}>
        <p className="text-xs text-muted-foreground">Paid</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          ${feeSummary.totalPaid.toLocaleString()}
        </p>
      </BentoCard>
      <BentoCard colSpan={3} accent="exams" delay={120}>
        <p className="text-xs text-muted-foreground">Balance</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          ${feeSummary.balance.toLocaleString()}
        </p>
      </BentoCard>
      <BentoCard colSpan={3} accent="attendance" delay={180}>
        <p className="text-xs text-muted-foreground">Status</p>
        <p className="mt-1 text-lg font-semibold text-foreground">
          {feeSummary.isOverdue ? 'Overdue' : 'On track'}
        </p>
      </BentoCard>

      <BentoCard colSpan={12} delay={240}>
        <h3 className="text-sm font-semibold text-foreground">Payment summary</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Student</p>
            <p className="mt-1 text-sm font-medium text-foreground">{feeSummary.studentName}</p>
          </div>
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Roll number</p>
            <p className="mt-1 text-sm font-medium text-foreground">{feeSummary.rollNumber}</p>
          </div>
          <div className="student-detail-info-item rounded-xl border p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Class</p>
            <p className="mt-1 text-sm font-medium text-foreground">{feeSummary.className}</p>
          </div>
          {feeSummary.lastPaymentDate && (
            <div className="student-detail-info-item rounded-xl border p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Last payment</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {format(new Date(feeSummary.lastPaymentDate), 'MMM d, yyyy')}
              </p>
            </div>
          )}
        </div>
      </BentoCard>
    </BentoGrid>
  )
}
