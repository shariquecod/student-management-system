'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchStudentProfile, updateStudent, fetchClasses } from '@/services/school-api'
import type { StudentProfileData, SchoolClass } from '@/types'
import { studentToDraft, draftToUpdatePayload } from '@/lib/student-draft'
import type { StudentDraft } from '@/lib/student-draft'
import { StudentDetailHeader } from '@/components/students/detail/student-detail-header'
import { StudentDetailTabs } from '@/components/students/detail/student-detail-tabs'
import { StudentDetailSkeleton } from '@/components/students/detail/student-detail-skeleton'
import { StudentOverviewTab } from '@/app/(Navigations)/students/[id]/tabs/overview'
import { StudentAcademicTab } from '@/app/(Navigations)/students/[id]/tabs/academic'
import { StudentAttendanceTab } from '@/app/(Navigations)/students/[id]/tabs/attendance'
import { StudentExamsTab } from '@/app/(Navigations)/students/[id]/tabs/exams'
import { StudentFeesTab } from '@/app/(Navigations)/students/[id]/tabs/fees'
import type { StudentDetailTab } from '@/types/student-profile'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function StudentDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [profile, setProfile] = useState<StudentProfileData | null>(null)
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<StudentDetailTab>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<StudentDraft | null>(null)
  const [saving, setSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    const data = await fetchStudentProfile(id)
    setProfile(data)
    setDraft(studentToDraft(data.student))
    return data
  }, [id])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadProfile(), fetchClasses({ limit: 50 }).then((r) => setClasses(r.data))])
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [loadProfile])

  const handleDraftChange = (patch: Partial<StudentDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const handleEdit = () => {
    if (profile) {
      setDraft(studentToDraft(profile.student))
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setDraft(studentToDraft(profile.student))
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    try {
      await updateStudent(id, draftToUpdatePayload(draft))
      toast.success(t('students.updated'))
      await loadProfile()
      setIsEditing(false)
    } catch {
      toast.error(t('students.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const tabProps = profile && draft
    ? { profile, isEditing, draft, onDraftChange: handleDraftChange, classes }
    : null

  if (loading) {
    return <StudentDetailSkeleton />
  }

  if (!profile || !draft || !tabProps) {
    return (
      <div className="dashboard-shell flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-foreground">{t('common.studentNotFound')}</p>
        <p className="text-sm text-muted-foreground">{t('common.studentNotFoundDescription')}</p>
        <Button asChild variant="outline">
          <Link href="/students">{t('common.backToStudents')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="dashboard-shell space-y-4">
      <StudentDetailHeader
        student={profile.student}
        draft={draft}
        isEditing={isEditing}
        saving={saving}
        onBack={() => router.push('/students')}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDraftChange={handleDraftChange}
      />

      <StudentDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="student-detail-tab-panel">
        {activeTab === 'overview' && <StudentOverviewTab {...tabProps} />}
        {activeTab === 'academic' && <StudentAcademicTab {...tabProps} />}
        {activeTab === 'attendance' && <StudentAttendanceTab profile={profile} />}
        {activeTab === 'exams' && <StudentExamsTab profile={profile} />}
        {activeTab === 'fees' && <StudentFeesTab profile={profile} />}
      </div>
    </div>
  )
}
