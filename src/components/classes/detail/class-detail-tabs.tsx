'use client'

import { Users, GraduationCap, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/use-translation'

export type ClassDetailTab = 'roster' | 'teachers' | 'timetable'

const tabs: {
  id: ClassDetailTab
  labelKey: string
  icon: typeof Users
}[] = [
  { id: 'roster', labelKey: 'classes.tabs.roster', icon: Users },
  { id: 'teachers', labelKey: 'classes.tabs.teachers', icon: GraduationCap },
  { id: 'timetable', labelKey: 'classes.tabs.timetable', icon: Calendar },
]

interface ClassDetailTabsProps {
  activeTab: ClassDetailTab
  onTabChange: (tab: ClassDetailTab) => void
}

export function ClassDetailTabs({ activeTab, onTabChange }: ClassDetailTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="class-detail-tabs overflow-x-auto">
      <div className="class-detail-tabs-list inline-flex min-w-full gap-1 p-1 sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'class-detail-tab-trigger inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive && 'class-detail-tab-trigger-active'
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
