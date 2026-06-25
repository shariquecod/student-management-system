import type { AttendanceStatus } from '@/types'

export function computeAttendanceStats(
  studentsCount: number,
  statuses: Record<string, AttendanceStatus>
) {
  let present = 0
  let absent = 0
  let late = 0

  for (const status of Object.values(statuses)) {
    if (status === 'present') present++
    else if (status === 'absent') absent++
    else if (status === 'late') late++
  }

  return { total: studentsCount, present, absent, late }
}
