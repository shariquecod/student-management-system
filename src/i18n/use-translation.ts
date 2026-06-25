'use client'

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setLocale } from '@/redux/slices'
import { translate } from '@/i18n'
import type { Locale } from '@/i18n/types'
import { LOCALE_OPTIONS } from '@/i18n/types'

export function useTranslation() {
  const locale = useAppSelector((s) => s.ui.locale)
  const dispatch = useAppDispatch()
  const localeMeta = LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0]

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  )

  const changeLocale = useCallback(
    (nextLocale: Locale) => {
      dispatch(setLocale(nextLocale))
    },
    [dispatch]
  )

  return {
    t,
    locale,
    dir: localeMeta.dir,
    changeLocale,
    localeOptions: LOCALE_OPTIONS,
  }
}
