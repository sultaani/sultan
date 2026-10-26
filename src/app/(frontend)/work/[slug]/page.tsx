import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getProject, getProjects, mediaSrc, siteUrl } from '@/lib/content'
import { STATUS_LABEL, isCrafting } from '@/lib/content-shared'
import { toCard } from '@/lib/types'
import { ProjectCover } from '@/components/ProjectCover'
import { ProjectCard } from '@/components/ProjectCard'
import { TLink } from '@/components/Transition'
import { ArrowRight, ArrowUpRight } from '@/components/Icons'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) return { title: 'Project not found' }
  const cover = mediaSrc(p.cover, 'wide')
  const description = p.seoDescription || p.summary
  return {
    title: p.seoTitle || p.title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.seoTitle || p.title, description, url: `${siteUrl()}/work/${p.slug}`, type: 'article', ...(cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] } : {}) },
  }
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params
  const [p, all] = await Promise.all([getProject(slug), getProjects()])
  if (!p) notFound()

  const crafting = isCrafting(p.stage)
  const idx = all.findIndex((x) => x.id === p.id)
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null
  const cover = mediaSrc(p.cover, 'wide')
  const stage = STATUS_LABEL[p.stage || 'live']
  const category = typeof p.category === 'object' && p.category ? p.category : null
  const hasBody = p.body && p.body.root && p.body.root.children?.length > 0
  const similar = category ? all.filter((a) => a.id !== p.id && typeof a.category === 'object' && a.category?.id === category.id).slice(0, 2) : []

  return (
    <article data-accent={p.accent || 'green'}>
      <header className="container case-hero">
        <nav className="crumbs" aria-label="Breadcrumb"><TLink href="/work">Work</TLink><span aria-hidden="true">/</span>{category && <><TLink href={`/work#${category.slug}`}>{category.title}</TLink><span aria-hidden="true">/</span></>}<span aria-current="page">{p.title}</span></nav>
        <span className={`tag${crafting ? ' tag--craft' : ''}`}>{crafting && <span className="led" aria-hidden="true" />}{stage}</span>
        <h1>{p.title}</h1>
        <p className="tagline">{p.tagline}</p>

        <dl className="meta-grid">
          {category && <div><dt>Service</dt><dd>{category.title}</dd></div>}
          <div><dt>Status</dt><dd>{stage}</dd></div>
          {p.year ? <div><dt>Year</dt><dd>{p.year}</dd></div> : null}
          {p.role ? <div><dt>Role</dt><dd>{p.role}</dd></div> : null}
          {(p.liveUrl || p.repoUrl) ? (
            <div><dt>Links</dt><dd className="meta-links">
              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live site<ArrowUpRight width={14} height={14} /><span className="sr-only"> (opens in a new tab)</span></a>}
              {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code<ArrowUpRight width={14} height={14} /><span className="sr-only"> (opens in a new tab)</span></a>}
            </dd></div>
          ) : null}
        </dl>

        <div className="case-cover">
          {cover ? <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} priority sizes="(min-width: 1280px) 1200px, 100vw" /> : <ProjectCover slug={p.slug || 'x'} accent={p.accent || 'green'} />}
        </div>
      </header>

      <div className="container">
        <p className="lead">{p.summary}</p>

        {(p.tech?.length || 0) > 0 && (
          <ul className="card__tech case-tech" aria-label="Technologies used">
            {p.tech!.map((t) => <li key={t.id || t.name} className="chip chip--accent">{t.name}</li>)}
          </ul>
        )}

        {crafting && (
          <aside className="crafting-note reveal">
            <span className="led" aria-hidden="true" />
            <div>
              <strong>SI. Is still crafting this.</strong>
              <p>A fuller write-up will appear here when it is ready.</p>
            </div>
          </aside>
        )}

        {!crafting && (p.metrics?.length || 0) > 0 && (
          <div className="metrics">{p.metrics!.map((m) => <div key={m.id || m.label} className="metric reveal"><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>
        )}

        {!crafting && p.problem && <section className="case-section reveal" aria-labelledby="problem-h"><h2 id="problem-h">The problem</h2><p className="copy">{p.problem}</p></section>}
        {!crafting && p.approach && <section className="case-section reveal" aria-labelledby="approach-h"><h2 id="approach-h">Approach</h2><p className="copy">{p.approach}</p></section>}

        {!crafting && (p.architecture?.length || 0) > 0 && (
          <section className="case-section" aria-labelledby="arch-h">
            <h2 id="arch-h" className="reveal">Architecture</h2>
            <ol className="arch">{p.architecture!.map((a) => <li key={a.id || a.title} className="reveal"><div><h3>{a.title}</h3><p>{a.description}</p></div></li>)}</ol>
          </section>
        )}

        {!crafting && p.outcome && <section className="case-section reveal" aria-labelledby="outcome-h"><h2 id="outcome-h">Outcome</h2><p className="copy">{p.outcome}</p></section>}

        {!crafting && hasBody && (
          <section className="case-section reveal" aria-label="Details"><h2>Details</h2><div className="prose"><RichText data={p.body!} /></div></section>
        )}

        {!crafting && (p.gallery?.length || 0) > 0 && (
          <section className="case-section" aria-labelledby="gal-h">
            <h2 id="gal-h">Gallery</h2>
            <div className="gallery">
              {p.gallery!.map((g) => {
                const m = mediaSrc(g.image, 'card')
                if (!m) return null
                return (
                  <figure key={g.id || m.src} className="reveal">
                    <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(min-width: 700px) 50vw, 100vw" />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                  </figure>
                )
              })}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="case-section" aria-labelledby="rel-h">
            <h2 id="rel-h">More in {category?.title}</h2>
            <ul className="grid">{similar.map((r, i) => <li key={r.id} className="grid__item" style={{ ['--i' as string]: i }}><ProjectCard p={toCard(r)} /></li>)}</ul>
          </section>
        )}

        {next && next.id !== p.id && (
          <section className="next-wrap" aria-label="Next project" data-accent={next.accent || 'green'}>
            <TLink href={`/work/${next.slug}`} className="next-project reveal" data-cursor-label="Next">
              <small>Next project</small>
              <h2>{next.title}<ArrowRight /></h2>
            </TLink>
          </section>
        )}
      </div>
    </article>
  )
}
