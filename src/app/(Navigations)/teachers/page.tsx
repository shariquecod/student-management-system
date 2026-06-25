'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, GlassPanel, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Search } from 'lucide-react'
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from '@/services/school-api'
import type { Teacher } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

const schema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1),
  employeeId: z.string().min(1), email: z.string().email(), phone: z.string().min(1),
  department: z.string().min(1), subjects: z.string().min(1),
  joiningDate: z.string().min(1), status: z.enum(['active', 'inactive', 'archived']),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function TeachersPage() {
  const { t } = useTranslation()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', employeeId: '', email: '', phone: '', department: '', subjects: '', joiningDate: '', status: 'active', notes: '' },
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchTeachers({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined, page, limit: 10 })
      setTeachers(res.data)
      setTotal(res.meta.total)
    } catch { toast.error('Failed to load teachers') }
    finally { setLoading(false) }
  }, [search, statusFilter, page])

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

  const openCreate = () => {
    setEditing(null)
    form.reset({ firstName: '', lastName: '', employeeId: '', email: '', phone: '', department: '', subjects: '', joiningDate: '', status: 'active', notes: '' })
    setDialogOpen(true)
  }

  const openEdit = (t: Teacher) => {
    setEditing(t)
    form.reset({ firstName: t.firstName, lastName: t.lastName, employeeId: t.employeeId, email: t.email, phone: t.phone, department: t.department, subjects: t.subjects.join(', '), joiningDate: t.joiningDate, status: t.status, notes: t.notes ?? '' })
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    const payload = { ...values, subjects: values.subjects.split(',').map((s) => s.trim()).filter(Boolean), assignedClassIds: editing?.assignedClassIds ?? [] }
    try {
      if (editing) { await updateTeacher(editing.id, payload); toast.success('Teacher updated') }
      else { await createTeacher(payload); toast.success('Teacher created') }
      setDialogOpen(false); load()
    } catch { toast.error('Failed to save') }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teachers.title')}
        description={t('teachers.description')}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {t('teachers.addTeacher')}
          </Button>
        }
      />
      <GlassPanel>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              : teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.firstName} {t.lastName}</TableCell>
                  <TableCell>{t.employeeId}</TableCell>
                  <TableCell className="hidden md:table-cell">{t.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{t.email}</TableCell>
                  <TableCell><StatusBadge status={t.status === 'archived' ? 'archived' : t.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(t)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={async () => { await deleteTeacher(t.id); toast.success('Archived'); load() }}>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <span>{total} teachers</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page * 10 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </GlassPanel>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="employeeId" render={({ field }) => (<FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="subjects" render={({ field }) => (<FormItem><FormLabel>Subjects (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="joiningDate" render={({ field }) => (<FormItem><FormLabel>Joining Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
              <Button type="submit" className="w-full">{editing ? 'Update' : 'Create'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
