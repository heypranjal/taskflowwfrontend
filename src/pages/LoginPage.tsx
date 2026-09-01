import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Sparkles, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import { Glass } from '@/components/common/Glass'

type Mode = 'signin' | 'signup' | 'magic'

export function LoginPage() {
  const { user, loading, signInWithPassword, signUpWithPassword, signInWithMagicLink, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const location = useLocation()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  if (loading) return null
  if (user) return <Navigate to={(location.state as any)?.from ?? '/'} replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setInfo(null)
    try {
      if (mode === 'signin') {
        await signInWithPassword(email, password)
      } else if (mode === 'signup') {
        const { needsEmailConfirmation } = await signUpWithPassword(email, password)
        if (needsEmailConfirmation) {
          setInfo('Check your email to confirm your account, then sign in.')
        } else {
          toast('success', 'Account created')
        }
      } else {
        await signInWithMagicLink(email)
        setInfo('Magic link sent — check your inbox.')
      }
    } catch (err: any) {
      toast('error', err.message ?? 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    try {
      await signInWithGoogle()
      // redirect handled by Supabase
    } catch (err: any) {
      toast('error', err.message ?? 'Google sign-in failed')
      setBusy(false)
    }
  }

  const heading =
    mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Sign in with a magic link'
  const submitLabel =
    mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Sign up' : 'Send magic link'

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10 overflow-hidden">
      <Glass glare className="relative z-10 w-full max-w-sm rounded-[28px] p-6">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background text-sm font-bold">
            MP
          </div>
          <span className="text-sm font-semibold tracking-wide">MY PLANNER</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === 'signup'
            ? 'Get started with your personal planner.'
            : 'Open the app and see what needs to be done.'}
        </p>

        <div className="mt-6 space-y-3">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>or with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>
          {mode !== 'magic' && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {info && (
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              {info}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Please wait…' : submitLabel}
          </Button>
        </form>

        <div className="mt-4 space-y-2 text-center text-xs text-muted-foreground">
          {mode === 'signin' && (
            <>
              <button className="hover:text-foreground" onClick={() => setMode('magic')}>
                <Mail className="mr-1 inline h-3 w-3" /> Sign in with a magic link instead
              </button>
              <div>
                No account?{' '}
                <button className="text-foreground hover:underline" onClick={() => setMode('signup')}>
                  Create one
                </button>
              </div>
            </>
          )}
          {mode === 'signup' && (
            <div>
              Already have an account?{' '}
              <button className="text-foreground hover:underline" onClick={() => setMode('signin')}>
                Sign in
              </button>
            </div>
          )}
          {mode === 'magic' && (
            <button className="hover:text-foreground" onClick={() => setMode('signin')}>
              <Sparkles className="mr-1 inline h-3 w-3" /> Use email + password
            </button>
          )}
        </div>
      </Glass>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 3.4 14.7 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12s4.2 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-2H12z"
      />
    </svg>
  )
}
