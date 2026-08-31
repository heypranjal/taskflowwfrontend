import { NavLink } from 'react-router-dom'
import { Calendar, CheckSquare, Folder, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/timeline', icon: Calendar, label: 'Calendar' },
  { to: '/projects', icon: Folder, label: 'Projects' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card">
      <div className="grid grid-cols-4">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-xs',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
