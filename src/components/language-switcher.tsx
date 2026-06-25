'use client'

import { Languages } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/types'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, locale, changeLocale, localeOptions } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('language-switcher gap-2', className)}
          aria-label={t('common.selectLanguage')}
        >
          <Languages className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{localeOptions.find((o) => o.value === locale)?.nativeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => changeLocale(option.value as Locale)}
            className={cn(locale === option.value && 'bg-accent font-medium')}
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span>{option.label}</span>
              <span className="text-muted-foreground">{option.nativeLabel}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
