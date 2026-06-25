'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Teacher } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

export interface ClassFormValues {
  name: string
  grade: string
  section: string
  homeroomTeacherId: string
  scheduleSummary: string
}

const emptyForm: ClassFormValues = {
  name: '',
  grade: '',
  section: '',
  homeroomTeacherId: '',
  scheduleSummary: '',
}

interface ClassesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teachers: Teacher[]
  onSubmit: (values: ClassFormValues) => Promise<void>
}

export function ClassesFormDialog({
  open,
  onOpenChange,
  teachers,
  onSubmit,
}: ClassesFormDialogProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(emptyForm)
    onOpenChange(next)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit(form)
      setForm(emptyForm)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="students-form-dialog max-w-md">
        <DialogHeader>
          <div className="dialog-icon-badge classes-dialog-icon-badge mb-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <DialogTitle>{t('classes.createClass')}</DialogTitle>
          <DialogDescription>{t('classes.createDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>{t('classes.className')}</Label>
            <Input
              className="classes-form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('classes.classNamePlaceholder')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t('classes.grade')}</Label>
              <Input
                className="classes-form-input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
            </div>
            <div>
              <Label>{t('classes.section')}</Label>
              <Input
                className="classes-form-input"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>{t('classes.homeroom')}</Label>
            <Select
              value={form.homeroomTeacherId}
              onValueChange={(v) => setForm({ ...form, homeroomTeacherId: v })}
            >
              <SelectTrigger className="classes-form-input">
                <SelectValue placeholder={t('classes.selectTeacher')} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('classes.schedule')}</Label>
            <Input
              className="classes-form-input"
              value={form.scheduleSummary}
              onChange={(e) => setForm({ ...form, scheduleSummary: e.target.value })}
            />
          </div>
          <Button className="w-full classes-hero-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t('common.saving') : t('classes.createClass')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
