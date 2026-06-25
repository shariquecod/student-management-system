'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, GraduationCap, Loader2, UserPlus } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/shared'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  StudentPersonalFields,
  StudentContactFields,
  StudentAcademicFields,
  StudentGuardianFields,
  StudentNotesField,
} from '@/components/students/student-form-fields'
import {
  getStudentFormDefaults,
  studentFormSchema,
  studentFormValuesToPayload,
  type StudentFormValues,
} from '@/lib/student-form-schema'
import { createStudent, fetchClasses } from '@/services/school-api'
import type { SchoolClass } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export function StudentCreateForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [classes, setClasses] = useState<(SchoolClass & { studentCount?: number })[]>([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: getStudentFormDefaults(null, []),
  })

  useEffect(() => {
    fetchClasses({ limit: 50 })
      .then((res) => {
        setClasses(res.data)
        form.reset(getStudentFormDefaults(null, res.data))
      })
      .catch(() => toast.error(t('students.loadClassesFailed')))
      .finally(() => setLoadingClasses(false))
  }, [form, t])

  const onSubmit = async (values: StudentFormValues) => {
    setSubmitting(true)
    try {
      const student = await createStudent(studentFormValuesToPayload(values))
      toast.success(t('students.created'))
      router.push(`/students/${student.id}`)
    } catch {
      toast.error(t('students.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingClasses) {
    return (
      <div className="dashboard-shell space-y-4" aria-busy="true">
        <div className="dashboard-skeleton h-28 rounded-2xl" />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton h-52 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <div className="students-create-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
            <div className="students-hero-mesh pointer-events-none" aria-hidden />
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="students-hero-btn shrink-0"
                  asChild
                >
                  <Link href="/students" aria-label={t('common.backToStudents')}>
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div>
                  <nav className="students-create-breadcrumb mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Link href="/students" className="hover:text-foreground transition-colors">
                      {t('nav.students')}
                    </Link>
                    <span aria-hidden>/</span>
                    <span className="text-foreground">{t('students.addStudent')}</span>
                  </nav>
                  <div className="students-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
                    <GraduationCap className="h-3 w-3" />
                    {t('students.newEnrollment')}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {t('students.createStudent')}
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {t('students.createPageDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <BentoCard colSpan={6} accent="students" delay={60}>
              <h3 className="students-form-section-title mb-4">
                {t('students.fields.personalInfo')}
              </h3>
              <StudentPersonalFields form={form} classes={classes} />
            </BentoCard>

            <BentoCard colSpan={6} accent="classes" delay={120}>
              <h3 className="students-form-section-title mb-4">
                {t('students.fields.academicInfo')}
              </h3>
              <StudentAcademicFields form={form} classes={classes} />
            </BentoCard>

            <BentoCard colSpan={6} accent="attendance" delay={180}>
              <h3 className="students-form-section-title mb-4">
                {t('students.fields.contactInfo')}
              </h3>
              <StudentContactFields form={form} classes={classes} />
            </BentoCard>

            <BentoCard colSpan={6} accent="teachers" delay={240}>
              <h3 className="students-form-section-title mb-4">
                {t('students.fields.guardianInfo')}
              </h3>
              <StudentGuardianFields form={form} classes={classes} />
            </BentoCard>

            <BentoCard colSpan={8} delay={300}>
              <h3 className="students-form-section-title mb-4">{t('students.fields.notes')}</h3>
              <StudentNotesField form={form} classes={classes} />
            </BentoCard>

            <BentoCard colSpan={4} accent="students" delay={360}>
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: 'hsl(var(--metric-students) / 0.12)',
                      color: 'hsl(var(--metric-students))',
                    }}
                  >
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{t('students.readyToEnroll')}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('students.createPageHint')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="students-hero-primary w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-1.5 h-4 w-4" />
                        {t('students.saveStudent')}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="students-hero-btn w-full" asChild>
                    <Link href="/students">{t('common.cancel')}</Link>
                  </Button>
                </div>
              </div>
            </BentoCard>
          </form>
        </Form>
      </BentoGrid>
    </div>
  )
}
