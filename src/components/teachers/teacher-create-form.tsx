'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, Loader2, UserPlus, Users } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/shared'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  TeacherPersonalFields,
  TeacherProfessionalFields,
  TeacherContactFields,
  TeacherNotesField,
} from '@/components/teachers/teacher-form-fields'
import {
  getTeacherFormDefaults,
  teacherFormSchema,
  teacherFormValuesToPayload,
  type TeacherFormValues,
} from '@/lib/teacher-form-schema'
import { createTeacher } from '@/services/school-api'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export function TeacherCreateForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: getTeacherFormDefaults(),
  })

  const onSubmit = async (values: TeacherFormValues) => {
    setSubmitting(true)
    try {
      const teacher = await createTeacher(teacherFormValuesToPayload(values))
      toast.success(t('teachers.created'))
      router.push(`/teachers/${teacher.id}`)
    } catch {
      toast.error(t('teachers.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <div className="teachers-create-hero relative -m-4 overflow-hidden rounded-[calc(1rem-1px)] p-4 sm:-m-5 sm:p-5">
            <div className="teachers-hero-mesh pointer-events-none" aria-hidden />
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="teachers-hero-btn shrink-0"
                  asChild
                >
                  <Link href="/teachers" aria-label={t('common.backToTeachers')}>
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div>
                  <nav className="teachers-create-breadcrumb mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Link href="/teachers" className="hover:text-foreground transition-colors">
                      {t('nav.teachers')}
                    </Link>
                    <span aria-hidden>/</span>
                    <span className="text-foreground">{t('teachers.addTeacher')}</span>
                  </nav>
                  <div className="teachers-hero-badge mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">
                    <Users className="h-3 w-3" />
                    {t('teachers.newFaculty')}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {t('teachers.createTeacher')}
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {t('teachers.createPageDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <BentoCard colSpan={6} accent="teachers" delay={60}>
              <h3 className="teachers-form-section-title mb-4">
                {t('teachers.fields.personalInfo')}
              </h3>
              <TeacherPersonalFields form={form} />
            </BentoCard>

            <BentoCard colSpan={6} accent="classes" delay={120}>
              <h3 className="teachers-form-section-title mb-4">
                {t('teachers.fields.professionalInfo')}
              </h3>
              <TeacherProfessionalFields form={form} />
            </BentoCard>

            <BentoCard colSpan={6} accent="attendance" delay={180}>
              <h3 className="teachers-form-section-title mb-4">
                {t('teachers.fields.contactInfo')}
              </h3>
              <TeacherContactFields form={form} />
            </BentoCard>

            <BentoCard colSpan={6} accent="exams" delay={240}>
              <h3 className="teachers-form-section-title mb-4">{t('teachers.fields.notes')}</h3>
              <TeacherNotesField form={form} />
            </BentoCard>

            <BentoCard colSpan={12} accent="teachers" delay={300}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: 'hsl(var(--metric-teachers) / 0.12)',
                      color: 'hsl(var(--metric-teachers))',
                    }}
                  >
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('teachers.readyToSave')}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t('teachers.createPageHint')}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    className="teachers-hero-primary"
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
                        {t('teachers.saveTeacher')}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="teachers-hero-btn" asChild>
                    <Link href="/teachers">{t('common.cancel')}</Link>
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
