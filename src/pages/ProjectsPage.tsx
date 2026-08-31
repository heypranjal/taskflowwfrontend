import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { PageHeader } from '@/components/layout/PageHeader'
import { useProjects } from '@/hooks/useProjects'

export function ProjectsPage() {
  const projectsQ = useProjects()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Projects' }]}
        title="Projects"
        subtitle="Group your work into focused streams."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        }
      />

      <div>
        {projectsQ.isLoading && <LoadingSkeleton rows={3} />}
        {projectsQ.isError && <ErrorState message="Unable to load projects." onRetry={() => projectsQ.refetch()} />}
        {projectsQ.data && projectsQ.data.length === 0 && (
          <EmptyState
            title="Create your first project."
            description="Group related tasks together."
            action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New project</Button>}
          />
        )}
        {projectsQ.data && projectsQ.data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectsQ.data.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

      <ProjectModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
