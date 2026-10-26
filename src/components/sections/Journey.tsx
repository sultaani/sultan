import type { Experience } from '@/payload-types'
import { Download } from '../Icons'

const TYPE: Record<string, string> = { work: 'Work', education: 'Education', venture: 'Venture' }

export function Journey({ items, resumeUrl }: { items: Experience[]; resumeUrl?: string | null }) {
  if (!items.length) return null
  return (
    <section id="journey" className="section journey" data-section="journey" aria-labelledby="jr-h">
      <div className="container">
        <h2 id="jr-h" className="section-title reveal">Journey</h2>
        <ol className="timeline">
          {items.map((e) => {
            const when = [e.startYear, e.current ? 'Now' : e.endYear].filter(Boolean).join(' – ')
            return (
              <li key={e.id} className="tl reveal">
                <span className="tl__dot" aria-hidden="true" />
                <p className="tl__meta">{[when, TYPE[e.type] || e.type].filter(Boolean).join(' · ')}</p>
                <h3>{e.title}</h3>
                {e.organisation && <p className="tl__org">{e.organisation}</p>}
                {e.description && <p className="tl__text">{e.description}</p>}
                {!!e.highlights?.length && <ul>{e.highlights.map((h) => <li key={h.id || h.text}>{h.text}</li>)}</ul>}
              </li>
            )
          })}
        </ol>
        {resumeUrl && (
          <p className="center reveal"><a className="btn btn--ghost" href={resumeUrl} target="_blank" rel="noopener noreferrer"><Download />Download CV<span className="sr-only"> (PDF, opens in a new tab)</span></a></p>
        )}
      </div>
    </section>
  )
}
