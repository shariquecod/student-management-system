import { en } from './locales/en'
import { ur } from './locales/ur'
import type { Locale } from './types'

export const translations = { en, ur } as const

export function getNestedTranslation(
  dict: Record<string, unknown>,
  key: string
): string | undefined {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, dict)

  return typeof value === 'string' ? value : undefined
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = translations[locale]
  const template = getNestedTranslation(dict as Record<string, unknown>, key) ?? key

  if (!params) return template

  return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
    const token = `{{${paramKey}}}`
    return result.split(token).join(String(paramValue))
  }, template)
}

export { en, ur }
