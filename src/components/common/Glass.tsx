import { forwardRef, useCallback, useRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useLiquidGlass } from '@/hooks/useLiquidGlass'
import type { LiquidGlassOptions } from '@/lib/liquid-glass'

type GlassProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType
  /** Enable the real SVG-refraction effect (Chromium-only; other browsers get frosted blur). */
  refract?: boolean
  /** Enable cursor-tracked highlight sheen. */
  glare?: boolean
  glassOptions?: LiquidGlassOptions
}

export const Glass = forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { as, refract = true, glare = false, glassOptions, className, onPointerMove, ...rest },
  forwardedRef,
) {
  const Component = (as ?? 'div') as ElementType
  const localRef = useRef<HTMLDivElement | null>(null)
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) (forwardedRef as any).current = node
    },
    [forwardedRef],
  )

  useLiquidGlass(localRef, glassOptions, refract)

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (glare) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      ;(e.currentTarget as HTMLElement).style.setProperty('--gx', `${gx}%`)
      ;(e.currentTarget as HTMLElement).style.setProperty('--gy', `${gy}%`)
    }
    onPointerMove?.(e)
  }

  return (
    <Component
      ref={setRefs}
      className={cn('glass', glare && 'glass-glare', className)}
      onPointerMove={handleMove}
      {...rest}
    />
  )
})
