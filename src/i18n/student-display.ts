import type { Student } from '@/types'
import type { Locale } from '@/i18n/types'
import { getStudentInitials } from '@/data/students-page'

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

export type StudentNameSource = Pick<Student, 'firstName' | 'lastName' | 'firstNameUr' | 'lastNameUr'>

const CLASS_NAME_KEYS: Record<string, string> = {
  'Grade 7': 'students.classNames.grade7',
  'Grade 8': 'students.classNames.grade8',
  'Grade 9': 'students.classNames.grade9',
  'Grade 10': 'students.classNames.grade10',
  'Grade 12': 'students.classNames.grade12',
  Unassigned: 'students.classNames.unassigned',
}

const RELATION_KEYS: Record<string, string> = {
  Parent: 'students.relations.parent',
  Mother: 'students.relations.mother',
  Father: 'students.relations.father',
}

export function getStudentNameParts(student: StudentNameSource, locale: Locale) {
  if (locale === 'ur' && student.firstNameUr) {
    return { firstName: student.firstNameUr, lastName: student.lastNameUr ?? '' }
  }
  return { firstName: student.firstName, lastName: student.lastName }
}

export function getStudentDisplayName(student: StudentNameSource, locale: Locale) {
  const { firstName, lastName } = getStudentNameParts(student, locale)
  return `${firstName} ${lastName}`.trim()
}

export function getStudentDisplayInitials(student: StudentNameSource, locale: Locale) {
  const { firstName, lastName } = getStudentNameParts(student, locale)
  return getStudentInitials(firstName, lastName)
}

export function getTranslatedClassName(className: string, t: TranslateFn) {
  const key = CLASS_NAME_KEYS[className]
  return key ? t(key) : className
}

export function getTranslatedGuardianName(
  name: string,
  t: TranslateFn,
  student?: StudentNameSource,
  locale?: Locale
) {
  if (name.startsWith('Guardian of ')) {
    const displayName =
      student && locale
        ? getStudentDisplayName(student, locale)
        : name.replace('Guardian of ', '')
    return t('students.guardianOf', { name: displayName })
  }
  return name
}

export function getTranslatedRelation(relation: string, t: TranslateFn) {
  const key = RELATION_KEYS[relation]
  return key ? t(key) : relation
}
