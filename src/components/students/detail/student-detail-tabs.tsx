'use client'

import {
  LayoutGrid,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Wallet,
} from 'lucide-react'
import type { StudentDetailTab } from '@/types/student-profile'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

const tabs: {
  id: StudentDetailTab
  labelKey: string
  icon: typeof LayoutGrid
}[] = [
  { id: 'overview', labelKey: 'students.tabs.overview', icon: LayoutGrid },
  { id: 'academic', labelKey: 'students.tabs.academic', icon: GraduationCap },
  { id: 'attendance', labelKey: 'students.tabs.attendance', icon: ClipboardCheck },
  { id: 'exams', labelKey: 'students.tabs.exams', icon: FileText },
  { id: 'fees', labelKey: 'students.tabs.fees', icon: Wallet },
]

interface StudentDetailTabsProps {
  activeTab: StudentDetailTab
  onTabChange: (tab: StudentDetailTab) => void
}

export function StudentDetailTabs({ activeTab, onTabChange }: StudentDetailTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="student-detail-tabs overflow-x-auto">
      <div className="student-detail-tabs-list inline-flex min-w-full gap-1 p-1 sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'student-detail-tab-trigger inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive && 'student-detail-tab-trigger-active'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(tab.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
