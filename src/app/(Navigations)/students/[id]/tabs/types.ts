import type { StudentDraft } from '@/lib/student-draft'
import type { StudentProfileData, SchoolClass } from '@/types'

export interface StudentTabProps {
  profile: StudentProfileData
  isEditing: boolean
  draft: StudentDraft
  onDraftChange: (patch: Partial<StudentDraft>) => void
  classes: SchoolClass[]
}

export function getClassName(classes: SchoolClass[], classId: string, fallback: string) {
  return classes.find((c) => c.id === classId)?.name ?? fallback
}
