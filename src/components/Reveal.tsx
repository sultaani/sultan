'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Adds `.is-in` to `.reveal` elements once they are in view, or already above the viewport.
 * It is scroll-driven rather than IntersectionObserver-driven on purpose: a jump link (Contact in the nav, a hash URL, a
 * restored scroll position) can skip whole sections, and an observer never fires for something that was never on screen,
 * which left Journey and Contact invisible. It re-checks on route changes and when new elements appear.
 */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const vh = window.innerHeight
      let n = 0
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)').forEach((e) => {
        if (e.getBoundingClientRect().top < vh * 0.92) {
          if (!e.style.getPropertyValue('--d')) e.style.setProperty('--d', `${(n++ % 4) * 70}ms`)
          e.classList.add('is-in')
        }
      })
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(check) }
    queue()
    const late = [window.setTimeout(queue, 400), window.setTimeout(queue, 1500)]
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    window.addEventListener('hashchange', queue)
    const mo = new MutationObserver(queue)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(raf)
      late.forEach(clearTimeout)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      window.removeEventListener('hashchange', queue)
      mo.disconnect()
    }
  }, [pathname])
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
