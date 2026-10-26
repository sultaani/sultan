import Image from 'next/image'
import type { CardProject } from '@/lib/types'
import { STATUS_LABEL, isCrafting } from '@/lib/content-shared'
import { TLink } from './Transition'
import { ProjectCover } from './ProjectCover'
import { ArrowUpRight } from './Icons'

/** A card hanging on the pegboard. Projects still being built show a brief introduction only. */
export function ProjectCard({ p, priority = false }: { p: CardProject; priority?: boolean }) {
  const crafting = isCrafting(p.stage)
  return (
    <article className={`card${crafting ? ' card--crafting' : ''}`} data-accent={p.accent}>
      <TLink href={`/work/${p.slug}`} className="card__link" data-cursor-label="View">
        <div className="card__cover">
          {p.cover ? <Image src={p.cover.src} alt="" width={p.cover.width} height={p.cover.height} sizes="(min-width: 1000px) 30vw, 90vw" priority={priority} /> : <ProjectCover slug={p.slug} accent={p.accent} />}
          <span className={`tag${crafting ? ' tag--craft' : ''}`}>{crafting && <span className="led" aria-hidden="true" />}{STATUS_LABEL[p.stage]}</span>
        </div>
        <div className="card__body">
          {p.category && <p className="card__cat">{p.category.title}</p>}
          <h3>{p.title}</h3>
          <p className="card__tag">{p.tagline}</p>
          {!crafting && p.tech.length > 0 && (
            <ul className="card__tech" aria-label="Technologies">{p.tech.slice(0, 3).map((t) => <li key={t} className="chip">{t}</li>)}</ul>
          )}
          <span className="card__go">{crafting ? 'Read the intro' : 'View project'}<ArrowUpRight /></span>
        </div>
      </TLink>
    </article>
  )
}
