'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setLocale } from '@/redux/slices'
import { LOCALE_OPTIONS, LOCALE_STORAGE_KEY } from '@/i18n/types'
import type { Locale } from '@/i18n/types'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useAppSelector((s) => s.ui.locale)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (saved === 'en' || saved === 'ur') {
      dispatch(setLocale(saved))
    }
  }, [dispatch])

  useEffect(() => {
    const meta = LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0]
    document.documentElement.lang = locale
    document.documentElement.dir = meta.dir
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  return <>{children}</>
}
