'use client'

import type { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SchoolClass } from '@/types'
import type { StudentFormValues } from '@/lib/student-form-schema'
import { useTranslation } from '@/i18n/use-translation'
import { getTranslatedClassName } from '@/i18n/student-display'

interface StudentFormFieldsProps {
  form: UseFormReturn<StudentFormValues>
  classes: (SchoolClass & { studentCount?: number })[]
}

export function StudentPersonalFields({ form, classes: _classes }: StudentFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.firstName')}</FormLabel>
              <FormControl>
                <Input className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.lastName')}</FormLabel>
              <FormControl>
                <Input className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.rollNumber')}</FormLabel>
              <FormControl>
                <Input className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.dateOfBirth')}</FormLabel>
              <FormControl>
                <Input type="date" className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('common.status')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="students-form-input">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                <SelectItem value="graduated">{t('status.graduated')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function StudentContactFields({ form }: StudentFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('students.fields.email')}</FormLabel>
            <FormControl>
              <Input type="email" className="students-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('students.fields.phone')}</FormLabel>
            <FormControl>
              <Input className="students-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('students.fields.address')}</FormLabel>
            <FormControl>
              <Input className="students-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function StudentAcademicFields({ form, classes }: StudentFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('common.class')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="students-form-input">
                  <SelectValue placeholder={t('students.selectClass')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {getTranslatedClassName(c.name, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('students.fields.enrollmentYear')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                className="students-form-input"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function StudentGuardianFields({ form }: StudentFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="guardianName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('students.fields.guardianName')}</FormLabel>
            <FormControl>
              <Input className="students-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="guardianPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.guardianPhone')}</FormLabel>
              <FormControl>
                <Input className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guardianRelation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('students.fields.guardianRelation')}</FormLabel>
              <FormControl>
                <Input className="students-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export function StudentNotesField({ form }: StudentFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('students.fields.notes')}</FormLabel>
          <FormControl>
            <Textarea className="students-form-input min-h-[120px]" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
