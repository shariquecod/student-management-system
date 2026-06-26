/** Browser API calls use same-origin Next.js routes — not the external backend URL. */
export const SAME_ORIGIN_API_BASE = ''

/**
 * Default backend used by the server proxy when env vars are missing (e.g. Vercel before env is set).
 * Override with API_BASE_URL or NEXT_PUBLIC_API_BASE_URL in .env.local / Vercel dashboard.
 */
export const DEFAULT_BACKEND_API_URL =
  'https://scholar-flow-backend-wp07.onrender.com'
