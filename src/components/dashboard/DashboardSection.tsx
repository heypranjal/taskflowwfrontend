import type { ReactNode } from 'react'

interface Props {
  title: string
  count?: number
  children: ReactNode
  tone?: 'default' | 'danger'
}

export function DashboardSection({ title, count, children, tone = 'default' }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className={
          'text-xs font-semibold uppercase tracking-wider ' +
          (tone === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')
        }>
          {title}
          {typeof count === 'number' && <span className="ml-2 text-muted-foreground/70">{count}</span>}
        </h2>
      </div>
      {children}
    </section>
  )
}
