import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

// Supabase JS auto-detects the session from the URL (?code=… or #access_token=…)
// as soon as its client is initialised. This page simply waits until the auth state
// resolves and then bounces to the dashboard.
export function AuthCallbackPage() {
  const { session, loading } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (!loading) {
      nav(session ? '/' : '/login', { replace: true })
    }
  }, [loading, session, nav])

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Signing you in…
    </div>
  )
}
