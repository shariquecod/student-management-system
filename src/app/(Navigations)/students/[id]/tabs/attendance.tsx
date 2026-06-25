'use client'

import { BentoCard, BentoGrid } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import type { StudentProfileData } from '@/types'
import { format } from 'date-fns'

interface StudentAttendanceTabProps {
  profile: StudentProfileData
}

export function StudentAttendanceTab({ profile }: StudentAttendanceTabProps) {
  const { attendance, attendanceSummary } = profile
  const rate =
    attendanceSummary && attendanceSummary.total > 0
      ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100)
      : 0

  return (
    <BentoGrid>
      <BentoCard colSpan={3} accent="attendance" delay={0}>
        <p className="text-xs text-muted-foreground">Attendance rate</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{rate}%</p>
      </BentoCard>
      <BentoCard colSpan={3} accent="classes" delay={60}>
        <p className="text-xs text-muted-foreground">Present</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {attendanceSummary?.present ?? 0}
        </p>
      </BentoCard>
      <BentoCard colSpan={3} accent="fees" delay={120}>
        <p className="text-xs text-muted-foreground">Absent</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {attendanceSummary?.absent ?? 0}
        </p>
      </BentoCard>
      <BentoCard colSpan={3} accent="exams" delay={180}>
        <p className="text-xs text-muted-foreground">Late</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {attendanceSummary?.late ?? 0}
        </p>
      </BentoCard>

      <BentoCard colSpan={12} delay={240}>
        <h3 className="text-sm font-semibold text-foreground">Attendance history</h3>
        <p className="mt-1 text-xs text-muted-foreground">Recent recorded sessions</p>
        {attendance.length === 0 ? (
          <p className="mt-6 rounded-xl border p-8 text-center text-sm text-muted-foreground">
            No attendance records yet for this student.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="students-table w-full">
              <thead>
                <tr className="students-table-head">
                  <th>Date</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th className="hidden sm:table-cell">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 12).map((record) => (
                  <tr key={record.id} className="students-table-row">
                    <td className="text-sm">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                    <td className="text-sm">{record.className}</td>
                    <td>
                      <StatusBadge
                        status={record.status}
                        label={record.status}
                      />
                    </td>
                    <td className="hidden text-sm text-muted-foreground sm:table-cell">
                      {format(new Date(record.recordedAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>
    </BentoGrid>
  )
}
