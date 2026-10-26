'use client'
import { useEffect, useState } from 'react'
import { useCalm } from '@/lib/use-calm'

/** Roles roll every two seconds. Hover or keyboard focus pauses them. Calm mode lists them all instead. */
export function RoleRoller({ roles }: { roles: string[] }) {
  const calm = useCalm()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const run = roles.length > 1 && !paused && !calm

  useEffect(() => {
    if (!run) return
    const id = window.setInterval(() => setI((v) => (v + 1) % roles.length), 2000)
    return () => window.clearInterval(id)
  }, [run, roles.length])

  if (!roles.length) return null
  if (calm) return <p className="roles roles--list">{roles.join('  ·  ')}</p>
  const n = roles.length
  return (
    <p
      className="roles"
      tabIndex={0}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="sr-only">{roles.join(', ')}</span>
      <span className="roles__stack" aria-hidden="true">
        {roles.map((r, k) => (
          <span key={r} className="roles__item" data-state={k === i ? 'active' : k === (i - 1 + n) % n ? 'out' : 'in'}>{r}</span>
        ))}
      </span>
    </p>
  )
}
