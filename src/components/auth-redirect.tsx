'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * AuthRedirect component handles automatic redirects to login when authentication fails
 * This component checks for the 'redirectToLogin' flag set by the API client
 * when token refresh fails, and redirects the user to the login page
 */
export function AuthRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we need to redirect to login
    const shouldRedirectToLogin = localStorage.getItem('redirectToLogin')

    if (shouldRedirectToLogin && pathname !== '/') {
      // Clear the flag
      localStorage.removeItem('redirectToLogin')

      // Redirect to login (root) with the current path as redirect parameter
      const loginUrl = `/?redirect=${encodeURIComponent(pathname)}`
      router.push(loginUrl)
    }
  }, [router, pathname])

  // This component doesn't render anything
  return null
}
