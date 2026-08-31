import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import { useCreateTask } from '@/hooks/useTasks'
import { useToast } from '@/components/ui/toast'
import type { TaskInput } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProjectId?: string
}

export function TaskModal({ open, onOpenChange, defaultProjectId }: Props) {
  const createMut = useCreateTask()
  const { toast } = useToast()

  function handleSubmit(input: TaskInput) {
    createMut.mutate(input, {
      onSuccess: () => {
        toast('success', 'Task created')
        onOpenChange(false)
      },
      onError: (err: any) => toast('error', err.friendlyMessage ?? 'Failed to create task'),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>
        <TaskForm
          defaultProjectId={defaultProjectId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitting={createMut.isPending}
          submitLabel="Create task"
        />
      </DialogContent>
    </Dialog>
  )
}
