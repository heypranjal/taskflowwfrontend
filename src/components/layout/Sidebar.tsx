import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Bell, Calendar, ChevronDown, LayoutDashboard, Moon, Plus,
  Search, Settings, ShieldCheck, Sun, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'
import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import { ProjectModal } from '@/components/projects/ProjectModal'

const MAIN_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/tasks', icon: Search, label: 'Tasks' },
  { to: '/timeline', icon: Calendar, label: 'Calendar' },
  { to: '/projects', icon: Bell, label: 'Projects', badge: null as string | null },
]

const PROJECT_DOT_COLORS = [
  'bg-violet-400', 'bg-sky-400', 'bg-emerald-400',
  'bg-amber-400', 'bg-rose-400', 'bg-cyan-400', 'bg-fuchsia-400',
]

function itemCls(isActive: boolean) {
  return cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-foreground/5 text-foreground'
      : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground',
  )
}

export function Sidebar() {
  const projectsQ = useProjects()
  const { theme, toggle } = useTheme()
  const nav = useNavigate()
  const [projectModal, setProjectModal] = useState(false)
  const [tipVisible, setTipVisible] = useState(true)

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-card/60">
        {/* Workspace card */}
        <div className="px-3 pt-4">
          <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-background/60 p-2 text-left transition-colors hover:bg-background">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background text-sm font-bold">
              MP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">My Planner</p>
              <p className="truncate text-xs text-muted-foreground">personal@planner.app</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* MAIN MENU */}
        <div className="mt-6 px-3">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Main Menu
          </p>
          <nav className="space-y-0.5">
            {MAIN_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => itemCls(isActive)}>
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
              </NavLink>
            ))}
            <NavLink to="/settings" className={({ isActive }) => itemCls(isActive)}>
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* MY PAGES */}
        <div className="mt-6 flex-1 px-3 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            My Pages
          </p>
          <div className="space-y-0.5">
            {projectsQ.data?.map((p, i) => (
              <NavLink
                key={p.id}
                to={`/projects/${p.id}`}
                className={({ isActive }) => itemCls(isActive)}
              >
                <span className={cn('h-2 w-2 rounded-sm', PROJECT_DOT_COLORS[i % PROJECT_DOT_COLORS.length])} />
                <span className="truncate">{p.name}</span>
              </NavLink>
            ))}
            <button
              onClick={() => setProjectModal(true)}
              className={cn(itemCls(false), 'w-full text-muted-foreground')}
            >
              <Plus className="h-4 w-4" />
              Create new
            </button>
          </div>
        </div>

        {/* Tip / promo card + theme toggle */}
        <div className="p-3 space-y-2">
          {tipVisible && (
            <div className="relative rounded-lg border border-border bg-background/60 p-3">
              <button
                onClick={() => setTipVisible(false)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground/5">
                <ShieldCheck className="h-4 w-4 text-foreground" />
              </div>
              <p className="mt-3 text-sm font-semibold leading-tight">Stay focused today</p>
              <p className="mt-1 text-xs text-muted-foreground">
                One task at a time. Complete an urgent item first.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={() => nav('/tasks?priority=URGENT')}
              >
                See urgent
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start px-3 text-muted-foreground hover:text-foreground"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </Button>
        </div>
      </aside>

      <ProjectModal open={projectModal} onOpenChange={setProjectModal} />
    </>
  )
}
