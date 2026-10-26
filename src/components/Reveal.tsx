'use client'
import { useEffect, useRef } from 'react'

/** Adds `.is-in` when the element scrolls into view. CSS keeps content visible without JS. */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            io.unobserve(en.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((e, i) => {
      if (!e.style.getPropertyValue('--d')) e.style.setProperty('--d', `${(i % 4) * 70}ms`)
      io.observe(e)
    })
    return () => io.disconnect()
  })
  return null
}

export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: { children: React.ReactNode; as?: 'div' | 'section' | 'li' | 'p'; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement | null>(null)
  const T = Tag as React.ElementType
  return (
    <T ref={ref} className={`reveal ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </T>
  )
}
