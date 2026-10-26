'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useRef, type ComponentProps } from 'react'

/**
 * Page changes: a row of city blocks rises to cover the screen, the route changes underneath, then the blocks lower.
 * Calm mode and same-page links skip it. If anything goes wrong the cover releases itself after a few seconds.
 */
const Ctx = createContext<{ go: (href: string) => void }>({ go: () => {} })
export const useCurtain = () => useContext(Ctx)

const COLUMNS = 9

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const cover = useRef<HTMLDivElement>(null)
  const pending = useRef(false)
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const value = useMemo(
    () => ({
      go: (href: string) => {
        const el = cover.current
        const url = new URL(href, window.location.href)
        const samePage = url.pathname === window.location.pathname
        if (!el || samePage || document.documentElement.dataset.calm === 'true' || pending.current) { router.push(href); return }
        pending.current = true
        el.dataset.phase = 'cover'
        later(() => router.push(href), 520)
        later(() => { if (pending.current) { pending.current = false; el.dataset.phase = 'idle' } }, 4000)
      },
    }),
    [router],
  )

  useEffect(() => {
    const el = cover.current
    if (!el || !pending.current) return
    pending.current = false
    el.dataset.phase = 'reveal'
    later(() => { el.dataset.phase = 'idle' }, 800)
  }, [pathname])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div ref={cover} className="wipe" data-phase="idle" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}
      </div>
    </Ctx.Provider>
  )
}

/** A Link that plays the block wipe for page changes. Opens normally with modifier keys or for outside links. */
export function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const { go } = useCurtain()
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (typeof href !== 'string' || !href.startsWith('/')) return
        e.preventDefault()
        go(href)
      }}
    />
  )
}
