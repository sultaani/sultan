import { FaJava, FaLinkedin } from 'react-icons/fa6'
import { FaEnvelope } from 'react-icons/fa6'
import { BRAND_PATHS } from './brand-paths'

/** Relative luminance, so near-black or near-white brand colours fall back to terracotta on the light background. */
function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

/** The colour an icon takes on hover. */
export function brandGlow(key: string): string {
  const b = BRAND_PATHS[key]
  if (key === 'java') return '#c26a0e'
  if (key === 'linkedin') return '#0a66c2'
  if (!b) return '#b9472a'
  const l = lum(b.hex)
  return l < 0.04 || l > 0.45 ? '#b9472a' : b.hex
}

/**
 * Brand icon by key. Brand marks come from the `simple-icons` and `react-icons` libraries (never hand-drawn).
 * Canva is not published in either library, so it renders as a neutral wordmark tile instead of an invented logo.
 */
export function BrandIcon({ name, size = 28, title }: { name: string; size?: number; title?: string }) {
  const common = { width: size, height: size, 'aria-hidden': title ? undefined : true, role: title ? 'img' : undefined, 'aria-label': title, focusable: false } as const
  if (name === 'java') return <FaJava size={size} aria-hidden={common['aria-hidden']} focusable={false} />
  if (name === 'linkedin') return <FaLinkedin size={size} aria-hidden={common['aria-hidden']} focusable={false} />
  if (name === 'email') return <FaEnvelope size={size} aria-hidden={common['aria-hidden']} focusable={false} />
  const b = BRAND_PATHS[name]
  if (b) return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...common}><path d={b.path} /></svg>
  )
  return (
    <svg viewBox="0 0 48 48" {...common}>
      <text x="24" y="28" textAnchor="middle" fontFamily="inherit" fontWeight="500" fontSize={name.length > 4 ? 12 : 19} fill="currentColor">{name.length > 6 ? name.slice(0, 2) : name}</text>
    </svg>
  )
}
