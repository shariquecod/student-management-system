'use client'

import { BentoCard, BentoGrid } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import type { StudentProfileData } from '@/types'

interface StudentExamsTabProps {
  profile: StudentProfileData
}

export function StudentExamsTab({ profile }: StudentExamsTabProps) {
  const { examResults } = profile
  const passed = examResults.filter((r) => r.status === 'pass').length
  const avg =
    examResults.length > 0
      ? Math.round(examResults.reduce((sum, r) => sum + r.percentage, 0) / examResults.length)
      : 0

  return (
    <BentoGrid>
      <BentoCard colSpan={4} accent="exams" delay={0}>
        <p className="text-xs text-muted-foreground">Exams taken</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{examResults.length}</p>
      </BentoCard>
      <BentoCard colSpan={4} accent="classes" delay={60}>
        <p className="text-xs text-muted-foreground">Passed</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{passed}</p>
      </BentoCard>
      <BentoCard colSpan={4} accent="students" delay={120}>
        <p className="text-xs text-muted-foreground">Average score</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{avg}%</p>
      </BentoCard>

      <BentoCard colSpan={12} delay={180}>
        <h3 className="text-sm font-semibold text-foreground">Exam results</h3>
        <p className="mt-1 text-xs text-muted-foreground">Performance across assessments</p>
        {examResults.length === 0 ? (
          <p className="mt-6 rounded-xl border p-8 text-center text-sm text-muted-foreground">
            No exam results recorded yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {examResults.map((result) => (
              <div key={result.id} className="student-detail-info-item rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">Exam #{result.examId}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.total}/{result.maxTotal} marks · {result.percentage}%
                    </p>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.marks.map((mark) => (
                    <span key={mark.subject} className="students-class-pill text-xs">
                      {mark.subject}: {mark.score}/{mark.maxScore}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  )
}
