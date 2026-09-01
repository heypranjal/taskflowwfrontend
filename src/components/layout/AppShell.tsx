import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { LightImageBackground } from '@/components/common/LightImageBackground'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Photo background — light mode only; dims to bg-background in dark. */}
      <LightImageBackground scrim={0} />

      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
