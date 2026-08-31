import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const { theme, toggle } = useTheme()
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <div className="mt-6 space-y-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Current theme: {theme}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={toggle}>Toggle theme</Button>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Keyboard shortcuts</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li><kbd className="rounded border border-border bg-muted px-1.5 text-xs">N</kbd> — Create a new task</li>
            <li><kbd className="rounded border border-border bg-muted px-1.5 text-xs">/</kbd> — Focus search on Tasks page</li>
            <li><kbd className="rounded border border-border bg-muted px-1.5 text-xs">Esc</kbd> — Close open modal</li>
          </ul>
        </section>
      </div>
    </>
  )
}
