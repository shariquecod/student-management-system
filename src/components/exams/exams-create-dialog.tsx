'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

export interface ExamFormValues {
  name: string
  term: string
  academicYear: string
  subjects: string
  maxScore: number
  passScore: number
  classIds: string[]
}

const emptyForm: ExamFormValues = {
  name: '',
  term: 'Spring',
  academicYear: '2025-2026',
  subjects: '',
  maxScore: 100,
  passScore: 40,
  classIds: [],
}

interface ExamsCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classes: { id: string; name: string }[]
  onSubmit: (values: ExamFormValues) => Promise<void>
}

export function ExamsCreateDialog({
  open,
  onOpenChange,
  classes,
  onSubmit,
}: ExamsCreateDialogProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<ExamFormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const isValid =
    form.name.trim() &&
    form.subjects.trim() &&
    form.term &&
    form.academicYear.trim() &&
    form.maxScore > 0 &&
    form.passScore >= 0 &&
    form.passScore <= form.maxScore &&
    form.classIds.length > 0

  const handleOpenChange = (next: boolean) => {
    if (!next) setForm(emptyForm)
    onOpenChange(next)
  }

  const toggleClass = (classId: string) => {
    setForm((prev) => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId],
    }))
  }

  const handleSubmit = async () => {
    if (!isValid) return
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
          <div className="dialog-icon-badge exams-dialog-icon-badge mb-2">
            <FileText className="h-5 w-5" />
          </div>
          <DialogTitle>{t('exams.newExam')}</DialogTitle>
          <DialogDescription>{t('exams.createDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>
              {t('exams.examName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              className="exams-form-input mt-1.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('exams.examNamePlaceholder')}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                {t('exams.term')} <span className="text-destructive">*</span>
              </Label>
              <Select value={form.term} onValueChange={(v) => setForm({ ...form, term: v })}>
                <SelectTrigger className="exams-form-input mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">{t('exams.termSpring')}</SelectItem>
                  <SelectItem value="Summer">{t('exams.termSummer')}</SelectItem>
                  <SelectItem value="Fall">{t('exams.termFall')}</SelectItem>
                  <SelectItem value="Winter">{t('exams.termWinter')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>
                {t('exams.academicYear')} <span className="text-destructive">*</span>
              </Label>
              <Input
                className="exams-form-input mt-1.5"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="2025-2026"
                required
              />
            </div>
          </div>
          <div>
            <Label>
              {t('exams.subjectsLabel')} <span className="text-destructive">*</span>
            </Label>
            <Input
              className="exams-form-input mt-1.5"
              value={form.subjects}
              onChange={(e) => setForm({ ...form, subjects: e.target.value })}
              placeholder={t('exams.subjectsPlaceholder')}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                {t('exams.maxScoreLabel')} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                className="exams-form-input mt-1.5"
                value={form.maxScore}
                onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label>
                {t('exams.passScoreLabel')} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                className="exams-form-input mt-1.5"
                value={form.passScore}
                onChange={(e) => setForm({ ...form, passScore: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label>
              {t('exams.selectClasses')} <span className="text-destructive">*</span>
            </Label>
            <div className="exams-class-picker mt-2 max-h-32 space-y-1.5 overflow-y-auto rounded-xl border p-2">
              {classes.length === 0 ? (
                <p className="px-2 py-1 text-xs text-muted-foreground">{t('exams.noClasses')}</p>
              ) : (
                classes.map((c) => {
                  const selected = form.classIds.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleClass(c.id)}
                      className={cn(
                        'exams-class-option flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                        selected && 'exams-class-option-active'
                      )}
                    >
                      {c.name}
                    </button>
                  )
                })
              )}
            </div>
          </div>
          <Button
            className="exams-hero-primary w-full"
            onClick={handleSubmit}
            disabled={submitting || !isValid}
          >
            {submitting ? t('common.saving') : t('exams.createExam')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
