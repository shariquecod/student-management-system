'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppDispatch, useAppSelector } from '@/redux'
import { login, clearError } from '@/redux/slices'
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

type LoginFormValues = {
  email: string
  password: string
  rememberMe?: boolean
}

interface LoginFormProps {
  variant?: 'default' | 'immersive'
}

export function LoginForm({ variant = 'default' }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { error } = useAppSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t('auth.emailRequired')).email(t('auth.emailInvalid')),
        password: z.string().min(8, t('auth.passwordMin')),
        rememberMe: z.boolean().optional(),
      }),
    [t]
  )

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true)
    const result = await dispatch(
      login({ email: values.email, password: values.password, rememberMe: values.rememberMe })
    )
    setSubmitting(false)
    if (login.fulfilled.match(result)) {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const destination =
        redirect && redirect.startsWith('/') && !redirect.startsWith('//')
          ? redirect
          : '/dashboard'
      window.location.assign(destination)
    }
  }

  const busy = submitting
  const immersive = variant === 'immersive'

  if (immersive) {
    return (
      <div className="space-y-5">
        {error && (
          <Alert variant="destructive" className="login-card-alert [&>svg]:shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <AlertDescription className="text-sm leading-snug">{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="login-card-label">{t('auth.emailAddress')}</FormLabel>
                  <FormControl>
                    <div className="login-card-field">
                      <Mail className="login-card-field-icon" aria-hidden />
                      <Input
                        type="email"
                        placeholder="admin@school.edu"
                        className="login-card-input"
                        autoComplete="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="login-card-field-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className="login-card-label">{t('auth.password')}</FormLabel>
                    <button
                      type="button"
                      className="login-card-link"
                      onClick={() => alert(t('common.passwordResetSoon'))}
                    >
                      {t('auth.forgot')}
                    </button>
                  </div>
                  <FormControl>
                    <div className="login-card-field">
                      <Lock className="login-card-field-icon" aria-hidden />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.password')}
                        className="login-card-input login-card-input-password"
                        autoComplete="current-password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="login-card-field-toggle"
                        aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="login-card-field-message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2.5 space-y-0 pt-0.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="login-card-checkbox"
                    />
                  </FormControl>
                  <FormLabel className="login-card-checkbox-label">
                    {t('auth.keepMeSignedIn')}
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="login-card-cta group mt-1 h-12 w-full rounded-xl border-0 text-sm font-semibold disabled:opacity-55"
              disabled={busy}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('auth.signingIn')}
                </>
              ) : (
                <>
                  {t('auth.signInDashboard')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="login-card-or-divider">
          <span>{t('common.tryDemoAccount')}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="login-card-demo-chip"
            onClick={() => {
              form.setValue('email', 'admin@school.edu', { shouldValidate: true })
              form.setValue('password', 'admin123', { shouldValidate: true })
            }}
          >
            <span className="login-card-demo-dot login-card-demo-dot-admin" />
            <span className="block text-left">
              <span className="login-card-demo-chip-title">{t('common.admin')}</span>
              <span className="login-card-demo-chip-subtitle">{t('common.fullAccess')}</span>
            </span>
          </button>
          <button
            type="button"
            className="login-card-demo-chip"
            onClick={() => {
              form.setValue('email', 'staff@school.edu', { shouldValidate: true })
              form.setValue('password', 'staff123', { shouldValidate: true })
            }}
          >
            <span className="login-card-demo-dot login-card-demo-dot-staff" />
            <span className="block text-left">
              <span className="login-card-demo-chip-title">{t('roles.staff')}</span>
              <span className="login-card-demo-chip-subtitle">{t('common.limitedAccess')}</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('auth.adminLogin')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.signInSubtitle')}</p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@school.edu"
                    className="h-11"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="h-11 pr-10"
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal">{t('auth.rememberMe')}</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => alert(t('common.passwordResetSoon'))}
            >
              {t('auth.forgotPassword')}
            </button>
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => alert(t('common.contactSupportEmail'))}
            >
              {t('common.contactSupport')}
            </button>
          </div>
          <Button type="submit" className="h-11 w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.signingIn')}
              </>
            ) : (
              t('auth.signIn')
            )}
          </Button>
        </form>
      </Form>
      <p className="text-center text-xs text-muted-foreground">{t('common.demoCredentials')}</p>
    </div>
  )
}
