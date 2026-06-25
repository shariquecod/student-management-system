'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchTeacher, updateTeacher } from '@/services/school-api'
import type { Teacher } from '@/types'
import { teacherToDraft, draftToUpdatePayload } from '@/lib/teacher-draft'
import type { TeacherDraft } from '@/lib/teacher-draft'
import {
  TeacherDetailHeader,
  TeacherDetailSkeleton,
  TeacherOverview,
} from '@/components/teachers/detail'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function TeacherDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<TeacherDraft | null>(null)
  const [saving, setSaving] = useState(false)

  const loadTeacher = useCallback(async () => {
    const data = await fetchTeacher(id)
    setTeacher(data)
    setDraft(teacherToDraft(data))
    return data
  }, [id])

  useEffect(() => {
    setLoading(true)
    loadTeacher()
      .catch(() => setTeacher(null))
      .finally(() => setLoading(false))
  }, [loadTeacher])

  const handleDraftChange = (patch: Partial<TeacherDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const handleEdit = () => {
    if (teacher) {
      setDraft(teacherToDraft(teacher))
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (teacher) {
      setDraft(teacherToDraft(teacher))
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    try {
      await updateTeacher(id, draftToUpdatePayload(draft))
      toast.success(t('teachers.updated'))
      await loadTeacher()
      setIsEditing(false)
    } catch {
      toast.error(t('teachers.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <TeacherDetailSkeleton />
  }

  if (!teacher || !draft) {
    return (
      <div className="dashboard-shell flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-foreground">{t('common.teacherNotFound')}</p>
        <p className="text-sm text-muted-foreground">{t('common.teacherNotFoundDescription')}</p>
        <Button asChild variant="outline">
          <Link href="/teachers">{t('common.backToTeachers')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="dashboard-shell space-y-4">
      <TeacherDetailHeader
        teacher={teacher}
        draft={draft}
        isEditing={isEditing}
        saving={saving}
        onBack={() => router.push('/teachers')}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDraftChange={handleDraftChange}
      />

      <TeacherOverview
        teacher={teacher}
        isEditing={isEditing}
        draft={draft}
        onDraftChange={handleDraftChange}
      />
    </div>
  )
}
