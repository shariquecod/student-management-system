'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  fetchSchoolProfile,
  updateSchoolProfile,
  fetchAcademicConfig,
  updateAcademicConfig,
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
} from '@/services/school-api'
import { computeSettingsPageStats } from '@/lib/settings-stats'
import type { SchoolProfile, AcademicConfig, AdminUser } from '@/types'
import type { SettingsNewUserForm } from '@/types/settings-page'
import { defaultSettingsNewUser } from '@/types/settings-page'
import { useTranslation } from '@/i18n/use-translation'

export function useSettingsPage() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [academic, setAcademic] = useState<AcademicConfig | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [newUser, setNewUser] = useState<SettingsNewUserForm>(defaultSettingsNewUser)

  const load = useCallback(async () => {
    const [p, a, u] = await Promise.all([
      fetchSchoolProfile(),
      fetchAcademicConfig(),
      fetchAdminUsers(),
    ])
    setProfile(p)
    setAcademic(a)
    setUsers(u)
  }, [])

  useEffect(() => {
    load().catch(console.error).finally(() => setInitialLoading(false))
  }, [load])

  const reload = useCallback(async () => {
    setRefreshing(true)
    try {
      await load()
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }, [load])

  const stats = useMemo(
    () => computeSettingsPageStats(users, academic),
    [users, academic]
  )

  const saveProfile = useCallback(async () => {
    if (!profile) return
    await updateSchoolProfile(profile)
    toast.success(t('settings.profileSaved'))
  }, [profile, t])

  const saveAcademic = useCallback(async () => {
    if (!academic) return
    await updateAcademicConfig(academic)
    toast.success(t('settings.academicSaved'))
  }, [academic, t])

  const refreshUsers = useCallback(async () => {
    setUsers(await fetchAdminUsers())
  }, [])

  const toggleUser = useCallback(
    async (user: AdminUser) => {
      await updateAdminUser(user.id, { isActive: !user.isActive })
      toast.success(user.isActive ? t('settings.userDisabled') : t('settings.userEnabled'))
      await refreshUsers()
    },
    [refreshUsers, t]
  )

  const createUser = useCallback(async () => {
    await createAdminUser(newUser)
    toast.success(t('settings.userCreated'))
    setNewUser(defaultSettingsNewUser)
    await refreshUsers()
  }, [newUser, refreshUsers, t])

  return {
    profile,
    setProfile,
    academic,
    setAcademic,
    users,
    newUser,
    setNewUser,
    initialLoading,
    refreshing,
    stats,
    reload,
    saveProfile,
    saveAcademic,
    toggleUser,
    createUser,
  }
}
