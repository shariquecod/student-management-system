'use client'

import { useEffect, useState } from 'react'
import { PageHeader, GlassPanel, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { fetchClasses, getClass, fetchAttendance, fetchAttendanceSummary, recordAttendance } from '@/services/school-api'
import type { AttendanceStatus, SchoolClass, Student } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function AttendancePage() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<Student[]>([])
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof fetchAttendanceSummary>>>([])
  const [histClass, setHistClass] = useState('all')
  const [histStudent, setHistStudent] = useState('')

  useEffect(() => {
    fetchClasses({ limit: 50 }).then((r) => {
      setClasses(r.data)
      if (r.data[0]) setClassId(r.data[0].id)
    })
  }, [])

  useEffect(() => {
    if (!classId) return
    getClass(classId).then((c) => {
      setStudents(c.students)
      const map: Record<string, AttendanceStatus> = {}
      c.students.forEach((s) => { map[s.id] = 'present' })
      setStatuses(map)
    })
    fetchAttendance({ date, classId }).then((records) => {
      const map: Record<string, AttendanceStatus> = {}
      records.forEach((r) => { map[r.studentId] = r.status })
      if (records.length) setStatuses((prev) => ({ ...prev, ...map }))
    })
  }, [classId, date])

  const save = async () => {
    try {
      await recordAttendance({
        date, classId,
        records: Object.entries(statuses).map(([studentId, status]) => ({ studentId, status })),
      })
      toast.success('Attendance saved')
    } catch { toast.error('Failed to save') }
  }

  const loadSummary = async () => {
    const data = await fetchAttendanceSummary({
      ...(histClass !== 'all' ? { classId: histClass } : {}),
      ...(histStudent ? { studentId: histStudent } : {}),
    })
    setSummary(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('attendance.title')} description={t('attendance.description')} />
      <Tabs defaultValue="record">
        <TabsList><TabsTrigger value="record">Record</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>
        <TabsContent value="record">
          <GlassPanel>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div><label className="text-xs text-muted-foreground">Date</label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div className="flex-1"><label className="text-xs text-muted-foreground">Class</label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end"><Button onClick={save}>Save Attendance</Button></div>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Roll</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.firstName} {s.lastName}</TableCell>
                      <TableCell>{s.rollNumber}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {(['present', 'absent', 'late'] as AttendanceStatus[]).map((st) => (
                            <Button key={st} size="sm" variant={statuses[s.id] === st ? 'default' : 'outline'}
                              onClick={() => setStatuses({ ...statuses, [s.id]: st })} className="capitalize text-xs h-8">
                              {st}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="history">
          <GlassPanel>
            <div className="flex gap-3 mb-4 flex-wrap">
              <Select value={histClass} onValueChange={setHistClass}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Student ID (optional)" value={histStudent} onChange={(e) => setHistStudent(e.target.value)} className="max-w-xs" />
              <Button onClick={loadSummary}>Load Summary</Button>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Late</TableHead><TableHead>Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {summary.map((s) => (
                  <TableRow key={s.studentId}>
                    <TableCell>{s.studentName}</TableCell>
                    <TableCell><StatusBadge status="present" label={String(s.present)} /></TableCell>
                    <TableCell><StatusBadge status="absent" label={String(s.absent)} /></TableCell>
                    <TableCell><StatusBadge status="late" label={String(s.late)} /></TableCell>
                    <TableCell>{s.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
