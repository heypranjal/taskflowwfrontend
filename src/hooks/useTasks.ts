import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/taskService'
import type { Status, TaskFilters, TaskInput } from '@/types'

const KEYS = {
  all: ['tasks'] as const,
  list: (f: TaskFilters) => ['tasks', 'list', f] as const,
  one: (id: string) => ['tasks', 'detail', id] as const,
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['tasks'] })
  qc.invalidateQueries({ queryKey: ['dashboard'] })
  qc.invalidateQueries({ queryKey: ['projects'] })
}

export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => taskService.list(filters),
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: id ? KEYS.one(id) : ['tasks', 'detail', 'null'],
    queryFn: () => taskService.get(id!),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => taskService.create(input),
    onSuccess: () => invalidateAll(qc),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => taskService.update(id, input),
    onSuccess: () => invalidateAll(qc),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => taskService.updateStatus(id, status),
    onSuccess: () => invalidateAll(qc),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taskService.remove(id),
    onSuccess: () => invalidateAll(qc),
  })
}
