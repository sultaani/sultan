'use client'
import { useEffect, useRef } from 'react'

const LINKS = 'a, button, [role="button"], [role="switch"], [role="radio"], summary, label[for], select, [data-magnetic]'
const TEXT = 'input, textarea'

/**
 * Custom cursor: a dot that tracks the pointer and a ring that follows it with a little lag.
 * The ring grows over links, shows a short label where one is set (data-cursor-label), and buttons lean toward it.
 * Only for a mouse. Off in Calm mode, when switched off in Accessibility settings, and on touch screens.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const ringEl = ring.current
    const dotEl = dot.current
    const labelEl = label.current
    if (!ringEl || !dotEl || !labelEl) return

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0
    let magnet: HTMLElement | null = null
    const enabled = () => fine.matches && html.dataset.cursor !== 'off' && html.dataset.calm !== 'true'
    const sync = () => html.classList.toggle('cc', enabled())

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }

    const release = () => { if (magnet) { magnet.style.setProperty('--mx', '0px'); magnet.style.setProperty('--my', '0px'); magnet = null } }

    const onMove = (e: PointerEvent) => {
      if (!enabled() || e.pointerType !== 'mouse') return
      x = e.clientX; y = e.clientY
      if (!html.classList.contains('cc-on')) { rx = x; ry = y; html.classList.add('cc-on') }
      const t = e.target as HTMLElement | null
      const link = t?.closest<HTMLElement>(LINKS) ?? null
      ringEl.classList.toggle('is-link', !!link)
      ringEl.classList.toggle('is-text', !!t?.closest(TEXT))
      const text = t?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel || ''
      if (labelEl.textContent !== text) labelEl.textContent = text
      ringEl.classList.toggle('has-label', !!text)

      const m = t?.closest<HTMLElement>('.btn, [data-magnetic]') ?? null
      if (m !== magnet) release()
      if (m) {
        const r = m.getBoundingClientRect()
        m.style.setProperty('--mx', `${((x - (r.left + r.width / 2)) * 0.22).toFixed(1)}px`)
        m.style.setProperty('--my', `${((y - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`)
        magnet = m
      }
      kick()
    }
    const onDown = () => ringEl.classList.add('is-down')
    const onUp = () => ringEl.classList.remove('is-down')
    const onLeave = () => { html.classList.remove('cc-on'); release() }

    sync()
    const mo = new MutationObserver(sync)
    mo.observe(html, { attributes: true, attributeFilter: ['data-cursor', 'data-calm'] })
    fine.addEventListener('change', sync)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    html.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      fine.removeEventListener('change', sync)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('pointerleave', onLeave)
      html.classList.remove('cc', 'cc-on')
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring"><span ref={label} className="cursor__label" /></div>
      <div ref={dot} className="cursor__dot" />
    </div>
  )
}
