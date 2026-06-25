'use client'

import { Save, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Exam, Student } from '@/types'
import { useTranslation } from '@/i18n/use-translation'
import { getStudentDisplayInitials, getStudentDisplayName } from '@/i18n/student-display'

interface ExamsMarksPanelProps {
  exams: Exam[]
  classes: { id: string; name: string }[]
  selectedExam: string
  selectedClass: string
  students: Student[]
  marks: Record<string, Record<string, number>>
  exam: Exam | undefined
  loading?: boolean
  saving?: boolean
  onExamChange: (id: string) => void
  onClassChange: (id: string) => void
  onMarkChange: (studentId: string, subject: string, score: number) => void
  onSave: () => void
}

export function ExamsMarksPanel({
  exams,
  classes,
  selectedExam,
  selectedClass,
  students,
  marks,
  exam,
  loading,
  saving,
  onExamChange,
  onClassChange,
  onMarkChange,
  onSave,
}: ExamsMarksPanelProps) {
  const { t, locale } = useTranslation()

  return (
    <div className="exams-marks space-y-5">
      <div className="exams-marks-toolbar rounded-2xl border p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('exams.selectExam')} <span className="text-destructive">*</span>
              </label>
              <Select value={selectedExam} onValueChange={onExamChange}>
                <SelectTrigger className="exams-input">
                  <SelectValue placeholder={t('exams.selectExam')} />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('common.class')} <span className="text-destructive">*</span>
              </label>
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger className="exams-input">
                  <SelectValue placeholder={t('students.selectClass')} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={onSave}
            disabled={!selectedExam || !selectedClass || saving}
            className="exams-marks-save"
          >
            <Save className={`mr-1.5 h-3.5 w-3.5 ${saving ? 'animate-pulse' : ''}`} />
            {t('exams.saveMarks')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="students-table-shell rounded-xl border p-8">
          <div className="dashboard-skeleton mx-auto h-4 w-48 rounded" />
        </div>
      ) : !exam || students.length === 0 ? (
        <div className="exams-marks-empty rounded-2xl border p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-medium text-foreground">{t('exams.noStudents')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('exams.noStudentsHint')}</p>
        </div>
      ) : (
        <div className="students-table-shell overflow-x-auto rounded-xl border">
          <table className="students-table w-full">
            <thead>
              <tr className="students-table-head">
                <th>{t('common.student')}</th>
                {exam.subjects.map((s) => (
                  <th key={s}>{s}</th>
                ))}
                <th>{t('exams.total')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => {
                const total = exam.subjects.reduce(
                  (sum, sub) => sum + (marks[s.id]?.[sub] ?? 0),
                  0
                )
                return (
                  <tr
                    key={s.id}
                    className="students-table-row students-list-item-enter"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="exams-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                          {getStudentDisplayInitials(s, locale)}
                        </div>
                        <span className="font-medium">{getStudentDisplayName(s, locale)}</span>
                      </div>
                    </td>
                    {exam.subjects.map((sub) => (
                      <td key={sub}>
                        <Input
                          type="number"
                          min={0}
                          max={exam.maxScore}
                          className="exams-input h-8 w-16"
                          value={marks[s.id]?.[sub] ?? ''}
                          onChange={(e) =>
                            onMarkChange(s.id, sub, Number(e.target.value))
                          }
                        />
                      </td>
                    ))}
                    <td className="font-semibold tabular-nums">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
