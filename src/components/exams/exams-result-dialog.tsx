'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/shared'
import type { ExamResult } from '@/types'
import { useTranslation } from '@/i18n/use-translation'

interface ExamsResultDialogProps {
  result: ExamResult | null
  onClose: () => void
}

export function ExamsResultDialog({ result, onClose }: ExamsResultDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="exams-dialog print:block">
        {result && (
          <>
            <DialogHeader>
              <DialogTitle>
                {t('exams.resultFor', { name: result.studentName })}
              </DialogTitle>
            </DialogHeader>
            <div className="students-table-shell overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="students-table-head hover:bg-transparent">
                    <TableHead>{t('classes.subject')}</TableHead>
                    <TableHead>{t('exams.score')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.marks.map((m) => (
                    <TableRow key={m.subject}>
                      <TableCell>{m.subject}</TableCell>
                      <TableCell className="tabular-nums">
                        {m.score}/{m.maxScore}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {t('exams.totalSummary', {
                total: result.total,
                max: result.maxTotal,
                percentage: result.percentage,
              })}{' '}
              — <StatusBadge status={result.status} />
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
