import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TaskForm } from './TaskForm'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteTask, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/toast'
import type { Task, TaskInput } from '@/types'

interface Props {
  task: Task | null
  onOpenChange: (open: boolean) => void
}

export function TaskDrawer({ task, onOpenChange }: Props) {
  const updateMut = useUpdateTask()
  const statusMut = useUpdateTaskStatus()
  const deleteMut = useDeleteTask()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleSubmit(input: TaskInput) {
    if (!task) return
    updateMut.mutate({ id: task.id, input }, {
      onSuccess: () => { toast('success', 'Task updated'); onOpenChange(false) },
      onError: (e: any) => toast('error', e.friendlyMessage ?? 'Failed to update task'),
    })
  }

  function handleComplete() {
    if (!task) return
    statusMut.mutate({ id: task.id, status: 'DONE' }, {
      onSuccess: () => { toast('success', 'Task completed'); onOpenChange(false) },
    })
  }

  function handleDelete() {
    if (!task) return
    deleteMut.mutate(task.id, {
      onSuccess: () => { toast('success', 'Task deleted'); onOpenChange(false) },
    })
  }

  return (
    <>
      <Dialog open={!!task} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Task details</DialogTitle>
          </DialogHeader>
          {task && (
            <>
              <TaskForm
                initial={task}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                submitting={updateMut.isPending}
                submitLabel="Save changes"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={handleComplete} disabled={task.status === 'DONE'}>
                  Mark complete
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
                  Delete task
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete task?"
        description="This task will be permanently deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )
}
