import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Poppins, Noto_Nastaliq_Urdu } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ReduxProvider } from '@/redux/provider'
import { ThemeProvider, OfflineOverlay } from '@/components'
import { LocaleProvider } from '@/components/locale-provider'
import { Toaster } from 'sonner'
import { ToastProvider } from '@/context/ToastContext'
import { AuthRedirect } from '@/components/auth-redirect'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-urdu',
})

export const metadata: Metadata = {
  title: 'ScholarFlow — Student Management',
  description: 'Student administration management platform for schools and institutions',
  applicationName: 'ScholarFlow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${notoUrdu.variable}`}>
      <head />
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased font-poppins"
      >
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <ReduxProvider>
            <LocaleProvider>
              <ToastProvider>
                <AuthRedirect />
                <OfflineOverlay />
                {children}
                <Toaster position="top-center" />
                <SpeedInsights />
              </ToastProvider>
            </LocaleProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
