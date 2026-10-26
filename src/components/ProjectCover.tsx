/**
 * Deterministic generative cover used when a project has no screenshot yet: a terracotta city-plan sheet.
 * Pure SVG, server-rendered, decorative.
 */
const RGB: Record<string, string> = { green: '90 110 75', cyan: '71 105 122', amber: '138 94 18', violet: '123 75 99', rose: '185 71 42' }

function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function ProjectCover({ slug, accent = 'green', label }: { slug: string; accent?: string; label?: string }) {
  const r = rng(slug)
  const rgb = RGB[accent] || RGB.green
  const W = 800, H = 480
  const id = `c-${slug.replace(/[^a-z0-9]/gi, '')}`
  const shapes = Array.from({ length: 5 }, () => ({ x: 80 + r() * 560, y: 60 + r() * 280, w: 70 + r() * 160, h: 50 + r() * 110, k: Math.floor(r() * 3) }))
  const cx = 120 + r() * 560, cy = 110 + r() * 260
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || ''} aria-hidden={label ? undefined : true} focusable="false">
      <defs>
        <radialGradient id={`${id}-g`} cx={`${cx / 8}%`} cy={`${cy / 4.8}%`} r="70%">
          <stop offset="0" stopColor={`rgb(${rgb})`} stopOpacity="0.28" /><stop offset="1" stopColor="#efe3d5" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-p`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke={`rgb(${rgb})`} strokeOpacity="0.16" /></pattern>
      </defs>
      <rect width={W} height={H} fill="#efe3d5" />
      <rect width={W} height={H} fill={`url(#${id}-p)`} />
      <rect width={W} height={H} fill={`url(#${id}-g)`} />
      <g fill="none" stroke={`rgb(${rgb})`} strokeWidth="2" strokeOpacity="0.85">
        {shapes.map((s, i) => s.k === 0
          ? <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx="10" strokeDasharray={i % 2 ? '6 6' : undefined} />
          : s.k === 1
            ? <circle key={i} cx={s.x} cy={s.y} r={s.h / 2} />
            : <path key={i} d={`M${s.x} ${s.y + s.h}L${s.x + s.w / 2} ${s.y}L${s.x + s.w} ${s.y + s.h}Z`} />)}
        <path d={`M${shapes[0].x} ${shapes[0].y}L${shapes[1].x} ${shapes[1].y}L${shapes[2].x} ${shapes[2].y}L${shapes[3].x} ${shapes[3].y}`} strokeOpacity="0.35" strokeDasharray="2 7" />
      </g>
      <circle cx={cx} cy={cy} r="7" fill={`rgb(${rgb})`} />
      <circle cx={cx} cy={cy} r="22" fill="none" stroke={`rgb(${rgb})`} strokeOpacity="0.5" />
    </svg>
  )
}
