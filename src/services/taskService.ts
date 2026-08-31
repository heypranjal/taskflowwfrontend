import { api } from './api'
import type { Task, TaskInput, TaskFilters, Status } from '@/types'

export const taskService = {
  async list(filters: TaskFilters = {}): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks', { params: filters })
    return data
  },
  async get(id: string): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`)
    return data
  },
  async create(input: TaskInput): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', input)
    return data
  },
  async update(id: string, input: TaskInput): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, input)
    return data
  },
  async updateStatus(id: string, status: Status): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}/status`, { status })
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
