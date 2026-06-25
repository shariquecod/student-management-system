'use client'

import dynamic from 'next/dynamic'
import { LoginForm } from '@/components/forms'
import { LoginCard } from './login-card'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/mode-toggle'
import { LayoutGrid } from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'
import { useDeferredMount } from '@/hooks/use-deferred-mount'
import { useMediaQuery } from '@/hooks/use-media-query'

const Login3DScene = dynamic(
  () =>
    import('./login-3d-scene').then((mod) => ({
      default: mod.Login3DScene,
    })),
  { ssr: false }
)

function DeferredLogin3D() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const ready = useDeferredMount({ idle: true, enabled: isDesktop })

  if (!isDesktop) return null
  if (!ready) {
    return <div className="login-saas-3d-placeholder hidden min-h-[480px] lg:block" aria-hidden />
  }

  return (
    <div className="login-panel-arrive-left w-full">
      <Login3DScene />
    </div>
  )
}

export function LoginExperience() {
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-118px)] max-w-7xl items-center gap-8 px-4 pb-8 sm:px-8 lg:grid-cols-2">
        <DeferredLogin3D />

        <div className="login-panel-arrive-right flex w-full justify-center">
          <LoginCard>
            <LoginForm variant="immersive" />
          </LoginCard>
        </div>
      </div>

      <footer className="relative z-10 pb-6 text-center text-xs login-footer-text">
        © {new Date().getFullYear()} {t('common.brandName')} · {t('loginShowcase.footer')}
      </footer>
    </>
  )
}
