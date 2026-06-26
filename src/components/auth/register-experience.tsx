'use client'

import { RegisterForm } from '@/components/forms'
import { RegisterCard } from './register-card'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/mode-toggle'
import { AuthDeferredShowcase } from './auth-deferred-showcase'
import { LayoutGrid } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

export function RegisterExperience() {
  const { t } = useTranslation()

  return (
    <>
      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="login-header-brand-icon">
            <LayoutGrid className="h-5 w-5" aria-hidden />
          </div>
          <div className="hidden sm:block">
            <p className="login-header-brand-title">{t('common.brandName')}</p>
            <p className="login-header-brand-subtitle">{t('loginShowcase.productTagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle className="login-header-control h-9 w-9 rounded-full border" />
          <LanguageSwitcher className="login-header-control" />
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-7xl items-center gap-8 px-4 pb-8 sm:px-8 lg:grid-cols-2">
        <AuthDeferredShowcase />

        <div className="login-panel-arrive-right flex w-full justify-center">
          <RegisterCard>
            <RegisterForm variant="immersive" />
          </RegisterCard>
        </div>
      </div>

      <footer className="relative z-10 w-[90%] mx-auto pb-2 text-center text-xs login-footer-text">
        © {new Date().getFullYear()} {t('common.brandName')} · {t('loginShowcase.footer')}
      </footer>
    </>
  )
}
