import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: number; kind: ToastKind; message: string }
interface ToastContextValue { toast: (kind: ToastKind, message: string) => void }

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const toast = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s, { id, kind, message }])
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'min-w-[240px] rounded-md border px-4 py-3 text-sm shadow-lg animate-fade-in bg-card text-card-foreground',
              t.kind === 'success' && 'border-emerald-500/40',
              t.kind === 'error' && 'border-destructive/60',
              t.kind === 'info' && 'border-border',
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
