import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import type { ProjectInput } from '@/types'

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['projects'] })
  qc.invalidateQueries({ queryKey: ['tasks'] })
  qc.invalidateQueries({ queryKey: ['dashboard'] })
}

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: () => projectService.list() })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'detail', id ?? 'null'],
    queryFn: () => projectService.get(id!),
    enabled: !!id,
  })
}

export function useProjectTasks(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'tasks', id ?? 'null'],
    queryFn: () => projectService.tasks(id!),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => projectService.create(input),
    onSuccess: () => invalidate(qc),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProjectInput }) => projectService.update(id, input),
    onSuccess: () => invalidate(qc),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.remove(id),
    onSuccess: () => invalidate(qc),
  })
}
