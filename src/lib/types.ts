import type { Project, Service } from '@/payload-types'
import { mediaSrc } from './content'

/** Slim, serialisable shape handed to client components (keeps the RSC payload small). */
export type CardProject = {
  slug: string
  title: string
  tagline: string
  stage: NonNullable<Project['stage']>
  accent: NonNullable<Project['accent']>
  year?: number | null
  featured: boolean
  tech: string[]
  category: { slug: string; title: string } | null
  cover: { src: string; width: number; height: number; alt: string } | null
}

export type CardService = { slug: string; title: string; summary: string; icon: string; count: number }

export function toCard(p: Project): CardProject {
  const c = typeof p.category === 'object' && p.category ? p.category : null
  return {
    slug: p.slug || String(p.id),
    title: p.title,
    tagline: p.tagline,
    stage: p.stage || 'live',
    accent: p.accent || 'green',
    year: p.year,
    featured: Boolean(p.featured),
    tech: (p.tech || []).map((t) => t.name).filter(Boolean),
    category: c ? { slug: c.slug || String(c.id), title: c.title } : null,
    cover: mediaSrc(p.cover, 'card'),
  }
}

export function toService(s: Service, count: number): CardService {
  return { slug: s.slug || String(s.id), title: s.title, summary: s.summary, icon: s.icon || 'web', count }
}
