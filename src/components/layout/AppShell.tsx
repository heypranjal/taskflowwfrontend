import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { BackgroundLayer } from '@/components/common/BackgroundLayer'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      {/* Ambient 3D mesh — desktop only to keep mobile snappy. */}
      <BackgroundLayer desktopOnly />
      {/* Veil to soften the mesh under app content while keeping the glow visible. */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden md:block bg-background/70"
        aria-hidden
      />

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
