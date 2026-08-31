import { api } from './api'
import type { Project, ProjectInput, Task } from '@/types'

export const projectService = {
  async list(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects')
    return data
  },
  async get(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`)
    return data
  },
  async tasks(id: string): Promise<Task[]> {
    const { data } = await api.get<Task[]>(`/projects/${id}/tasks`)
    return data
  },
  async create(input: ProjectInput): Promise<Project> {
    const { data } = await api.post<Project>('/projects', input)
    return data
  },
  async update(id: string, input: ProjectInput): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, input)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`)
  },
}
