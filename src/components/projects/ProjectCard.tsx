import { Link } from 'react-router-dom'
import type { Project } from '@/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="glass block rounded-[20px] p-5 transition-transform hover:-translate-y-0.5"
    >
      <p className="text-sm font-semibold uppercase tracking-wide">{project.name}</p>
      {project.description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
      )}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <span className="text-foreground font-medium">{project.activeTaskCount} active</span>
        <span className="text-muted-foreground">{project.completedTaskCount} completed</span>
      </div>
    </Link>
  )
}
