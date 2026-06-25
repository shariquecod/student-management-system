'use client'

import { Wallet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
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
import type { PaymentMethod, StudentFeeSummary } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

export interface FeesPaymentForm {
  amount: number
  method: PaymentMethod
  date: string
  notes: string
}

interface FeesPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: StudentFeeSummary | null
  form: FeesPaymentForm
  onFormChange: (form: FeesPaymentForm) => void
  onSubmit: () => void
  loading?: boolean
}

export function FeesPaymentDialog({
  open,
  onOpenChange,
  student,
  form,
  onFormChange,
  onSubmit,
  loading,
}: FeesPaymentDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="students-form-dialog max-w-md">
        <DialogHeader>
          <div className="dialog-icon-badge fees-dialog-icon-badge mb-2">
            <Wallet className="h-5 w-5" />
          </div>
          <DialogTitle>
            {t('fees.recordPayment')} — {student?.studentName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>{t('fees.amount')}</Label>
            <Input
              type="number"
              className="fees-input mt-1.5"
              value={form.amount}
              onChange={(e) => onFormChange({ ...form, amount: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>{t('fees.method')}</Label>
            <Select
              value={form.method}
              onValueChange={(v) => onFormChange({ ...form, method: v as PaymentMethod })}
            >
              <SelectTrigger className="fees-input mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">{t('fees.methodCash')}</SelectItem>
                <SelectItem value="card">{t('fees.methodCard')}</SelectItem>
                <SelectItem value="bank_transfer">{t('fees.methodBank')}</SelectItem>
                <SelectItem value="online">{t('fees.methodOnline')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('fees.date')}</Label>
            <Input
              type="date"
              className="fees-input mt-1.5"
              value={form.date}
              onChange={(e) => onFormChange({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <Label>{t('fees.notes')}</Label>
            <Input
              className="fees-input mt-1.5"
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
            />
          </div>
          <Button
            className="fees-hero-primary w-full"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? t('fees.recording') : t('fees.recordPayment')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
