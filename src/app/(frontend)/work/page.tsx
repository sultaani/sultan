import type { Metadata } from 'next'
import { getProjects, getServices } from '@/lib/content'
import { toCard } from '@/lib/types'
import { ProjectCard } from '@/components/ProjectCard'
import { TLink } from '@/components/Transition'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Work',
  description: 'Every project, filed by service: web, mobile, e-commerce, UX design and ERP systems.',
  alternates: { canonical: '/work' },
}

export default async function WorkPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()])
  const cards = projects.map(toCard)
  const groups = services.map((s) => ({ s, items: cards.filter((c) => c.category?.slug === (s.slug as string)) })).filter((g) => g.items.length)
  const loose = cards.filter((c) => !c.category)
  return (
    <>
      <header className="container page-hero">
        <h1 className="section-title">Work</h1>
        <nav className="filters" aria-label="Jump to a service">
          {groups.map(({ s }) => <a key={(s.slug as string)} className="chip" href={`#${(s.slug as string)}`}>{s.title}</a>)}
        </nav>
      </header>
      <div className="container">
        {groups.map(({ s, items }) => (
          <section key={(s.slug as string)} id={(s.slug as string)} className="group" aria-labelledby={`${(s.slug as string)}-h`}>
            <div className="group__head">
              <h2 id={`${(s.slug as string)}-h`} className="reveal">{s.title}</h2>
                          </div>
            <ul className="grid">
              {items.map((p, i) => <li key={p.slug} className="grid__item" style={{ ['--i' as string]: i }}><ProjectCard p={p} /></li>)}
            </ul>
          </section>
        ))}
        {loose.length > 0 && (
          <section className="group" aria-labelledby="more-h">
            <div className="group__head"><h2 id="more-h">More</h2></div>
            <ul className="grid">{loose.map((p, i) => <li key={p.slug} className="grid__item" style={{ ['--i' as string]: i }}><ProjectCard p={p} /></li>)}</ul>
          </section>
        )}
        <p className="center"><TLink href="/#contact" className="btn btn--primary">Get in touch</TLink></p>
      </div>
    </>
  )
}
