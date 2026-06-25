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
    if (!isAuthenticated) {
      dispatch(initAuth())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const destination =
        redirect && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/dashboard'
      router.replace(destination)
    }
  }, [isAuthenticated, isLoading, router])

  return <main className="min-h-screen">{children}</main>
}