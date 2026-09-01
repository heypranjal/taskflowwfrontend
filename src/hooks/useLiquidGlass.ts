import { useEffect, type RefObject } from 'react'
import { liquidGlass, type LiquidGlassOptions } from '@/lib/liquid-glass'

/**
 * Applies liquid-glass refraction to the element referenced by `ref`.
 * Chromium browsers get real SVG displacement; other browsers get frosted blur.
 * Handles teardown on unmount and re-init if the ref target changes.
 */
export function useLiquidGlass<T extends HTMLElement>(
  ref: RefObject<T>,
  opts?: LiquidGlassOptions,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const instance = liquidGlass(el, opts)
    return () => instance.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ref.current])
}
