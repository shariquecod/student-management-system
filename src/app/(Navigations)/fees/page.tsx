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
import { fetchStudentFeeSummaries, fetchFeeCategories, recordPayment } from '@/services/school-api'
import type { StudentFeeSummary, FeeCategory, PaymentMethod } from '@/types'
import { toast } from 'sonner'
import { metricAccents } from '@/utils/theme'
import { useTranslation } from '@/i18n/use-translation'

export default function FeesPage() {
  const { t } = useTranslation()
  const [summaries, setSummaries] = useState<StudentFeeSummary[]>([])
  const [categories, setCategories] = useState<FeeCategory[]>([])
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [payDialog, setPayDialog] = useState(false)
  const [selected, setSelected] = useState<StudentFeeSummary | null>(null)
  const [payForm, setPayForm] = useState({ amount: 0, method: 'cash' as PaymentMethod, date: new Date().toISOString().split('T')[0], notes: '' })

  const load = () => {
    fetchStudentFeeSummaries(overdueOnly).then(setSummaries)
    fetchFeeCategories().then(setCategories)
  }

  useEffect(() => { load() }, [overdueOnly])

  const submitPayment = async () => {
    if (!selected) return
    try {
      await recordPayment({
        studentId: selected.studentId,
        studentName: selected.studentName,
        amount: payForm.amount,
        method: payForm.method,
        date: payForm.date,
        notes: payForm.notes,
      })
      toast.success('Payment recorded')
      setPayDialog(false)
      load()
    } catch { toast.error('Failed to record payment') }
  }

  const totalDue = summaries.reduce((s, r) => s + r.balance, 0)
  const overdueCount = summaries.filter((s) => s.isOverdue && s.balance > 0).length

  return (
    <div className="space-y-6">
      <PageHeader title={t('fees.title')} description={t('fees.description')} />
      <BentoGrid>
        <BentoCard colSpan={2} accentColor={metricAccents.fees.light}>
          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          <p className="text-3xl font-bold">${totalDue.toLocaleString()}</p>
        </BentoCard>
        <BentoCard colSpan={2} accentColor="hsl(0 70% 50%)">
          <p className="text-sm text-muted-foreground">Overdue Accounts</p>
          <p className="text-3xl font-bold">{overdueCount}</p>
        </BentoCard>
      </BentoGrid>
      <Tabs defaultValue="balances">
        <TabsList>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="balances">
          <GlassPanel>
            <div className="flex gap-3 mb-4">
              <Button variant={overdueOnly ? 'default' : 'outline'} onClick={() => setOverdueOnly(!overdueOnly)}>
                {overdueOnly ? 'Showing Overdue' : 'Show Overdue Only'}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => (
                  <TableRow key={s.studentId} className={s.isOverdue && s.balance > 0 ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-medium">{s.studentName}</TableCell>
                    <TableCell>{s.className}</TableCell>
                    <TableCell>${s.totalDue.toLocaleString()}</TableCell>
                    <TableCell>${s.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className={s.balance > 0 ? 'text-destructive font-semibold' : ''}>${s.balance.toLocaleString()}</TableCell>
                    <TableCell>{s.lastPaymentDate ?? '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => { setSelected(s); setPayForm({ ...payForm, amount: s.balance }); setPayDialog(true) }}>Pay</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="categories">
          <GlassPanel>
            <Table>
              <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Default Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.description}</TableCell><TableCell>${c.defaultAmount}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassPanel>
        </TabsContent>
      </Tabs>
      <Dialog open={payDialog} onOpenChange={setPayDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment — {selected?.studentName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Amount</Label><Input type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: Number(e.target.value) })} /></div>
            <div><Label>Method</Label>
              <Select value={payForm.method} onValueChange={(v) => setPayForm({ ...payForm, method: v as PaymentMethod })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" value={payForm.date} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} /></div>
            <div><Label>Notes</Label><Input value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} /></div>
            <Button className="w-full" onClick={submitPayment}>Record Payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
