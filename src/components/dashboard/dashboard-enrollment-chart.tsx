'use client'

import type { EnrollmentTrend } from '@/types'
import { useTranslation } from '@/i18n/use-translation'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DashboardEnrollmentChartProps {
  data: EnrollmentTrend[]
}

export function DashboardEnrollmentChart({ data }: DashboardEnrollmentChartProps) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full min-h-[240px] flex-col">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t('dashboard.enrollmentTrends')}</h3>
          <p className="text-xs text-muted-foreground">{t('dashboard.enrollmentSubtitle')}</p>
        </div>
        <span className="rounded-full bg-[hsl(var(--metric-students)/0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--metric-students))]">
          +12% YoY
        </span>
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="enrollmentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--metric-students))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--metric-students))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--metric-students))"
              strokeWidth={2.5}
              fill="url(#enrollmentFill)"
              dot={{ fill: 'hsl(var(--metric-students))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="dashboard-chart-tooltip rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-[hsl(var(--metric-students))]">
        {payload[0].value} students
      </p>
    </div>
  )
}
