'use client'

import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Student } from '@/types'
import { useTranslation } from '@/i18n/use-translation'
import { getStudentDisplayName } from '@/i18n/student-display'

interface StudentsDeleteDialogProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function StudentsDeleteDialog({
  student,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: StudentsDeleteDialogProps) {
  const { t, locale } = useTranslation()
  const fullName = student ? getStudentDisplayName(student, locale) : t('common.student')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="students-form-dialog max-w-md">
        <DialogHeader>
          <div className="dialog-icon-badge dialog-icon-badge-warning mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>{t('students.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('students.deleteDescription', { name: fullName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="dialog-btn-outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            className="students-delete-confirm-btn"
            disabled={loading}
            onClick={async () => {
              try {
                await onConfirm()
                onOpenChange(false)
              } catch {
                // Keep dialog open when delete fails.
              }
            }}
          >
            {loading ? t('students.deleting') : t('students.deleteConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
