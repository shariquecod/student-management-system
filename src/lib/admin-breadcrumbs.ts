export interface AdminBreadcrumbSegment {
  labelKey: string
  href?: string
}

const SECTION_LABEL_KEYS: Record<string, string> = {
  dashboard: 'nav.dashboard',
  students: 'nav.students',
  teachers: 'nav.teachers',
  classes: 'nav.classes',
  attendance: 'nav.attendance',
  exams: 'nav.examsResults',
  fees: 'nav.feesPayments',
  settings: 'nav.settings',
}

function sectionSegment(section: string): AdminBreadcrumbSegment | null {
  const labelKey = SECTION_LABEL_KEYS[section]
  if (!labelKey) return null
  return { labelKey, href: `/${section}` }
}

export function getAdminBreadcrumbSegments(pathname: string): AdminBreadcrumbSegment[] {
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length === 0) {
    return [{ labelKey: 'nav.dashboard' }]
  }

  const section = parts[0]
  const sectionCrumb = sectionSegment(section)

  if (!sectionCrumb) {
    return [{ labelKey: 'common.adminPortal' }]
  }

  if (section === 'dashboard') {
    return [{ labelKey: 'nav.dashboard' }]
  }

  if (parts.length === 1) {
    return [{ labelKey: sectionCrumb.labelKey }]
  }

  const child = parts[1]

  if (section === 'students') {
    if (child === 'new') {
      return [sectionCrumb, { labelKey: 'students.addStudent' }]
    }
    return [sectionCrumb, { labelKey: 'common.studentProfile' }]
  }

  if (section === 'teachers') {
    if (child === 'new') {
      return [sectionCrumb, { labelKey: 'teachers.addTeacher' }]
    }
    return [sectionCrumb, { labelKey: 'common.teacherProfile' }]
  }

  if (section === 'classes' && parts.length >= 2) {
    return [sectionCrumb, { labelKey: 'common.classDetails' }]
  }

  return [{ labelKey: sectionCrumb.labelKey }]
}
