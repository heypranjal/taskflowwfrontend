import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Crumb { label: string; to?: string }

interface Props {
  crumbs?: Crumb[]
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ crumbs, title, subtitle, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/50">/</span>}
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground transition-colors">{c.label}</Link>
                ) : (
                  <span className={i === crumbs.length - 1 ? 'text-foreground' : ''}>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
