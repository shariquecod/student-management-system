export type MetricAccentKey =
  | 'students'
  | 'teachers'
  | 'classes'
  | 'fees'
  | 'attendance'
  | 'exams'

export const metricAccents: Record<
  MetricAccentKey,
  { cssVar: string; light: string; dark: string; label: string }
> = {
  students: {
    cssVar: '--metric-students',
    light: 'hsl(217 91% 60%)',
    dark: 'hsl(217 91% 65%)',
    label: 'Students',
  },
  teachers: {
    cssVar: '--metric-teachers',
    light: 'hsl(262 83% 58%)',
    dark: 'hsl(262 83% 65%)',
    label: 'Teachers',
  },
  classes: {
    cssVar: '--metric-classes',
    light: 'hsl(160 84% 39%)',
    dark: 'hsl(160 84% 45%)',
    label: 'Classes',
  },
  fees: {
    cssVar: '--metric-fees',
    light: 'hsl(38 92% 50%)',
    dark: 'hsl(38 92% 55%)',
    label: 'Fees',
  },
  attendance: {
    cssVar: '--metric-attendance',
    light: 'hsl(173 80% 40%)',
    dark: 'hsl(173 80% 45%)',
    label: 'Attendance',
  },
  exams: {
    cssVar: '--metric-exams',
    light: 'hsl(350 89% 60%)',
    dark: 'hsl(350 89% 65%)',
    label: 'Exams',
  },
}

export const glassPanelClass =
  'backdrop-blur-xl bg-[hsl(var(--glass))] border border-[hsl(var(--glass-border))] shadow-[0_8px_32px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]'

export const bentoGridClass =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 auto-rows-min'
