'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Wallet, DollarSign, AlertCircle, Users } from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import { FeesHero, FeesStatSkeleton, FeesBalancesPanel } from '@/components/fees'
import type { FeesPaymentForm } from '@/components/fees/fees-payment-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFeesPage } from '@/hooks/use-fees-page'
import { recordPayment } from '@/services/school-api'
import type { StudentFeeSummary } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

const FeesCategoriesPanel = dynamic(
  () => import('@/components/fees/fees-categories-panel').then((m) => m.FeesCategoriesPanel),
  { ssr: false }
)

const FeesPaymentDialog = dynamic(
  () => import('@/components/fees/fees-payment-dialog').then((m) => m.FeesPaymentDialog),
  { ssr: false }
)

export default function FeesPage() {
  const { t } = useTranslation()
  const {
    stats,
    paginatedSummaries,
    categories,
    categoriesLoading,
    initialLoading,
    refreshing,
    search,
    setSearch,
    overdueOnly,
    setOverdueFilter,
    activeTab,
    setActiveTab,
    page,
    setPage,
    totalPages,
    totalFiltered,
    start,
    end,
    pageSize,
    reload,
  } = useFeesPage()

  const [payDialog, setPayDialog] = useState(false)
  const [selected, setSelected] = useState<StudentFeeSummary | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [payForm, setPayForm] = useState<FeesPaymentForm>({
    amount: 0,
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const openPayDialog = (summary: StudentFeeSummary) => {
    setSelected(summary)
    setPayForm({
      amount: summary.balance,
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    })
    setPayDialog(true)
  }

  const submitPayment = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await recordPayment({
        studentId: selected.studentId,
        studentName: selected.studentName,
        amount: payForm.amount,
        method: payForm.method,
        date: payForm.date,
        notes: payForm.notes,
      })
      toast.success(t('fees.paymentRecorded'))
      setPayDialog(false)
      await reload()
    } catch {
      toast.error(t('fees.paymentFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-shell fees-page space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          <FeesHero
            totalAccounts={stats.totalAccounts}
            outstanding={stats.totalDue}
            onRefresh={reload}
            refreshing={refreshing}
          />
        </BentoCard>

        {initialLoading ? (
          <FeesStatSkeleton />
        ) : (
          <>
            <BentoCard colSpan={3} accent="fees" delay={60}>
              <AnimatedStat
                title={t('fees.totalAccounts')}
                value={stats.totalAccounts}
                icon={Users}
                accent="fees"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="fees" delay={120}>
              <AnimatedStat
                title={t('fees.outstandingBalance')}
                value={stats.totalDue}
                icon={Wallet}
                accent="fees"
                prefix="$"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="classes" delay={180}>
              <AnimatedStat
                title={t('fees.totalCollected')}
                value={stats.totalCollected}
                icon={DollarSign}
                accent="classes"
                prefix="$"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="exams" delay={240}>
              <AnimatedStat
                title={t('fees.overdueAccounts')}
                value={stats.overdueCount}
                icon={AlertCircle}
                accent="exams"
                compact
              />
            </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="fees-tabs">
            <TabsList className="fees-tabs-list mb-4">
              <TabsTrigger value="balances" className="fees-tab-trigger">
                {t('fees.tabBalances')}
              </TabsTrigger>
              <TabsTrigger value="categories" className="fees-tab-trigger">
                {t('fees.tabCategories')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="balances">
              <FeesBalancesPanel
                summaries={paginatedSummaries}
                loading={initialLoading}
                search={search}
                onSearchChange={setSearch}
                overdueOnly={overdueOnly}
                onOverdueOnlyChange={setOverdueFilter}
                onPay={openPayDialog}
                page={page}
                totalPages={totalPages}
                totalFiltered={totalFiltered}
                start={start}
                end={end}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </TabsContent>
            <TabsContent value="categories">
              {activeTab === 'categories' && (
                <FeesCategoriesPanel categories={categories} loading={categoriesLoading} />
              )}
            </TabsContent>
          </Tabs>
        </BentoCard>
      </BentoGrid>

      {payDialog && (
        <FeesPaymentDialog
          open={payDialog}
          onOpenChange={setPayDialog}
          student={selected}
          form={payForm}
          onFormChange={setPayForm}
          onSubmit={submitPayment}
          loading={submitting}
        />
      )}
    </div>
  )
}
