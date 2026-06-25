'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import type { Student, SchoolClass } from '@/types'
import { useTranslation } from '@/i18n/use-translation'
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
  type StudentFormValues,
} from '@/lib/student-form-schema'

export type { StudentFormValues } from '@/lib/student-form-schema'

interface StudentsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Student | null
  classes: (SchoolClass & { studentCount?: number })[]
  onSubmit: (values: StudentFormValues) => Promise<void>
}

export function StudentsFormDialog({
  open,
  onOpenChange,
  editing,
  classes,
  onSubmit,
}: StudentsFormDialogProps) {
  const { t } = useTranslation()
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: getStudentFormDefaults(null, classes),
  })

  useEffect(() => {
    if (open) {
      form.reset(getStudentFormDefaults(editing, classes))
    }
  }, [open, editing, classes, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="students-form-dialog max-w-lg overflow-y-auto">
        <DialogHeader>
          <div className="dialog-icon-badge dialog-icon-badge-students mb-2">
            <GraduationCap className="h-5 w-5" />
          </div>
          <DialogTitle>{editing ? t('students.editStudent') : t('students.createStudent')}</DialogTitle>
          <DialogDescription>
            {editing ? t('students.editDescription') : t('students.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values)
              onOpenChange(false)
            })}
            className="space-y-4"
          >
            <StudentPersonalFields form={form} classes={classes} />
            <StudentContactFields form={form} classes={classes} />
            <StudentAcademicFields form={form} classes={classes} />
            <StudentGuardianFields form={form} classes={classes} />
            <StudentNotesField form={form} classes={classes} />
            <Button type="submit" className="dialog-btn-primary w-full">
              {editing ? t('students.editStudent') : t('students.saveStudent')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
