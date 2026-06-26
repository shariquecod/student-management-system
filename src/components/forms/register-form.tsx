'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import { register, clearError } from '@/redux/slices'
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from '@/i18n/use-translation'

type RegisterFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterFormProps {
  variant?: 'default' | 'immersive'
}

export function RegisterForm({ variant = 'default' }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { error } = useAppSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const schema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().min(2, t('auth.fullNameMin')),
          email: z.string().min(1, t('auth.emailRequired')).email(t('auth.emailInvalid')),
          password: z.string().min(8, t('auth.passwordMin')),
          confirmPassword: z.string().min(8, t('auth.passwordMin')),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('auth.passwordsMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  )

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true)
    const result = await dispatch(
      register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
    )
    if (register.fulfilled.match(result)) {
      window.location.assign('/dashboard')
      return
    }
    setSubmitting(false)
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
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="login-card-label">{t('auth.fullName')}</FormLabel>
                  <FormControl>
                    <div className="login-card-field">
                      <User className="login-card-field-icon" aria-hidden />
                      <Input
                        type="text"
                        placeholder={t('auth.fullNamePlaceholder')}
                        className="login-card-input"
                        autoComplete="name"
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="login-card-label">{t('auth.emailAddress')}</FormLabel>
                  <FormControl>
                    <div className="login-card-field">
                      <Mail className="login-card-field-icon" aria-hidden />
                      <Input
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
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
                  <FormLabel className="login-card-label">{t('auth.password')}</FormLabel>
                  <FormControl>
                    <div className="login-card-field">
                      <Lock className="login-card-field-icon" aria-hidden />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.password')}
                        className="login-card-input login-card-input-password"
                        autoComplete="new-password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="login-card-label">{t('auth.confirmPassword')}</FormLabel>
                  <FormControl>
                    <div className="login-card-field">
                      <Lock className="login-card-field-icon" aria-hidden />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirmPassword')}
                        className="login-card-input login-card-input-password"
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="login-card-field-toggle"
                        aria-label={
                          showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="login-card-field-message" />
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
                  {t('auth.registering')}
                </>
              ) : (
                <>
                  {t('auth.createAccount')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link href="/" className="login-card-link font-medium">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('auth.createYourAccount')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.registerSubtitle')}</p>
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.fullName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.fullNamePlaceholder')} className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
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
                  <Input type="password" placeholder={t('auth.password')} className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('auth.confirmPassword')}
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-11 w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.registering')}
              </>
            ) : (
              t('auth.register')
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link href="/" className="font-medium text-primary hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  )
}
