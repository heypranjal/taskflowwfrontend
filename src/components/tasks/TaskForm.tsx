import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Priority, Status, Task, TaskInput } from '@/types'
import { useProjects } from '@/hooks/useProjects'

interface Props {
  initial?: Task | null
  defaultProjectId?: string
  onSubmit: (input: TaskInput) => void
  onCancel: () => void
  submitting?: boolean
  submitLabel?: string
}

const NO_PROJECT = '__none__'

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function TaskForm({ initial, defaultProjectId, onSubmit, onCancel, submitting, submitLabel = 'Save' }: Props) {
  const projectsQ = useProjects()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? todayIso())
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM')
  const [status, setStatus] = useState<Status>(initial?.status ?? 'TODO')
  const [projectId, setProjectId] = useState<string>(initial?.projectId ?? defaultProjectId ?? NO_PROJECT)
  const [titleError, setTitleError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description ?? '')
      setNotes(initial.notes ?? '')
      setDueDate(initial.dueDate)
      setPriority(initial.priority)
      setStatus(initial.status)
      setProjectId(initial.projectId ?? NO_PROJECT)
    }
  }, [initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setTitleError('Title is required'); return }
    setTitleError(null)
    onSubmit({
      title: title.trim(),
      description: description || undefined,
      notes: notes || undefined,
      dueDate,
      priority,
      status,
      projectId: projectId === NO_PROJECT ? null : projectId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus />
        {titleError && <p className="text-xs text-destructive">{titleError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To do</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="project">Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger id="project"><SelectValue placeholder="No project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PROJECT}>No project</SelectItem>
              {projectsQ.data?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}
