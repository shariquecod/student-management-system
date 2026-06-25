'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, BentoGrid, BentoCard, GlassPanel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Users, BookOpen } from 'lucide-react'
import { fetchClasses, createClass, deleteClass, fetchTeachers } from '@/services/school-api'
import type { SchoolClass, Teacher } from '@/types'
import { toast } from 'sonner'
import { metricAccents } from '@/utils/theme'
import { useTranslation } from '@/i18n/use-translation'

export default function ClassesPage() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState<(SchoolClass & { studentCount: number })[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', grade: '', section: '', homeroomTeacherId: '', scheduleSummary: '' })

  const load = async () => {
    const [c, t] = await Promise.all([
      fetchClasses({ search: search || undefined, limit: 50 }),
      fetchTeachers({ limit: 50 }),
    ])
    setClasses(c.data as (SchoolClass & { studentCount: number })[])
    setTeachers(t.data)
  }

  useEffect(() => { load().catch(console.error) }, [search])

  const handleCreate = async () => {
    try {
      await createClass({ ...form, studentIds: [], subjectTeacherIds: [], timetable: [] })
      toast.success('Class created')
      setDialogOpen(false)
      load()
    } catch { toast.error('Failed to create class') }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('classes.title')}
        description={t('classes.description')}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('common.add')} {t('nav.classes')}
          </Button>
        }
      />
      <Input placeholder="Search classes..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      <BentoGrid>
        {classes.map((cls) => (
          <BentoCard key={cls.id} colSpan={2} accentColor={metricAccents.classes.light}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{cls.scheduleSummary}</p>
              </div>
              <Link href={`/classes/${cls.id}`}>
                <Button size="sm" variant="outline">View</Button>
              </Link>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{cls.studentCount ?? cls.studentIds.length} students</span>
              <span className="flex items-center gap-1 text-muted-foreground"><BookOpen className="h-4 w-4" />{cls.homeroomTeacherName}</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-3 text-destructive" onClick={async () => { if (confirm('Delete class?')) { await deleteClass(cls.id); load() } }}>Delete</Button>
          </BentoCard>
        ))}
      </BentoGrid>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Class</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Class Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Grade 10 – A" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Grade</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></div>
              <div><Label>Section</Label><Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} /></div>
            </div>
            <div><Label>Homeroom Teacher</Label>
              <Select value={form.homeroomTeacherId} onValueChange={(v) => setForm({ ...form, homeroomTeacherId: v })}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Schedule</Label><Input value={form.scheduleSummary} onChange={(e) => setForm({ ...form, scheduleSummary: e.target.value })} /></div>
            <Button className="w-full" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
