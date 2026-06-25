'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, GraduationCap, Calendar } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/shared'
import {
  ClassDetailHeader,
  ClassDetailTabs,
  ClassDetailSkeleton,
  type ClassDetailTab,
} from '@/components/classes'
import { MultiSelect } from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'
import { getClass, updateClass, fetchStudents, fetchTeachers } from '@/services/school-api'
import type { Student, Teacher } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'
import { getStudentDisplayName } from '@/i18n/student-display'

export default function ClassDetailPage() {
  const { t, locale } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [cls, setCls] = useState<Awaited<ReturnType<typeof getClass>> | null>(null)
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ClassDetailTab>('roster')

  const load = useCallback(async () => {
    const [c, s, teachers] = await Promise.all([
      getClass(id),
      fetchStudents({ limit: 100 }),
      fetchTeachers({ limit: 50 }),
    ])
    setCls(c)
    setAllStudents(s.data)
    setAllTeachers(teachers.data)
    return c
  }, [id])

  useEffect(() => {
    setLoading(true)
    load()
      .catch(() => setCls(null))
      .finally(() => setLoading(false))
  }, [load])

  const saveRoster = async (studentIds: string[]) => {
    try {
      await updateClass(id, { studentIds })
      toast.success(t('classes.rosterUpdated'))
      await load()
    } catch {
      toast.error(t('classes.saveFailed'))
    }
  }

  const saveTeachers = async (subjectTeacherIds: string[]) => {
    try {
      await updateClass(id, { subjectTeacherIds })
      toast.success(t('classes.teachersUpdated'))
      await load()
    } catch {
      toast.error(t('classes.saveFailed'))
    }
  }

  if (loading) {
    return <ClassDetailSkeleton />
  }

  if (!cls) {
    return (
      <div className="dashboard-shell flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-foreground">{t('common.classNotFound')}</p>
        <p className="text-sm text-muted-foreground">{t('common.classNotFoundDescription')}</p>
        <Button asChild variant="outline">
          <Link href="/classes">{t('common.backToClasses')}</Link>
        </Button>
      </div>
    )
  }

  const studentOptions = allStudents.map((s) => ({
    label: getStudentDisplayName(s, locale),
    value: s.id,
  }))
  const teacherOptions = allTeachers.map((teacher) => ({
    label: `${teacher.firstName} ${teacher.lastName}`,
    value: teacher.id,
  }))

  return (
    <div className="classes-page dashboard-shell space-y-4">
      <ClassDetailHeader cls={cls} onBack={() => router.push('/classes')} />

      <ClassDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="class-detail-tab-panel">
        {activeTab === 'roster' && (
          <BentoGrid>
            <BentoCard colSpan={12} accent="classes" delay={0}>
              <div className="flex items-start gap-3">
                <div className="classes-dialog-icon-badge dialog-icon-badge">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{t('classes.manageRoster')}</h3>
                  <p className="text-xs text-muted-foreground">{t('classes.manageRosterHint')}</p>
                </div>
              </div>
              <div className="mt-4">
                <MultiSelect
                  options={studentOptions}
                  selected={cls.studentIds}
                  onChange={saveRoster}
                  placeholder={t('classes.addStudents')}
                />
              </div>
              <div className="students-table-shell mt-4 overflow-hidden rounded-xl border">
                <table className="students-table w-full">
                  <thead>
                    <tr className="students-table-head">
                      <th>{t('common.student')}</th>
                      <th>{t('common.rollNo')}</th>
                      <th className="hidden md:table-cell">{t('common.contact')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="students-table-empty">
                          {t('classes.noStudents')}
                        </td>
                      </tr>
                    ) : (
                      cls.students.map((student) => (
                        <tr key={student.id} className="students-table-row">
                          <td className="font-medium text-foreground">
                            {getStudentDisplayName(student, locale)}
                          </td>
                          <td>
                            <span className="students-roll-badge font-mono text-xs">
                              {student.rollNumber}
                            </span>
                          </td>
                          <td className="hidden md:table-cell text-xs text-muted-foreground">
                            {student.email}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </BentoGrid>
        )}

        {activeTab === 'teachers' && (
          <BentoGrid>
            <BentoCard colSpan={12} accent="teachers" delay={0}>
              <div className="flex items-start gap-3">
                <div className="classes-dialog-icon-badge dialog-icon-badge">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{t('classes.subjectTeachers')}</h3>
                  <p className="text-xs text-muted-foreground">{t('classes.subjectTeachersHint')}</p>
                </div>
              </div>
              <div className="mt-4">
                <MultiSelect
                  options={teacherOptions}
                  selected={cls.subjectTeacherIds}
                  onChange={saveTeachers}
                  placeholder={t('classes.assignTeachers')}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {cls.subjectTeachers.length === 0 ? (
                  <li className="text-sm text-muted-foreground">{t('classes.noTeachers')}</li>
                ) : (
                  cls.subjectTeachers.map((teacher) => (
                    <li
                      key={teacher.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm dark:bg-muted/20"
                    >
                      <span className="font-medium text-foreground">
                        {teacher.firstName} {teacher.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">{teacher.department}</span>
                    </li>
                  ))
                )}
              </ul>
            </BentoCard>
          </BentoGrid>
        )}

        {activeTab === 'timetable' && (
          <BentoGrid>
            <BentoCard colSpan={12} accent="exams" delay={0}>
              <div className="flex items-start gap-3">
                <div className="classes-dialog-icon-badge dialog-icon-badge">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{t('classes.tabs.timetable')}</h3>
                  <p className="text-xs text-muted-foreground">{t('classes.timetableHint')}</p>
                </div>
              </div>
              {cls.timetable.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">{t('classes.noTimetable')}</p>
              ) : (
                <div className="students-table-shell mt-4 overflow-hidden rounded-xl border">
                  <table className="students-table w-full">
                    <thead>
                      <tr className="students-table-head">
                        <th>{t('classes.day')}</th>
                        <th>{t('classes.time')}</th>
                        <th>{t('classes.subject')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.timetable.map((slot, index) => (
                        <tr key={index} className="students-table-row">
                          <td className="font-medium text-foreground">{slot.day}</td>
                          <td className="text-sm text-muted-foreground">
                            {slot.startTime} – {slot.endTime}
                          </td>
                          <td>
                            <span className="students-class-pill text-xs">{slot.subject}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </BentoCard>
          </BentoGrid>
        )}
      </div>
    </div>
  )
}
