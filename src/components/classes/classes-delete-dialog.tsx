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
import type { SchoolClass } from '@/types'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'

type ClassWithCount = SchoolClass & { studentCount?: number }

interface ClassesDeleteDialogProps {
  target: ClassWithCount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function ClassesDeleteDialog({
  target,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: ClassesDeleteDialogProps) {
  const { t } = useTranslation()
  const name = target ? getTranslatedClassName(target.name, t) : t('nav.classes')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="students-form-dialog max-w-md">
        <DialogHeader>
          <div className="dialog-icon-badge dialog-icon-badge-warning mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>{t('classes.deleteTitle')}</DialogTitle>
          <DialogDescription>{t('classes.deleteDescription', { name })}</DialogDescription>
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
            {loading ? t('classes.deleting') : t('classes.deleteConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
