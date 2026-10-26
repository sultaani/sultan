'use client'
import { useId, useState } from 'react'
import type { CardProject } from '@/lib/types'
import { ProjectCard } from '../ProjectCard'

/** Pegboard with a filter per service. Only services that have projects get a tab. */
export function WorkBoard({ projects, services }: { projects: CardProject[]; services: { slug: string; title: string }[] }) {
  const [active, setActive] = useState('all')
  const uid = useId()
  const tabs = services.filter((s) => projects.some((p) => p.category?.slug === s.slug))
  const shown = active === 'all' ? projects : projects.filter((p) => p.category?.slug === active)
  return (
    <div className="board">
      <div className="filters" role="group" aria-label="Filter projects by service">
        <button type="button" className="chip" aria-pressed={active === 'all'} onClick={() => setActive('all')}>All </button>
        {tabs.map((s) => (
          <button key={s.slug} type="button" className="chip" aria-pressed={active === s.slug} onClick={() => setActive(s.slug)}>
            {s.title}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite" id={`${uid}-n`}>{shown.length} project{shown.length === 1 ? '' : 's'} shown</p>
      <ul className="grid" key={active}>
        {shown.map((p, i) => (
          <li key={p.slug} className="grid__item" style={{ ['--i' as string]: i }}>
            <ProjectCard p={p} priority={i < 2} />
          </li>
        ))}
      </ul>
    </div>
  )
}
