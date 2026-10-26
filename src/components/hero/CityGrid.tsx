'use client'
import { useEffect, useRef } from 'react'

/**
 * The city: a skyline of terracotta blocks standing on a street grid.
 * Blocks rise on load and lean toward the pointer. Decorative; static in Calm mode.
 */
const N = 26
function seeded(i: number) {
  const x = Math.sin(i * 91.7 + 13.1) * 43758.5453
  return x - Math.floor(x)
}
const BLOCKS = Array.from({ length: N }, (_, i) => ({
  h: 22 + Math.round(seeded(i) * 70),
  w: 1 + Math.floor(seeded(i + 40) * 3),
  tone: Math.floor(seeded(i + 80) * 4),
}))

export function CityGrid() {
  const ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const blocks = Array.from(el.children) as HTMLElement[]
    let raf = 0
    let x = -1
    const apply = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      for (const b of blocks) {
        const br = b.getBoundingClientRect()
        const cx = br.left + br.width / 2
        const d = Math.abs(cx - x) / (r.width / 6)
        b.style.setProperty('--lift', x < 0 ? '0' : String(Math.max(0, 1 - d).toFixed(3)))
      }
    }
    const onMove = (e: PointerEvent) => {
      if (document.documentElement.dataset.calm === 'true' || e.pointerType !== 'mouse') return
      x = e.clientX
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeave = () => { x = -1; if (!raf) raf = requestAnimationFrame(apply) }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <ul ref={ref} className="city" aria-hidden="true">
      {BLOCKS.map((b, i) => (
        <li key={i} className={`city__block city__block--${b.tone}`} style={{ ['--h' as string]: `${b.h}%`, ['--w' as string]: b.w, ['--i' as string]: i }} />
      ))}
    </ul>
  )
}
