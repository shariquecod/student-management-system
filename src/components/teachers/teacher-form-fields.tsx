'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UseFormReturn } from 'react-hook-form'
import {
  teacherFormSchema,
  type TeacherFormValues,
} from '@/lib/teacher-form-schema'
import { useTranslation } from '@/i18n/use-translation'

export { teacherFormSchema, type TeacherFormValues }

interface TeacherFormFieldsProps {
  form: UseFormReturn<TeacherFormValues>
}

export function TeacherPersonalFields({ form }: TeacherFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teachers.fields.firstName')}</FormLabel>
              <FormControl>
                <Input className="teachers-form-input" {...field} />
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
              <FormLabel>{t('teachers.fields.lastName')}</FormLabel>
              <FormControl>
                <Input className="teachers-form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('teachers.fields.employeeId')}</FormLabel>
            <FormControl>
              <Input className="teachers-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="joiningDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('teachers.fields.joiningDate')}</FormLabel>
            <FormControl>
              <Input type="date" className="teachers-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('common.status')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="teachers-form-input">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">{t('status.active')}</SelectItem>
                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                <SelectItem value="archived">{t('status.archived')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function TeacherProfessionalFields({ form }: TeacherFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('teachers.fields.department')}</FormLabel>
            <FormControl>
              <Input className="teachers-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subjects"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('teachers.fields.subjects')}</FormLabel>
            <FormControl>
              <Input className="teachers-form-input" placeholder="Math, Physics" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function TeacherContactFields({ form }: TeacherFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('teachers.fields.email')}</FormLabel>
            <FormControl>
              <Input type="email" className="teachers-form-input" {...field} />
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
            <FormLabel>{t('teachers.fields.phone')}</FormLabel>
            <FormControl>
              <Input className="teachers-form-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function TeacherNotesField({ form }: TeacherFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('teachers.fields.notes')}</FormLabel>
          <FormControl>
            <Textarea className="teachers-form-input min-h-[100px] resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
