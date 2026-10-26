'use client'
import { useCurtain } from './Transition'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Search } from './Icons'

let lastFocus: HTMLElement | null = null

export type PaletteProject = { slug: string; title: string; stage: string }
type Item = { id: string; group: string; label: string; hint?: string; run: () => void }

export function CommandPalette({ projects, resumeUrl }: { projects: PaletteProject[]; resumeUrl?: string | null }) {
  const { go: navigate } = useCurtain()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  const close = useCallback(() => {
    setOpen(false)
    setQ('')
    setIdx(0)
    lastFocus?.focus()
  }, [])

  const go = useCallback((href: string) => { close(); navigate(href) }, [close, navigate])

  const items: Item[] = useMemo(() => {
    const base: Item[] = [
      { id: 'home', group: 'Go to', label: 'Top of the page', run: () => go('/') },
      { id: 'about', group: 'Go to', label: 'About', run: () => go('/#about') },
      { id: 'services', group: 'Go to', label: 'Services', run: () => go('/#services') },
      { id: 'work', group: 'Go to', label: 'Featured work', run: () => go('/#work') },
      { id: 'allwork', group: 'Go to', label: 'All work, by service', run: () => go('/work') },
      { id: 'tech', group: 'Go to', label: 'Technologies', run: () => go('/#technologies') },
      { id: 'interests', group: 'Go to', label: 'Interests', run: () => go('/#interests') },
      { id: 'journey', group: 'Go to', label: 'Journey', run: () => go('/#journey') },
      { id: 'contact', group: 'Go to', label: 'Contact', run: () => go('/#contact') },
      ...projects.map((p) => ({ id: `p-${p.slug}`, group: 'Projects', label: p.title, hint: p.stage, run: () => go(`/work/${p.slug}`) })),
      { id: 'calm', group: 'Actions', label: 'Toggle calm motion', run: () => { close(); window.dispatchEvent(new Event('si:calm')) } },
      { id: 'a11y', group: 'Actions', label: 'Open accessibility settings', run: () => { setOpen(false); window.setTimeout(() => window.dispatchEvent(new Event('si:a11y')), 30) } },
    ]
    if (resumeUrl) base.push({ id: 'cv', group: 'Actions', label: 'Download CV (PDF)', run: () => { close(); window.open(resumeUrl, '_blank', 'noopener') } })
    return base
  }, [projects, resumeUrl, go, close])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return items
    return items.filter((i) => `${i.label} ${i.group} ${i.hint || ''}`.toLowerCase().includes(t))
  }, [items, q])

  useEffect(() => {
    const show = () => { lastFocus = document.activeElement as HTMLElement; setOpen(true) }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (open) close(); else show() }
    }
    window.addEventListener('si:palette', show)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('si:palette', show); window.removeEventListener('keydown', onKey) }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [idx, open])

  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[idx]?.run() }
    else if (e.key === 'Tab') { e.preventDefault() } // focus stays on the input: the listbox is driven by aria-activedescendant
  }

  let lastGroup = ''
  return (
    <div className="palette-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={onKeyDown}>
        <div className="palette__input-wrap">
          <Search />
          <input
            ref={inputRef}
            className="palette__input"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={filtered[idx] ? `${uid}-${filtered[idx].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search pages, projects and actions"
            placeholder="Search pages, projects, actions…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0) }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="palette__list" id={`${uid}-list`} role="listbox" aria-label="Results" ref={listRef}>
          {filtered.length === 0 && <div className="palette__empty" role="status">No matches for “{q}”.</div>}
          {filtered.map((it, i) => {
            const header = it.group !== lastGroup ? (lastGroup = it.group) : null
            return (
              <div key={it.id} role="presentation">
                {header && <div className="palette__group" role="presentation">{header}</div>}
                <div id={`${uid}-${it.id}`} role="option" aria-selected={i === idx} className="palette__item" onMouseMove={() => setIdx(i)} onClick={() => it.run()}>
                  {it.label}{it.hint && <small>{it.hint}</small>}
                </div>
              </div>
            )
          })}
        </div>
        <div className="palette__foot" aria-hidden="true"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>
  )
}
