import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { TasksPage } from '@/pages/TasksPage'
import { TimelinePage } from '@/pages/TimelinePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { TaskModal } from '@/components/tasks/TaskModal'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/lib/auth'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export default function App() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return
      if (!user) return
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setQuickAddOpen(true) }
      if (e.key === '/') {
        const search = document.querySelector<HTMLInputElement>('input[placeholder="Search tasks…"]')
        if (search) { e.preventDefault(); search.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [user])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
              <TaskModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
