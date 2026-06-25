'use client'

import { useEffect, useState } from 'react'
import { PageHeader, GlassPanel, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  fetchSchoolProfile, updateSchoolProfile,
  fetchAcademicConfig, updateAcademicConfig,
  fetchAdminUsers, createAdminUser, updateAdminUser,
} from '@/services/school-api'
import type { SchoolProfile, AcademicConfig, AdminUser, UserRole } from '@/types'
import { toast } from 'sonner'
import { useTranslation } from '@/i18n/use-translation'

export default function SettingsPage() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [academic, setAcademic] = useState<AcademicConfig | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff' as UserRole })

  const load = async () => {
    const [p, a, u] = await Promise.all([
      fetchSchoolProfile(), fetchAcademicConfig(), fetchAdminUsers(),
    ])
    setProfile(p)
    setAcademic(a)
    setUsers(u)
  }

  useEffect(() => { load().catch(console.error) }, [])

  if (!profile || !academic) return <div className="p-8 text-muted-foreground">{t('common.loading')}</div>

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} description={t('settings.description')} />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">School Profile</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <GlassPanel>
            <div className="grid gap-4 max-w-xl">
              <div><Label>School Name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
              </div>
              <Button onClick={async () => { await updateSchoolProfile(profile); toast.success('Profile saved') }}>Save Profile</Button>
            </div>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="academic">
          <GlassPanel>
            <div className="grid gap-4 max-w-xl">
              <div><Label>Academic Year</Label><Input value={academic.academicYear} onChange={(e) => setAcademic({ ...academic, academicYear: e.target.value })} /></div>
              <div><Label>Current Term</Label>
                <Select value={academic.currentTerm} onValueChange={(v) => setAcademic({ ...academic, currentTerm: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{academic.terms.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={async () => { await updateAcademicConfig(academic); toast.success('Academic config saved') }}>Save</Button>
            </div>
          </GlassPanel>
        </TabsContent>
        <TabsContent value="users">
          <GlassPanel>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role.replace('_', ' ')}</TableCell>
                    <TableCell><StatusBadge status={u.isActive ? 'active' : 'inactive'} /></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={async () => {
                        await updateAdminUser(u.id, { isActive: !u.isActive })
                        toast.success(u.isActive ? 'User disabled' : 'User enabled')
                        load()
                      }}>{u.isActive ? 'Disable' : 'Enable'}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 pt-6 border-t grid gap-3 max-w-md">
              <p className="font-semibold text-sm">Add Admin User</p>
              <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={async () => {
                await createAdminUser(newUser)
                toast.success('User created')
                setNewUser({ name: '', email: '', password: '', role: 'staff' })
                load()
              }}>Create User</Button>
            </div>
          </GlassPanel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
