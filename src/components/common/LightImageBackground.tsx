/**
 * Full-viewport photo background — LIGHT MODE ONLY.
 * Drop the image at `frontend/public/bg-light.jpg` (or override via prop).
 * A soft white scrim keeps glass cards and text readable over the photo.
 */
interface Props {
  src?: string
  /** 0..1 — how much to fade the photo toward the background color. */
  scrim?: number
}

export function LightImageBackground({ src = '/bg-light.jpg', scrim = 0.25 }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden dark:hidden"
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: scrim }}
      />
    </div>
  )
}
