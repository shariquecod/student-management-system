'use client'

import { useAppDispatch, useAppSelector } from '@/redux'
import { useEffect } from 'react'
import { initAuth } from '@/redux/slices'
import { useRouter } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) return

    const run = () => dispatch(initAuth())

    let timer: ReturnType<typeof setTimeout> | undefined
    let idleId: number | undefined

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 800 })
    } else {
      timer = setTimeout(run, 0)
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  return <main className="min-h-screen">{children}</main>
}
