'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { authService } from '@/services/auth-services'
import { LogOut } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { LoadingScreen } from '@/components'

interface SidebarItemProps {
  href: string
  icon: string
  label: string
  isActive: boolean
}

const SidebarItem = ({ href, icon, label, isActive }: SidebarItemProps) => {
  // Use active icon for Dashboard and Clients when active
  const getIcon = () => {
    if (!isActive) return icon

    if (label === 'Dashboard') return 'dashboardActive.svg'
    if (label === 'Clients') return 'clientActive.svg'
    if (label === 'Approvals') return 'approvalsActive.svg'

    return icon
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center p-2 rounded-l-[4px] transition-all group relative min-h-[60px]',
        isActive
          ? 'bg-white/10 text-white border-l-4 border-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      )}
      title={label}
      aria-label={label}
    >
      <div className="flex items-center justify-center mb-1">
        <Image
          src={`/logo/${getIcon()}`}
          alt={label}
          width={24}
          height={24}
          className="w-5 h-5"
        />
      </div>
      <span className="text-[10px] font-medium text-center leading-tight">
        {label}
      </span>
    </Link>
  )
}

export function Sidebar({
  isOpen = true,
}: {
  isOpen?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Mock authentication - comment out user check for demo
  // if (!user) return null

  const handleLogout = async () => {
    try {
      setIsLogoutDialogOpen(false)
      setIsLoggingOut(true)
      // Call the real logout API via Redux thunk (clears token + calls endpoint)
    } catch {
      // Always redirect on error too — safety net
    } finally {
      router.push('/')
    }
  }

  // 1. Main Navigation Items
  const mainNavItems = [
    {
      href: '/dashboard',
      icon: 'dashboard.svg',
      label: 'Dashboard',
      permission: { resource: 'dashboard', action: 'view' },
    },
    {
      href: '/clients',
      icon: 'clients.svg',
      label: 'Clients',
      permission: { resource: 'customers', action: 'view' },
    },
    {
      href: '/approvals',
      icon: 'approvals.svg',
      label: 'Approvals',
      permission: { resource: 'approvals', action: 'view' },
      role: 'head_nutritionist',
    },

    {
      href: '/vitalq',
      icon: 'vitalQ.svg',
      label: 'VitalQ',
      permission: { resource: 'vitalq', action: 'view' },
    },
    {
      href: '/nutricode',
      icon: 'nutricode.svg',
      label: 'Nutricode',
      permission: { resource: 'nutricode', action: 'view' },
    },
    {
      href: '/vault',
      icon: 'vault.svg',
      label: 'Vault',
      permission: { resource: 'vault', action: 'view' },
    },
    {
      href: '/intellexa',
      icon: 'intellexa.svg',
      label: 'Intellexa',
      permission: { resource: 'intellexa', action: 'view' },
    },
    {
      href: '/care',
      icon: 'care.svg',
      label: 'Care',
      permission: { resource: 'care', action: 'view' },
    },
    {
      href: '/desk',
      icon: 'desk.svg',
      label: 'Desk',
      permission: { resource: 'desk', action: 'view' },
    },
  ]

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col justify-between h-screen w-[78px]  transition-all duration-300 ease-in-out ',
        'md:block' // Always visible on desktop
      )}
      style={{ backgroundColor: '#10203C' }}
    >
      {isLoggingOut && (
        <LoadingScreen
          message="Logging you out safely"
          subtitle="Thank you for using FamGen Nutrition"
        />
      )}
      <div className="h-[calc(100vh-80px)] flex flex-col justify-between">
        {/* Sidebar Header with Logo */}
        <div className="flex justify-center pt-8 pb-12">
          <Image
            src="/logo/famLogo.svg"
            alt="FAM Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center px-4">
          <nav className="flex flex-col gap-2">
            {mainNavItems.map(
              item =>
                (!item.role || user?.role === item.role) &&
                (item.label === 'Dashboard' ||
                  item.label === 'Clients' ||
                  item.label === 'Approvals' ||
                  item.label === 'VitalQ' ||
                  item.label === 'Nutricode' ||
                  item.label === 'Vault' ||
                  item.label === 'Intellexa' ||
                  item.label === 'Care' ||
                  item.label === 'Desk' ||
                  true) /* Mock authentication - comment out permission checks for demo */ && (
                  /*
                  hasPermission(
                    item.permission.resource,
                    item.permission.action as
                      | 'view'
                      | 'create'
                      | 'edit'
                      | 'delete'
                  )
                  */
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`) ||
                      (item.label === 'Vault' && pathname.startsWith('/meal-planner'))
                    }
                  />
                )
            )}
          </nav>
        </div>
      </div>
      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        {/* Logout Button */}
        <AlertDialog
          open={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <button
              className="flex flex-col items-center justify-center p-2 rounded-l-[4px] text-white/70 hover:text-white hover:bg-white/10 transition-all group min-h-[60px] w-full"
              title="Logout"
              aria-label="Logout"
            >
              <div className="flex items-center justify-center mb-1">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-center leading-tight">
                Logout
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px] bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Confirm Logout
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to logout? You will be redirected to the
                login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
