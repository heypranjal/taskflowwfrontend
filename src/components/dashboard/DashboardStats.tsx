import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Props {
  overdue: number
  today: number
  thisWeek: number
  upcoming: number
}

export function DashboardStats({ overdue, today, thisWeek, upcoming }: Props) {
  const nav = useNavigate()
  const items = [
    { label: 'Overdue', value: overdue, tone: 'text-red-600 dark:text-red-400', href: '/tasks' },
    { label: 'Today', value: today, tone: 'text-blue-600 dark:text-blue-400', href: '/tasks' },
    { label: 'This week', value: thisWeek, tone: 'text-emerald-600 dark:text-emerald-400', href: '/timeline' },
    { label: 'Next 60 days', value: upcoming, tone: 'text-foreground', href: '/timeline' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => nav(it.href)}
          className="glass rounded-[18px] p-4 text-left transition-transform hover:-translate-y-0.5"
        >
          <p className={cn('text-2xl font-semibold', it.tone)}>{it.value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{it.label}</p>
        </button>
      ))}
    </div>
  )
}
