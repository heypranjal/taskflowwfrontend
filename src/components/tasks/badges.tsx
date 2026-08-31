import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Priority, Status } from '@/types'

// URGENT is the cut-red accent; all others are soft pastels.
const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  MEDIUM: 'border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
  HIGH: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  URGENT: 'border-transparent bg-red-600 text-white dark:bg-red-600',
}

const STATUS_STYLES: Record<Status, string> = {
  TODO: 'border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800',
  IN_PROGRESS: 'border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-900',
  BLOCKED: 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900',
  DONE: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900',
}

const STATUS_LABELS: Record<Status, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  BLOCKED: 'Blocked',
  DONE: 'Done',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={cn(PRIORITY_STYLES[priority])}>{PRIORITY_LABELS[priority]}</Badge>
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge className={cn(STATUS_STYLES[status])}>{STATUS_LABELS[status]}</Badge>
}

// Pastel background palette applied to the whole task card / calendar event.
// URGENT is intentionally louder to draw attention.
export const PRIORITY_EVENT_STYLES: Record<Priority, string> = {
  LOW: 'bg-slate-50 border-slate-200 hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-800',
  MEDIUM: 'bg-sky-50 border-sky-200 hover:border-sky-300 dark:bg-sky-950/40 dark:border-sky-900',
  HIGH: 'bg-amber-50 border-amber-200 hover:border-amber-300 dark:bg-amber-950/40 dark:border-amber-900',
  URGENT: 'bg-red-600 text-white border-red-700 hover:border-red-800 dark:bg-red-600 dark:border-red-700',
}

// Small accent bar shown at the top of an event card (like the reference).
export const PRIORITY_ACCENT: Record<Priority, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-sky-400',
  HIGH: 'bg-amber-400',
  URGENT: 'bg-red-800',
}
