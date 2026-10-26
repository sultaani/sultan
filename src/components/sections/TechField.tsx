'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { BrandIcon, brandGlow } from '@/lib/tech-icons'

export type Tech = { name: string; icon?: string | null; image?: { src: string; width: number; height: number } | null }

/** Icons drift on their own and shy away from the pointer. */
export function TechField({ items }: { items: Tech[] }) {
  const root = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const html = document.documentElement
    const tiles = Array.from(el.querySelectorAll<HTMLElement>('.tech'))
    let raf = 0
    const reset = () => tiles.forEach((t) => { t.style.setProperty('--px', '0px'); t.style.setProperty('--py', '0px') })
    const onMove = (e: PointerEvent) => {
      if (html.dataset.calm === 'true' || e.pointerType !== 'mouse') return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        for (const t of tiles) {
          const r = t.getBoundingClientRect()
          const dx = r.left + r.width / 2 - e.clientX
          const dy = r.top + r.height / 2 - e.clientY
          const d = Math.hypot(dx, dy)
          const f = Math.max(0, 1 - d / 190)
          t.style.setProperty('--px', `${(dx / (d || 1)) * f * 34}px`)
          t.style.setProperty('--py', `${(dy / (d || 1)) * f * 34}px`)
        }
      })
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', reset) }
  }, [])

  return (
    <ul ref={root} className="techfield" aria-label="Technologies I work with">
      {items.map((t, i) => (
        <li key={t.name} className="tech" style={{ ['--i' as string]: i, ['--glow' as string]: brandGlow(t.icon || '') }}>
          <span className="tech__float">
            <span className="tech__tile">
              {t.image ? <Image src={t.image.src} alt="" width={t.image.width} height={t.image.height} /> : t.icon ? <BrandIcon name={t.icon} size={34} /> : <span className="tech__letter">{t.name.slice(0, 2)}</span>}
            </span>
            <span className="tech__name">{t.name}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
