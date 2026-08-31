import { useState } from 'react'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskDrawer } from '@/components/tasks/TaskDrawer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useDashboard } from '@/hooks/useDashboard'
import { useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/toast'
import type { Task } from '@/types'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'

function greeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const dashQ = useDashboard()
  const now = new Date()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const statusMut = useUpdateTaskStatus()
  const deleteMut = useDeleteTask()
  const { toast } = useToast()

  const toggleComplete = (task: Task) => {
    statusMut.mutate({ id: task.id, status: task.status === 'DONE' ? 'TODO' : 'DONE' }, {
      onSuccess: () => toast('success', task.status === 'DONE' ? 'Task reopened' : 'Task completed'),
    })
  }

  const isEmpty = dashQ.data
    && dashQ.data.overdue.length === 0
    && dashQ.data.today.length === 0
    && dashQ.data.thisWeek.length === 0
    && dashQ.data.upcoming.length === 0

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard' }]}
        title={greeting(now.getHours())}
        subtitle={format(now, 'EEEE, MMMM d, yyyy')}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        }
      />

      <div className="space-y-8">
        {dashQ.isLoading && <LoadingSkeleton rows={4} />}
        {dashQ.isError && <ErrorState message="Unable to load your tasks." onRetry={() => dashQ.refetch()} />}

        {dashQ.data && isEmpty && (
          <EmptyState
            title="Welcome to My Planner"
            description="Plan your next 60 days and stay focused."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Create your first task</Button>}
          />
        )}

        {dashQ.data && !isEmpty && (
          <>
            <DashboardStats
              overdue={dashQ.data.counts.overdue}
              today={dashQ.data.counts.today}
              thisWeek={dashQ.data.counts.thisWeek}
              upcoming={dashQ.data.counts.upcoming}
            />

            <DashboardSection title="Overdue" count={dashQ.data.overdue.length} tone="danger">
              {dashQ.data.overdue.length === 0 ? (
                <EmptyState title="You’re all caught up." />
              ) : (
                <div className="space-y-2">
                  {dashQ.data.overdue.map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} onComplete={() => toggleComplete(t)} onDelete={() => setDeleteTask(t)} />
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="Today" count={dashQ.data.today.length}>
              {dashQ.data.today.length === 0 ? (
                <EmptyState title="Nothing scheduled for today." />
              ) : (
                <div className="space-y-2">
                  {dashQ.data.today.map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} onComplete={() => toggleComplete(t)} onDelete={() => setDeleteTask(t)} />
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="This week" count={dashQ.data.thisWeek.length}>
              {dashQ.data.thisWeek.length === 0 ? (
                <EmptyState title="Nothing else scheduled this week." />
              ) : (
                <div className="space-y-2">
                  {dashQ.data.thisWeek.map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} onComplete={() => toggleComplete(t)} onDelete={() => setDeleteTask(t)} />
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="Next 60 days" count={dashQ.data.upcoming.length}>
              {dashQ.data.upcoming.length === 0 ? (
                <EmptyState title="Your upcoming schedule is clear." />
              ) : (
                <div className="space-y-2">
                  {dashQ.data.upcoming.slice(0, 25).map((t) => (
                    <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} onComplete={() => toggleComplete(t)} onDelete={() => setDeleteTask(t)} />
                  ))}
                </div>
              )}
            </DashboardSection>
          </>
        )}
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
