'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageHeader, GlassPanel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft } from 'lucide-react'
import { getClass, updateClass, fetchStudents, fetchTeachers } from '@/services/school-api'
import type { Student, Teacher } from '@/types'
import { MultiSelect } from '@/components/ui/multi-select'
import { toast } from 'sonner'

export default function ClassDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [cls, setCls] = useState<Awaited<ReturnType<typeof getClass>> | null>(null)
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([])

  const load = async () => {
    const [c, s, t] = await Promise.all([
      getClass(id),
      fetchStudents({ limit: 100 }),
      fetchTeachers({ limit: 50 }),
    ])
    setCls(c)
    setAllStudents(s.data)
    setAllTeachers(t.data)
  }

  useEffect(() => { load().catch(console.error) }, [id])

  if (!cls) return <div className="text-muted-foreground p-8">Loading...</div>

  const studentOptions = allStudents.map((s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id }))
  const teacherOptions = allTeachers.map((t) => ({ label: `${t.firstName} ${t.lastName}`, value: t.id }))

  const saveRoster = async (studentIds: string[]) => {
    await updateClass(id, { studentIds })
    toast.success('Roster updated')
    load()
  }

  const saveTeachers = async (subjectTeacherIds: string[]) => {
    await updateClass(id, { subjectTeacherIds })
    toast.success('Teachers updated')
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/classes"><Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button></Link>
        <PageHeader title={cls.name} description={`Homeroom: ${cls.homeroomTeacherName} · ${cls.scheduleSummary}`} />
      </div>
      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="roster">
          <GlassPanel>
            <p className="text-sm font-medium mb-3">Manage enrolled students</p>
            <MultiSelect options={studentOptions} selected={cls.studentIds} onChange={saveRoster} placeholder="Add students..." />
            <Table className="mt-4">
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Roll</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
              <TableBody>
                {cls.students.map((s) => (
                  <TableRow key={s.id}><TableCell>{s.firstName} {s.lastName}</TableCell><TableCell>{s.rollNumber}</TableCell><TableCell>{s.email}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="teachers">
          <GlassPanel>
            <p className="text-sm font-medium mb-3">Subject teachers</p>
            <MultiSelect options={teacherOptions} selected={cls.subjectTeacherIds} onChange={saveTeachers} placeholder="Assign teachers..." />
            <ul className="mt-4 space-y-2">
              {cls.subjectTeachers.map((t) => (
                <li key={t.id} className="text-sm">{t.firstName} {t.lastName} — {t.department}</li>
              ))}
            </ul>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="timetable">
          <GlassPanel>
            {cls.timetable.length === 0 ? <p className="text-muted-foreground text-sm">No timetable entries yet.</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>Day</TableHead><TableHead>Time</TableHead><TableHead>Subject</TableHead></TableRow></TableHeader>
                <TableBody>
                  {cls.timetable.map((slot, i) => (
                    <TableRow key={i}><TableCell>{slot.day}</TableCell><TableCell>{slot.startTime} – {slot.endTime}</TableCell><TableCell>{slot.subject}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </GlassPanel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
