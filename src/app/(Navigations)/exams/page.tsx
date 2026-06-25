'use client'

import { useEffect, useState } from 'react'
import { PageHeader, GlassPanel, StatusBadge, BentoCard, BentoGrid } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { fetchExams, createExam, fetchClasses, getClass, fetchExamResults, saveExamResults } from '@/services/school-api'
import type { Exam, ExamResult, Student, SubjectMark } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function ExamsPage() {
  const { t } = useTranslation()
  const [exams, setExams] = useState<Exam[]>([])
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', term: 'Spring', academicYear: '2025-2026', subjects: 'Math,Physics,English', maxScore: 100, passScore: 40 })
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({})
  const [results, setResults] = useState<ExamResult[]>([])
  const [viewResult, setViewResult] = useState<ExamResult | null>(null)

  useEffect(() => {
    fetchExams().then(setExams)
    fetchClasses({ limit: 50 }).then((r) => setClasses(r.data.map((c) => ({ id: c.id, name: c.name }))))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    getClass(selectedClass).then((c) => {
      setStudents(c.students)
      if (selectedExam) {
        fetchExamResults(selectedExam, selectedClass).then((res) => {
          setResults(res)
          const m: Record<string, Record<string, number>> = {}
          res.forEach((r) => {
            m[r.studentId] = {}
            r.marks.forEach((mk) => { m[r.studentId][mk.subject] = mk.score })
          })
          setMarks(m)
        })
      }
    })
  }, [selectedExam, selectedClass])

  const exam = exams.find((e) => e.id === selectedExam)

  const handleCreateExam = async () => {
    await createExam({
      name: form.name, term: form.term, academicYear: form.academicYear,
      classIds: classes.map((c) => c.id),
      subjects: form.subjects.split(',').map((s) => s.trim()),
      maxScore: form.maxScore, passScore: form.passScore,
    })
    toast.success('Exam created')
    setDialogOpen(false)
    fetchExams().then(setExams)
  }

  const saveMarks = async () => {
    if (!exam || !selectedClass) return
    const payload = students.map((s) => ({
      studentId: s.id,
      marks: exam.subjects.map((sub) => ({
        subject: sub,
        score: marks[s.id]?.[sub] ?? 0,
        maxScore: exam.maxScore,
      })) as SubjectMark[],
    }))
    const saved = await saveExamResults(selectedExam, selectedClass, payload)
    setResults(saved)
    toast.success('Marks saved')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('exams.title')}
        description={t('exams.description')}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('common.add')} {t('nav.examsResults')}
          </Button>
        }
      />
      <Tabs defaultValue="exams">
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="marks">Enter Marks</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="exams">
          <BentoGrid>
            {exams.map((e) => (
              <BentoCard key={e.id} colSpan={2}>
                <h3 className="font-bold">{e.name}</h3>
                <p className="text-sm text-muted-foreground">{e.term} · {e.academicYear}</p>
                <p className="text-xs mt-2">{e.subjects.join(', ')}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </TabsContent>
        <TabsContent value="marks">
          <GlassPanel>
            <div className="flex gap-3 mb-4 flex-wrap">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Exam" /></SelectTrigger>
                <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={saveMarks} disabled={!selectedExam || !selectedClass}>Save Marks</Button>
            </div>
            {exam && students.length > 0 && (
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      {exam.subjects.map((s) => <TableHead key={s}>{s}</TableHead>)}
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => {
                      const total = exam.subjects.reduce((sum, sub) => sum + (marks[s.id]?.[sub] ?? 0), 0)
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{s.firstName} {s.lastName}</TableCell>
                          {exam.subjects.map((sub) => (
                            <TableCell key={sub}>
                              <Input type="number" min={0} max={exam.maxScore} className="w-16 h-8"
                                value={marks[s.id]?.[sub] ?? ''}
                                onChange={(e) => setMarks({ ...marks, [s.id]: { ...marks[s.id], [sub]: Number(e.target.value) } })} />
                            </TableCell>
                          ))}
                          <TableCell className="font-semibold">{total}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </GlassPanel>
        </TabsContent>
        <TabsContent value="results">
          <GlassPanel>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Student</TableHead><TableHead>Total</TableHead><TableHead>%</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.studentName}</TableCell>
                    <TableCell>{r.total}/{r.maxTotal}</TableCell>
                    <TableCell>{r.percentage}%</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell><Button size="sm" variant="outline" onClick={() => setViewResult(r)}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </TabsContent>
      </Tabs>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Exam</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Subjects (comma-separated)</Label><Input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></div>
            <Button className="w-full" onClick={handleCreateExam}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewResult} onOpenChange={() => setViewResult(null)}>
        <DialogContent className="print:block">
          {viewResult && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Result — {viewResult.studentName}</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Score</TableHead></TableRow></TableHeader>
                <TableBody>
                  {viewResult.marks.map((m) => (
                    <TableRow key={m.subject}><TableCell>{m.subject}</TableCell><TableCell>{m.score}/{m.maxScore}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="font-semibold">Total: {viewResult.total}/{viewResult.maxTotal} ({viewResult.percentage}%) — <StatusBadge status={viewResult.status} /></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
