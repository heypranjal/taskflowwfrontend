import { useMemo, useRef, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskDrawer } from '@/components/tasks/TaskDrawer'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useTasks, useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { useToast } from '@/components/ui/toast'
import { useDebounce } from '@/hooks/useDebounce'
import { PageHeader } from '@/components/layout/PageHeader'
import type { Priority, Status, Task } from '@/types'

const ALL = '__all__'
type View = 'all' | 'active' | 'completed'
type Sort = 'due' | 'priority' | 'created'

const PRIORITY_ORDER: Record<Priority, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }

export function TasksPage() {
  const [rawSearch, setRawSearch] = useState('')
  const search = useDebounce(rawSearch, 250)
  const [status, setStatus] = useState<string>(ALL)
  const [priority, setPriority] = useState<string>(ALL)
  const [projectId, setProjectId] = useState<string>(ALL)
  const [sort, setSort] = useState<Sort>('due')
  const [view, setView] = useState<View>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const projectsQ = useProjects()
  const tasksQ = useTasks({
    status: status !== ALL ? (status as Status) : undefined,
    priority: priority !== ALL ? (priority as Priority) : undefined,
    projectId: projectId !== ALL ? projectId : undefined,
    search: search || undefined,
  })

  const statusMut = useUpdateTaskStatus()
  const deleteMut = useDeleteTask()
  const { toast } = useToast()

  const filteredSorted = useMemo(() => {
    if (!tasksQ.data) return []
    let arr = [...tasksQ.data]
    if (view === 'active') arr = arr.filter((t) => t.status !== 'DONE')
    if (view === 'completed') arr = arr.filter((t) => t.status === 'DONE')
    arr.sort((a, b) => {
      if (sort === 'due') return a.dueDate.localeCompare(b.dueDate)
      if (sort === 'priority') return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
      return b.createdAt.localeCompare(a.createdAt)
    })
    return arr
  }, [tasksQ.data, view, sort])

  const toggleComplete = (t: Task) => statusMut.mutate({ id: t.id, status: t.status === 'DONE' ? 'TODO' : 'DONE' })

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Tasks' }]}
        title="Tasks"
        subtitle="Search, filter, and triage everything on your plate."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        }
      />

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder="Search tasks…"
            className="pl-9"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="TODO">To do</SelectItem>
            <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All projects</SelectItem>
            {projectsQ.data?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5 text-xs">
          {(['all','active','completed'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={
                'px-3 py-1.5 rounded-sm transition-colors ' +
                (view === v ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground')
              }
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="due">Sort: Due date</SelectItem>
            <SelectItem value="priority">Sort: Priority</SelectItem>
            <SelectItem value="created">Sort: Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        {tasksQ.isLoading && <LoadingSkeleton rows={5} />}
        {tasksQ.isError && <ErrorState message="Unable to load your tasks." onRetry={() => tasksQ.refetch()} />}
        {tasksQ.data && filteredSorted.length === 0 && (
          <EmptyState title="No tasks match your filters." description="Try clearing filters or add a new task." />
        )}
        <div className="space-y-2">
          {filteredSorted.map((t) => (
            <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} onComplete={() => toggleComplete(t)} onDelete={() => setDeleteTask(t)} />
          ))}
        </div>
      </div>

      <TaskModal open={modalOpen} onOpenChange={setModalOpen} />
      <TaskDrawer task={activeTask} onOpenChange={(o) => !o && setActiveTask(null)} />
      <ConfirmDialog
        open={!!deleteTask}
        onOpenChange={(o) => !o && setDeleteTask(null)}
        title="Delete task?"
        description="This task will be permanently deleted."
        destructive
        confirmLabel="Delete"
        onConfirm={() => deleteTask && deleteMut.mutate(deleteTask.id, { onSuccess: () => toast('success', 'Task deleted') })}
      />
    </>
  )
}
