'use client'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Close } from './Icons'

type Prefs = { calm: boolean; contrast: boolean; spacing: boolean; text: 'md' | 'lg' | 'xl'; cursor: boolean }
const KEY = 'si-a11y'
const SERVER_SNAPSHOT = 'false|normal|normal|md|on'

let lastFocus: HTMLElement | null = null

/**
 * The <html> data attributes are the single source of truth. The pre-paint script in the layout sets them
 * from localStorage before first paint; this panel reads them (via a MutationObserver subscription) and writes them.
 */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-calm', 'data-contrast', 'data-spacing', 'data-text', 'data-cursor'] })
  return () => mo.disconnect()
}
function snapshot() {
  const d = document.documentElement.dataset
  return `${d.calm ?? 'false'}|${d.contrast ?? 'normal'}|${d.spacing ?? 'normal'}|${d.text ?? 'md'}|${d.cursor ?? 'on'}`
}
function parse(s: string): Prefs {
  const [calm, contrast, spacing, text, cursor] = s.split('|')
  return { calm: calm === 'true', contrast: contrast === 'high', spacing: spacing === 'comfortable', text: (text as Prefs['text']) || 'md', cursor: cursor !== 'off' }
}

function persist(p: Prefs) {
  const d = document.documentElement
  d.dataset.calm = String(p.calm)
  d.dataset.contrast = p.contrast ? 'high' : 'normal'
  d.dataset.spacing = p.spacing ? 'comfortable' : 'normal'
  d.dataset.text = p.text
  d.dataset.cursor = p.cursor ? 'on' : 'off'
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage unavailable: preferences just won't persist */ }
}

function Switch({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="a11y-row">
      <div><strong id={`${id}-l`}>{label}</strong><small id={`${id}-h`}>{hint}</small></div>
      <button type="button" role="switch" className="switch" aria-checked={checked} aria-labelledby={`${id}-l`} aria-describedby={`${id}-h`} onClick={() => onChange(!checked)} />
    </div>
  )
}

export function A11yPanel() {
  const [open, setOpen] = useState(false)
  const prefs = parse(useSyncExternalStore(subscribe, snapshot, () => SERVER_SNAPSHOT))
  const panelRef = useRef<HTMLDivElement>(null)

  const update = useCallback((patch: Partial<Prefs>) => {
    persist({ ...parse(snapshot()), ...patch })
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    lastFocus?.focus()
  }, [])

  useEffect(() => {
    const toggle = () => { lastFocus = document.activeElement as HTMLElement; setOpen((v) => !v) }
    const toggleCalm = () => update({ calm: !parse(snapshot()).calm })
    window.addEventListener('si:a11y', toggle)
    window.addEventListener('si:calm', toggleCalm)
    return () => { window.removeEventListener('si:a11y', toggle); window.removeEventListener('si:calm', toggleCalm) }
  }, [update])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (panelRef.current && !panelRef.current.contains(t) && !t.closest('[aria-label="Accessibility settings"]')) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick) }
  }, [open, close])

  const reset = () => update({ calm: window.matchMedia('(prefers-reduced-motion: reduce)').matches, contrast: false, spacing: false, text: 'md', cursor: true })

  return (
    <div ref={panelRef} className="a11y-panel" role="dialog" aria-label="Accessibility settings" hidden={!open}>
      <h2>Accessibility
        <button type="button" className="icon-btn" aria-label="Close accessibility settings" onClick={close}><Close /></button>
      </h2>
      <Switch id="calm" label="Calm motion" hint="Stops all animation, including the rolling roles." checked={prefs.calm} onChange={(v) => update({ calm: v })} />
      <Switch id="cursor" label="Custom cursor" hint="A soft ring that follows the pointer. Off uses your normal cursor." checked={prefs.cursor} onChange={(v) => update({ cursor: v })} />
      <Switch id="contrast" label="High contrast" hint="Pure black and white with stronger borders." checked={prefs.contrast} onChange={(v) => update({ contrast: v })} />
      <Switch id="spacing" label="Comfortable spacing" hint="More space between letters, words and lines." checked={prefs.spacing} onChange={(v) => update({ spacing: v })} />
      <div className="a11y-row">
        <div><strong id="text-l">Text size</strong></div>
        <div className="segmented" role="radiogroup" aria-labelledby="text-l">
          {(['md', 'lg', 'xl'] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={prefs.text === t} onClick={() => update({ text: t })} aria-label={t === 'md' ? 'Default text size' : t === 'lg' ? 'Large text size' : 'Extra large text size'}>
              {t === 'md' ? 'A' : t === 'lg' ? 'A+' : 'A++'}
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="btn btn--ghost" onClick={reset} style={{ ['--h' as string]: '2.6rem' }}>Reset to defaults</button>
    </div>
  )
}
