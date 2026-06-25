'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface DetailFieldProps {
  label: string
  value: string
  isEditing: boolean
  onChange?: (value: string) => void
  type?: string
  multiline?: boolean
  className?: string
}

export function DetailField({
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  multiline = false,
  className,
}: DetailFieldProps) {
  return (
    <div className={cn('student-detail-info-item rounded-xl border p-3', className)}>
      {label ? (
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      ) : null}
      {isEditing ? (
        multiline ? (
          <Textarea
            className="students-form-input mt-1 min-h-[80px] resize-none"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <Input
            type={type}
            className="students-form-input mt-1 h-8"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )
      ) : (
        <p className="mt-1 text-sm font-medium text-foreground">{value || '—'}</p>
      )}
    </div>
  )
}
