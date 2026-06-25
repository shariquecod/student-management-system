'use client'

import { Users, UserCheck, CalendarRange, Shield } from 'lucide-react'
import { BentoGrid, BentoCard, AnimatedStat } from '@/components/shared'
import {
  SettingsHero,
  SettingsTabs,
  SettingsContentSkeleton,
  SettingsHeroSkeleton,
} from '@/components/settings'
import { StudentsStatSkeleton } from '@/components/students'
import { useSettingsPage } from '@/hooks/use-settings-page'
import { useTranslation } from '@/i18n/use-translation'

export default function SettingsPage() {
  const { t } = useTranslation()
  const {
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
  } = useSettingsPage()

  const ready = !initialLoading && profile && academic

  return (
    <div className="dashboard-shell space-y-4">
      <BentoGrid>
        <BentoCard colSpan={12} delay={0} className="!p-0">
          {ready ? (
            <SettingsHero
              schoolName={profile!.name}
              academicYear={academic!.academicYear}
              onRefresh={reload}
              refreshing={refreshing}
            />
          ) : (
            <SettingsHeroSkeleton />
          )}
        </BentoCard>

        {initialLoading ? (
          <StudentsStatSkeleton />
        ) : (
          <>
            <BentoCard colSpan={3} accent="teachers" delay={60}>
              <AnimatedStat
                title={t('settings.totalUsers')}
                value={stats.totalUsers}
                icon={Users}
                accent="teachers"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="classes" delay={120}>
              <AnimatedStat
                title={t('settings.activeUsers')}
                value={stats.activeUsers}
                icon={UserCheck}
                accent="classes"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="exams" delay={180}>
              <AnimatedStat
                title={t('settings.terms')}
                value={stats.terms}
                icon={CalendarRange}
                accent="exams"
                compact
              />
            </BentoCard>
            <BentoCard colSpan={3} accent="fees" delay={240}>
              <AnimatedStat
                title={t('settings.superAdmins')}
                value={stats.superAdmins}
                icon={Shield}
                accent="fees"
                compact
              />
            </BentoCard>
          </>
        )}

        <BentoCard colSpan={12} delay={300}>
          {ready ? (
            <SettingsTabs
              profile={profile!}
              onProfileChange={setProfile}
              academic={academic!}
              onAcademicChange={setAcademic}
              users={users}
              newUser={newUser}
              onNewUserChange={setNewUser}
              onSaveProfile={saveProfile}
              onSaveAcademic={saveAcademic}
              onToggleUser={toggleUser}
              onCreateUser={createUser}
            />
          ) : (
            <SettingsContentSkeleton />
          )}
        </BentoCard>
      </BentoGrid>
    </div>
  )
}
