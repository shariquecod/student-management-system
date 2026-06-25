'use client'

const statCol = 'lg:col-span-3 rounded-2xl border border-border/40 p-4 sm:p-5'

export function TeachersStatSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={statCol}>
          <div className="dashboard-skeleton mb-3 h-10 w-10 rounded-xl" />
          <div className="dashboard-skeleton mb-2 h-3 w-24 rounded" />
          <div className="dashboard-skeleton h-8 w-14 rounded" />
        </div>
      ))}
    </>
  )
}

export function TeachersTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="teachers-table-row">
          <td>
            <div className="flex items-center gap-3">
              <div className="dashboard-skeleton h-9 w-9 shrink-0 rounded-lg" />
              <div className="space-y-1.5">
                <div className="dashboard-skeleton h-3 w-28 rounded" />
                <div className="dashboard-skeleton h-2.5 w-16 rounded" />
              </div>
            </div>
          </td>
          <td>
            <div className="dashboard-skeleton h-5 w-16 rounded" />
          </td>
          <td className="hidden md:table-cell">
            <div className="dashboard-skeleton h-5 w-20 rounded-full" />
          </td>
          <td>
            <div className="dashboard-skeleton h-5 w-14 rounded-full" />
          </td>
          <td className="hidden lg:table-cell">
            <div className="space-y-1.5">
              <div className="dashboard-skeleton h-2.5 w-32 rounded" />
              <div className="dashboard-skeleton h-2.5 w-24 rounded" />
            </div>
          </td>
          <td>
            <div className="ml-auto flex justify-end gap-1">
              <div className="dashboard-skeleton h-8 w-8 rounded-md" />
              <div className="dashboard-skeleton h-8 w-8 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export function TeachersCompactSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="teachers-compact-card rounded-xl border border-border/40 p-4"
          aria-hidden
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="dashboard-skeleton h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <div className="dashboard-skeleton h-3.5 w-28 rounded" />
                <div className="dashboard-skeleton h-2.5 w-16 rounded" />
              </div>
            </div>
            <div className="dashboard-skeleton h-5 w-14 rounded-full" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="dashboard-skeleton h-2.5 w-24 rounded" />
            <div className="dashboard-skeleton h-2.5 w-36 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}
