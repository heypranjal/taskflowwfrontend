import { useMemo, useState } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import {
  Bell, CalendarDays, ChevronLeft, ChevronRight, Filter,
  Plus, Search, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { WeekCalendar } from '@/components/timeline/WeekCalendar'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskDrawer } from '@/components/tasks/TaskDrawer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useTasks } from '@/hooks/useTasks'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

type View = 'Day' | 'Week' | 'Month'
type Tab = 'All Scheduled' | 'Urgent' | 'In progress' | 'Completed'

const TABS: { label: Tab; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'All Scheduled', icon: CalendarDays },
  { label: 'Urgent', icon: Bell },
  { label: 'In progress', icon: Users },
  { label: 'Completed', icon: Bell },
]

function toIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function TimelinePage() {
  const [view, setView] = useState<View>('Week')
  const [tab, setTab] = useState<Tab>('All Scheduled')
  const [offset, setOffset] = useState(0)
  const [rawSearch, setRawSearch] = useState('')
  const search = useDebounce(rawSearch, 250)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const days = view === 'Day' ? 1 : view === 'Week' ? 7 : 30
  const anchor = addDays(new Date(), offset)
  const startDate = useMemo(() => {
    if (view === 'Week') return startOfWeek(anchor, { weekStartsOn: 1 })
    if (view === 'Month') return anchor
    return anchor
  }, [anchor, view])
  const endDate = useMemo(() => addDays(startDate, days - 1), [startDate, days])

  const tasksQ = useTasks({
    from: toIso(startDate),
    to: toIso(endDate),
    search: search || undefined,
  })

  const filtered = useMemo(() => {
    if (!tasksQ.data) return []
    if (tab === 'Urgent') return tasksQ.data.filter((t) => t.priority === 'URGENT' && t.status !== 'DONE')
    if (tab === 'In progress') return tasksQ.data.filter((t) => t.status === 'IN_PROGRESS')
    if (tab === 'Completed') return tasksQ.data.filter((t) => t.status === 'DONE')
    return tasksQ.data
  }, [tasksQ.data, tab])

  const rangeLabel = view === 'Day'
    ? format(startDate, 'd MMM yyyy')
    : `${format(startDate, 'd MMM')} – ${format(endDate, 'd MMM yyyy')}`

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Calendar' }]}
        title="Calendar"
        subtitle="Stay organized and on track with your personalized calendar."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border">
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                tab === label
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="pl-9 h-9 rounded-full bg-muted/40 border-transparent"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Calendar controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{format(startDate, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="sm" onClick={() => setOffset(0)}>Today</Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs">
            {(['Day', 'Week', 'Month'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-1.5 rounded-full transition-colors',
                  view === v ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <CalendarDays className="mr-2 h-3.5 w-3.5" /> {rangeLabel}
          </div>
          <div className="inline-flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setOffset((o) => o - days)}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setOffset((o) => o + days)}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4">
        {tasksQ.isLoading && <LoadingSkeleton rows={6} />}
        {tasksQ.isError && <ErrorState message="Unable to load calendar." onRetry={() => tasksQ.refetch()} />}
        {tasksQ.data && filtered.length === 0 && view !== 'Week' && (
          <EmptyState title="Nothing scheduled in this range." description="Add a task to get started." />
        )}

        {tasksQ.data && (view === 'Week' || view === 'Day') && (
          <WeekCalendar
            tasks={filtered}
            startDate={startDate}
            days={days === 30 ? 7 : days}
            onSelectTask={setActiveTask}
          />
        )}

        {tasksQ.data && view === 'Month' && (
          <div className="space-y-2">
            {filtered.map((t) => (
              <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} />
            ))}
          </div>
        )}
      </div>

      <TaskModal open={modalOpen} onOpenChange={setModalOpen} />
      <TaskDrawer task={activeTask} onOpenChange={(o) => !o && setActiveTask(null)} />
    </>
  )
}
