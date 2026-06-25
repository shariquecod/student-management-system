'use client'

import { useAppSelector } from '@/redux'
import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux'
import { toggleMobileSidebar } from '@/redux/slices'
import { useTranslation } from '@/i18n/use-translation'

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'A'
  const roleKey = user?.role ? `roles.${user.role}` : 'roles.admin'

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-[hsl(var(--glass-border))] rounded-none">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => dispatch(toggleMobileSidebar())}
            aria-label={t('common.openMenu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t('common.brandSubtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ModeToggle />
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {initial}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground leading-none">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{t(roleKey)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
