export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type Status = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'

export interface Task {
  id: string
  title: string
  description?: string | null
  notes?: string | null
  dueDate: string // YYYY-MM-DD
  priority: Priority
  status: Status
  projectId?: string | null
  projectName?: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description?: string
  notes?: string
  dueDate: string
  priority: Priority
  status: Status
  projectId?: string | null
}

export interface Project {
  id: string
  name: string
  description?: string | null
  activeTaskCount: number
  completedTaskCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  name: string
  description?: string
}

export interface DashboardData {
  overdue: Task[]
  today: Task[]
  thisWeek: Task[]
  upcoming: Task[]
  counts: {
    overdue: number
    today: number
    thisWeek: number
    upcoming: number
  }
}

export interface TaskFilters {
  status?: Status
  priority?: Priority
  projectId?: string
  from?: string
  to?: string
  search?: string
}
