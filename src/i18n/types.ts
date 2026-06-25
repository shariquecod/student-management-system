import type { en } from './locales/en'

export type Locale = 'en' | 'ur'

type TranslationLeaf = string
type TranslationTree = { [key: string]: TranslationLeaf | TranslationTree }

export type TranslationSchema = typeof en

type NestedKeyOf<TObj extends TranslationTree> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends TranslationLeaf
    ? TKey
    : TObj[TKey] extends TranslationTree
      ? `${TKey}.${NestedKeyOf<TObj[TKey]>}`
      : never
}[keyof TObj & string]

export type TranslationKey = NestedKeyOf<TranslationSchema>

export interface LocaleOption {
  value: Locale
  label: string
  nativeLabel: string
  dir: 'ltr' | 'rtl'
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { value: 'ur', label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl' },
]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'app-locale'
