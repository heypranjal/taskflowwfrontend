import { Calendar, Check, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { PriorityBadge, StatusBadge, PRIORITY_EVENT_STYLES, PRIORITY_ACCENT } from './badges'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface Props {
  task: Task
  onClick?: () => void
  onComplete?: () => void
  onDelete?: () => void
  compact?: boolean
}

export function TaskCard({ task, onClick, onComplete, onDelete, compact }: Props) {
  const done = task.status === 'DONE'
  const urgent = task.priority === 'URGENT'
  const dueLabel = format(parseISO(task.dueDate), 'MMM d')

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[14px] transition-all cursor-pointer',
        urgent
          ? cn('border shadow-sm hover:shadow-md', PRIORITY_EVENT_STYLES[task.priority])
          : 'glass hover:-translate-y-0.5',
        done && 'opacity-60',
        compact ? 'p-2.5' : 'p-3',
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() }
      }}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1', PRIORITY_ACCENT[task.priority])} aria-hidden />

      <div className="flex items-start gap-3 pt-1">
        <button
          type="button"
          aria-label={done ? 'Reopen task' : 'Mark complete'}
          onClick={(e) => { e.stopPropagation(); onComplete?.() }}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            done
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : urgent
                ? 'border-white/70 hover:border-white'
                : 'border-foreground/30 hover:border-foreground/60',
          )}
        >
          {done && <Check className="h-3 w-3" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm font-semibold leading-snug break-words',
              done && 'line-through',
              urgent ? 'text-white' : 'text-foreground',
            )}>
              {task.title}
            </p>
          </div>

          {task.projectName && (
            <p className={cn(
              'mt-0.5 text-xs truncate',
              urgent ? 'text-white/80' : 'text-muted-foreground',
            )}>
              {task.projectName}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={cn(
              'inline-flex items-center gap-1 text-[11px]',
              urgent ? 'text-white/90' : 'text-muted-foreground',
            )}>
              <Calendar className="h-3 w-3" />
              {dueLabel}
            </span>
            <PriorityBadge priority={task.priority} />
            {!compact && <StatusBadge status={task.status} />}
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            aria-label="Delete task"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1',
              urgent ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-destructive',
            )}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
