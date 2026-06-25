'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SettingsUsersPanel } from './settings-users-panel'
import type { SchoolProfile, AcademicConfig, AdminUser } from '@/types'
import type { SettingsNewUserForm } from '@/types/settings-page'
import { useTranslation } from '@/i18n/use-translation'

interface SettingsTabsProps {
  profile: SchoolProfile
  onProfileChange: (profile: SchoolProfile) => void
  academic: AcademicConfig
  onAcademicChange: (academic: AcademicConfig) => void
  users: AdminUser[]
  newUser: SettingsNewUserForm
  onNewUserChange: (user: SettingsNewUserForm) => void
  onSaveProfile: () => Promise<void>
  onSaveAcademic: () => Promise<void>
  onToggleUser: (user: AdminUser) => Promise<void>
  onCreateUser: () => Promise<void>
}

export function SettingsTabs({
  profile,
  onProfileChange,
  academic,
  onAcademicChange,
  users,
  newUser,
  onNewUserChange,
  onSaveProfile,
  onSaveAcademic,
  onToggleUser,
  onCreateUser,
}: SettingsTabsProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="settings-tabs">
      <TabsList className="settings-tabs-list">
        <TabsTrigger value="profile" className="settings-tabs-trigger">
          {t('settings.tabProfile')}
        </TabsTrigger>
        <TabsTrigger value="academic" className="settings-tabs-trigger">
          {t('settings.tabAcademic')}
        </TabsTrigger>
        <TabsTrigger value="users" className="settings-tabs-trigger">
          {t('settings.tabUsers')}
        </TabsTrigger>
      </TabsList>

      {activeTab === 'profile' && (
        <TabsContent value="profile" className="settings-tabs-panel mt-4">
          <div className="grid max-w-xl gap-4">
            <div>
              <Label htmlFor="school-name">{t('settings.schoolName')}</Label>
              <Input
                id="school-name"
                className="settings-form-input mt-1.5"
                value={profile.name}
                onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="school-address">{t('settings.address')}</Label>
              <Input
                id="school-address"
                className="settings-form-input mt-1.5"
                value={profile.address}
                onChange={(e) => onProfileChange({ ...profile, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="school-phone">{t('settings.phone')}</Label>
                <Input
                  id="school-phone"
                  className="settings-form-input mt-1.5"
                  value={profile.phone}
                  onChange={(e) => onProfileChange({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="school-email">{t('settings.email')}</Label>
                <Input
                  id="school-email"
                  className="settings-form-input mt-1.5"
                  value={profile.email}
                  onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
                />
              </div>
            </div>
            <Button className="settings-primary-btn w-fit" onClick={onSaveProfile}>
              {t('settings.saveProfile')}
            </Button>
          </div>
        </TabsContent>
      )}

      {activeTab === 'academic' && (
        <TabsContent value="academic" className="settings-tabs-panel mt-4">
          <div className="grid max-w-xl gap-4">
            <div>
              <Label htmlFor="academic-year">{t('settings.academicYear')}</Label>
              <Input
                id="academic-year"
                className="settings-form-input mt-1.5"
                value={academic.academicYear}
                onChange={(e) => onAcademicChange({ ...academic, academicYear: e.target.value })}
              />
            </div>
            <div>
              <Label>{t('settings.currentTerm')}</Label>
              <Select
                value={academic.currentTerm}
                onValueChange={(v) => onAcademicChange({ ...academic, currentTerm: v })}
              >
                <SelectTrigger className="settings-form-input mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {academic.terms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="settings-primary-btn w-fit" onClick={onSaveAcademic}>
              {t('settings.saveAcademic')}
            </Button>
          </div>
        </TabsContent>
      )}

      {activeTab === 'users' && (
        <TabsContent value="users">
          <SettingsUsersPanel
            users={users}
            newUser={newUser}
            onNewUserChange={onNewUserChange}
            onToggleUser={onToggleUser}
            onCreateUser={onCreateUser}
          />
        </TabsContent>
      )}
    </Tabs>
  )
}
