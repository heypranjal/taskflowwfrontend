import { useMemo } from 'react'
import { addDays, format } from 'date-fns'
import { TaskCard } from '@/components/tasks/TaskCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  days: number
  startDate: Date
  onSelectTask: (t: Task) => void
}

export function Timeline({ tasks, days, startDate, onSelectTask }: Props) {
  const grouped = useMemo(() => {
    const byDate = new Map<string, Task[]>()
    tasks.forEach((t) => {
      const arr = byDate.get(t.dueDate) ?? []
      arr.push(t)
      byDate.set(t.dueDate, arr)
    })
    const list: { date: Date; iso: string; items: Task[] }[] = []
    for (let i = 0; i < days; i++) {
      const d = addDays(startDate, i)
      const iso = format(d, 'yyyy-MM-dd')
      list.push({ date: d, iso, items: byDate.get(iso) ?? [] })
    }
    return list
  }, [tasks, days, startDate])

  let lastMonthKey = ''

  if (tasks.length === 0) {
    return <EmptyState title="Your upcoming schedule is clear." description="Nothing scheduled in this range." />
  }

  return (
    <div className="space-y-4">
      {grouped.map(({ date, iso, items }) => {
        const monthKey = format(date, 'yyyy-MM')
        const showMonth = monthKey !== lastMonthKey
        lastMonthKey = monthKey
        return (
          <div key={iso}>
            {showMonth && (
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {format(date, 'MMMM yyyy')}
              </div>
            )}
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="pt-1 text-right">
                <p className="text-xs uppercase text-muted-foreground">{format(date, 'EEE')}</p>
                <p className={
                  'text-lg font-semibold ' +
                  (items.length > 0 ? 'text-foreground' : 'text-muted-foreground/60')
                }>
                  {format(date, 'd')}
                </p>
              </div>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="h-8 rounded-md border border-dashed border-border/60" aria-hidden />
                ) : (
                  items.map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => onSelectTask(t)} compact />
                  ))
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
