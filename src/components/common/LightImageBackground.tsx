/**
 * Full-viewport photo background — LIGHT MODE ONLY.
 * Default image is hosted on Supabase Storage; override via prop if needed.
 * A soft scrim keeps glass cards and text readable over the photo.
 */
const DEFAULT_SRC =
  'https://kasocxzookifzqsvwigd.supabase.co/storage/v1/object/public/images/%20.jpg'

interface Props {
  src?: string
  /** 0..1 — how much to fade the photo toward the background color. */
  scrim?: number
}

export function LightImageBackground({ src = DEFAULT_SRC, scrim = 0.25 }: Props) {
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
