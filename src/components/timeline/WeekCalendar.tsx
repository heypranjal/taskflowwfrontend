import { useMemo } from 'react'
import { addDays, format, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { PRIORITY_EVENT_STYLES, PRIORITY_ACCENT } from '@/components/tasks/badges'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  startDate: Date
  days?: number
  onSelectTask: (t: Task) => void
}

export function WeekCalendar({ tasks, startDate, days = 7, onSelectTask }: Props) {
  const today = new Date()

  const columns = useMemo(() => {
    const byDate = new Map<string, Task[]>()
    tasks.forEach((t) => {
      const arr = byDate.get(t.dueDate) ?? []
      arr.push(t)
      byDate.set(t.dueDate, arr)
    })
    return Array.from({ length: days }, (_, i) => {
      const d = addDays(startDate, i)
      const iso = format(d, 'yyyy-MM-dd')
      return { date: d, iso, tasks: (byDate.get(iso) ?? []).sort((a, b) => a.title.localeCompare(b.title)) }
    })
  }, [tasks, startDate, days])

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[840px] rounded-xl border border-border bg-card"
        style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}
      >
        {/* Day headers */}
        {columns.map(({ date, iso }) => {
          const isToday = isSameDay(date, today)
          return (
            <div
              key={`h-${iso}`}
              className={cn(
                'border-b border-border p-3 text-center',
                isToday && 'bg-foreground/[0.03]',
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {format(date, 'EEE')}
              </p>
              <p
                className={cn(
                  'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                  isToday ? 'bg-foreground text-background' : 'text-foreground',
                )}
              >
                {format(date, 'd')}
              </p>
            </div>
          )
        })}

        {/* Day columns */}
        {columns.map(({ date, iso, tasks: dayTasks }, idx) => {
          const isToday = isSameDay(date, today)
          return (
            <div
              key={`c-${iso}`}
              className={cn(
                'min-h-[420px] space-y-2 p-2',
                idx > 0 && 'border-l border-border',
                isToday && 'bg-foreground/[0.02]',
              )}
            >
              {dayTasks.length === 0 && (
                <div className="h-full min-h-[80px] rounded-md border border-dashed border-border/60" aria-hidden />
              )}
              {dayTasks.map((t) => (
                <EventCard key={t.id} task={t} onClick={() => onSelectTask(t)} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EventCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const urgent = task.priority === 'URGENT'
  const done = task.status === 'DONE'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-md border p-2 text-left shadow-sm transition-all hover:shadow-md',
        PRIORITY_EVENT_STYLES[task.priority],
        done && 'opacity-60',
      )}
    >
      <div className={cn('absolute inset-y-0 left-0 w-1', PRIORITY_ACCENT[task.priority])} aria-hidden />
      <div className="pl-2">
        <p
          className={cn(
            'text-xs font-semibold leading-snug',
            done && 'line-through',
            urgent ? 'text-white' : 'text-foreground',
          )}
        >
          {task.title}
        </p>
        {task.projectName && (
          <p className={cn('mt-0.5 text-[11px] truncate', urgent ? 'text-white/80' : 'text-muted-foreground')}>
            {task.projectName}
          </p>
        )}
      </div>
    </button>
  )
}
