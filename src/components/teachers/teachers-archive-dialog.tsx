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
import type { Teacher } from '@/types'
import { getTeacherDisplayName } from '@/lib/teacher-draft'
import { useTranslation } from '@/i18n/use-translation'

interface TeachersArchiveDialogProps {
  teacher: Teacher | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function TeachersArchiveDialog({
  teacher,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: TeachersArchiveDialogProps) {
  const { t } = useTranslation()
  const fullName = teacher
    ? getTeacherDisplayName(teacher.firstName, teacher.lastName)
    : t('nav.teachers')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="teachers-form-dialog max-w-md">
        <DialogHeader>
          <div className="dialog-icon-badge dialog-icon-badge-warning mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>{t('teachers.archiveTitle')}</DialogTitle>
          <DialogDescription>
            {t('teachers.archiveDescription', { name: fullName })}
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
            className="teachers-delete-confirm-btn"
            disabled={loading}
            onClick={async () => {
              try {
                await onConfirm()
                onOpenChange(false)
              } catch {
                // Keep dialog open when archive fails.
              }
            }}
          >
            {loading ? t('teachers.archiving') : t('teachers.archiveConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
