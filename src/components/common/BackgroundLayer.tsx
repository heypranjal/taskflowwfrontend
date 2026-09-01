import RecursiveErosionBackground from '@/components/ui/recursive-erosion'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface Props {
  /** Higher = brighter. Cap around 1. On busy pages set ~0.4 to keep content readable. */
  brightness?: number
  /** Only render on medium+ screens (avoids GPU cost on phones). */
  desktopOnly?: boolean
  className?: string
}

/**
 * Fixed full-viewport particle-sphere background. Pointer-events off so it
 * never blocks clicks. Sits at z-index 0; put page content in a container
 * with `relative z-10` to layer above it.
 */
export function BackgroundLayer({ brightness = 1, desktopOnly = false, className }: Props) {
  const { theme } = useTheme()
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        desktopOnly && 'hidden md:block',
        className,
      )}
    >
      <RecursiveErosionBackground
        mode={theme}
        brightness={brightness}
        className="h-full w-full"
      />
    </div>
  )
}
