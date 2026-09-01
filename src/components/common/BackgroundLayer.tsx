import NeonMesh from '@/components/ui/neon-mesh'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface Props {
  /** Only render on medium+ screens (avoids GPU cost on phones). */
  desktopOnly?: boolean
  /** Absorbs pointer events so the mesh reacts to mouse (default: false — passes clicks through). */
  interactive?: boolean
  className?: string
}

/**
 * Fixed full-viewport 3D Verlet-cloth background. Sits at z-index 0;
 * page content should live in a container with `relative z-10`.
 */
export function BackgroundLayer({ desktopOnly = false, interactive = false, className }: Props) {
  const { theme } = useTheme()
  return (
    <div
      aria-hidden={!interactive}
      className={cn(
        'fixed inset-0 z-0 overflow-hidden',
        interactive ? 'pointer-events-auto' : 'pointer-events-none',
        desktopOnly && 'hidden md:block',
        className,
      )}
    >
      <NeonMesh mode={theme} showOverlay={false} className="h-full w-full" />
    </div>
  )
}
