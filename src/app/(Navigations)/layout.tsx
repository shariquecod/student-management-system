'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux'
import { initAuth, setMobileSidebarOpen } from '@/redux/slices'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { LoadingScreen } from '@/components'
import { useTranslation } from '@/i18n/use-translation'

export default function NavigationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth)
  const { mobileSidebarOpen } = useAppSelector((s) => s.ui)

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(initAuth())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return <LoadingScreen message={t('common.loadingPortal')} />

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-muted/30 dark:bg-background">
      <div className="hidden md:flex h-screen shrink-0 sticky top-0">
        <AdminSidebar />
      </div>
      <Sheet open={mobileSidebarOpen} onOpenChange={(o) => dispatch(setMobileSidebarOpen(o))}>
        <SheetContent side="left" className="h-full w-[252px] overflow-hidden border-r p-0">
          <AdminSidebar mobile />
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
