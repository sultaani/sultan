'use client'
import Link from 'next/link'
import { TLink } from './Transition'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Accessibility, Close, Menu, Moon, Search, Sun } from './Icons'
import { toggleWorld, useWorld } from '@/lib/world'

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'technologies', label: 'Tech' },
  { id: 'interests', label: 'Interests' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Header({ siteName }: { siteName: string }) {
  const pathname = usePathname()
  const mark = siteName.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 3) || 'SI'
  const home = pathname === '/'
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [spy, setSpy] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const world = useWorld()

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      // On the home page the header stays clear until the hero has scrolled away
      setStuck(y > (location.pathname === '/' ? window.innerHeight - 110 : 24))
      setHidden(y > 240 && y > last + 4) // slide away when reading down, return on scroll up
      if (y < last - 4 || y <= 240) setHidden(false)
      last = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!home) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('main [data-section]'))
    const on = () => {
      const line = window.innerHeight * 0.4
      let cur = ''
      for (const e of els) { const r = e.getBoundingClientRect(); if (r.top <= line && r.bottom > line) cur = e.dataset.section || '' }
      setSpy(cur)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [home])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open])

  const cur = (id: string) => (home && spy === id ? 'true' : undefined)

  return (
    <header className={`site-header${stuck ? ' is-stuck' : ''}${home && world === 'night' && !stuck && !open ? ' on-night' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="container">
        <TLink href="/" className="brand" aria-label={`${siteName}, home`} onClick={() => setOpen(false)}><span aria-hidden="true">{mark}</span><span className="brand__dot" aria-hidden="true">.</span></TLink>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => <Link key={n.id} href={`/#${n.id}`} aria-current={cur(n.id)}>{n.label}</Link>)}
        </nav>

        <div className="header-tools">
          <button type="button" className="icon-btn" onClick={() => window.dispatchEvent(new Event('si:palette'))} aria-label="Open command menu (Ctrl K)" aria-haspopup="dialog"><Search /></button>
          <button type="button" className="icon-btn" onClick={toggleWorld} aria-label={world === 'night' ? 'Switch to day' : 'Switch to night'}>{world === 'night' ? <Sun /> : <Moon />}</button>
          <button type="button" className="icon-btn" onClick={() => window.dispatchEvent(new Event('si:a11y'))} aria-label="Accessibility settings" aria-haspopup="dialog"><Accessibility /></button>
          <button ref={toggleRef} type="button" className="icon-btn menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>{open ? <Close /> : <Menu />}</button>
        </div>
      </div>

      <nav id="mobile-nav" className={`mobile-nav${open ? ' is-open' : ''}`} aria-label="Mobile" inert={!open}>
        {NAV.map((n) => <Link key={n.id} href={`/#${n.id}`} onClick={() => setOpen(false)}>{n.label}</Link>)}
        <Link href="/work" onClick={() => setOpen(false)}>All work</Link>
      </nav>
    </header>
  )
}
