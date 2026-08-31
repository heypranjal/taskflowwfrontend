import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskDrawer } from '@/components/tasks/TaskDrawer'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteProject, useProject, useProjectTasks } from '@/hooks/useProjects'
import { useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/toast'
import type { Task } from '@/types'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const projectQ = useProject(id)
  const tasksQ = useProjectTasks(id)
  const [modalOpen, setModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const deleteMut = useDeleteProject()
  const deleteTaskMut = useDeleteTask()
  const statusMut = useUpdateTaskStatus()
  const { toast } = useToast()

  const active = tasksQ.data?.filter((t) => t.status !== 'DONE') ?? []
  const completed = tasksQ.data?.filter((t) => t.status === 'DONE') ?? []

  return (
    <>
      <button
        onClick={() => nav('/projects')}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Projects
      </button>

      {projectQ.isLoading && <LoadingSkeleton rows={2} />}
      {projectQ.isError && <ErrorState message="Unable to load project." onRetry={() => projectQ.refetch()} />}

      {projectQ.data && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{projectQ.data.name}</h1>
              {projectQ.data.description && (
                <p className="mt-1 text-sm text-muted-foreground">{projectQ.data.description}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{projectQ.data.activeTaskCount} active</span>
                <span>{projectQ.data.completedTaskCount} completed</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add task
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active</h2>
              <div className="mt-3">
                {tasksQ.isLoading && <LoadingSkeleton />}
                {tasksQ.data && active.length === 0 && (
                  <EmptyState title="No active tasks." />
                )}
                <div className="space-y-2">
                  {active.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onClick={() => setActiveTask(t)}
                      onComplete={() => statusMut.mutate({ id: t.id, status: 'DONE' })}
                      onDelete={() => setDeleteTask(t)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {completed.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</h2>
                <div className="mt-3 space-y-2">
                  {completed.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onClick={() => setActiveTask(t)}
                      onComplete={() => statusMut.mutate({ id: t.id, status: 'TODO' })}
                      onDelete={() => setDeleteTask(t)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}

      <TaskModal open={modalOpen} onOpenChange={setModalOpen} defaultProjectId={id} />
      <TaskDrawer task={activeTask} onOpenChange={(o) => !o && setActiveTask(null)} />
      <ProjectModal open={editOpen} onOpenChange={setEditOpen} initial={projectQ.data ?? null} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete project?"
        description="Tasks in this project will be kept but unassigned."
        destructive
        confirmLabel="Delete"
        onConfirm={() =>
          id && deleteMut.mutate(id, {
            onSuccess: () => { toast('success', 'Project deleted'); nav('/projects') },
          })
        }
      />
      <ConfirmDialog
        open={!!deleteTask}
        onOpenChange={(o) => !o && setDeleteTask(null)}
        title="Delete task?"
        description="This task will be permanently deleted."
        destructive
        confirmLabel="Delete"
        onConfirm={() => deleteTask && deleteTaskMut.mutate(deleteTask.id, { onSuccess: () => toast('success', 'Task deleted') })}
      />
    </>
  )
}
