import { cache } from 'react'
import type { Experience, Media, Profile, Project, Service, Skill, SiteSetting } from '@/payload-types'
import { getClient } from './payload'

/**
 * All reads of CMS content go through here. Every helper degrades gracefully (logs the error and
 * returns a sensible default) so a database hiccup never takes the public site down.
 */

const DEFAULT_SITE: SiteSetting = {
  id: 0,
  siteName: 'Sultan Ipinmisho',
  siteDescription:
    'Software developer, AI enthusiast, product manager and UI/UX designer building web, mobile and ERP systems for businesses and communities.',
  location: 'Nigeria',
  timezone: 'Africa/Lagos',
  availability: 'open',
  availabilityNote: 'Taking on select projects',
  updatedAt: '',
  createdAt: '',
}

const DEFAULT_PROFILE: Profile = {
  id: 0,
  roles: [{ text: 'Software Developer' }, { text: 'AI Enthusiast' }, { text: 'Product Manager' }, { text: 'UI/UX Designer' }],
  updatedAt: '',
  createdAt: '',
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.error(`[content] ${label} failed:`, err)
    return fallback
  }
}

export const getSite = cache(async (): Promise<SiteSetting> =>
  safe('site-settings', async () => (await getClient()).findGlobal({ slug: 'site-settings', depth: 1 }), DEFAULT_SITE),
)

export const getProfile = cache(async (): Promise<Profile> =>
  safe('profile', async () => (await getClient()).findGlobal({ slug: 'profile', depth: 1 }), DEFAULT_PROFILE),
)

export const getProjects = cache(async (): Promise<Project[]> =>
  safe(
    'projects',
    async () => {
      const res = await (await getClient()).find({
        collection: 'projects',
        where: { _status: { equals: 'published' } },
        sort: ['order', '-year'],
        limit: 100,
        depth: 1,
        pagination: false,
      })
      return res.docs
    },
    [],
  ),
)

export const getProject = cache(async (slug: string): Promise<Project | null> =>
  safe(
    `project:${slug}`,
    async () => {
      const res = await (await getClient()).find({
        collection: 'projects',
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 2,
      })
      return res.docs[0] ?? null
    },
    null,
  ),
)

export const getSkills = cache(async (): Promise<Skill[]> =>
  safe(
    'skills',
    async () =>
      (await (await getClient()).find({ collection: 'skills', sort: ['order', 'name'], limit: 200, pagination: false })).docs,
    [],
  ),
)

export const getExperience = cache(async (): Promise<Experience[]> =>
  safe(
    'experience',
    async () =>
      (await (await getClient()).find({ collection: 'experience', sort: ['order'], limit: 100, pagination: false })).docs,
    [],
  ),
)

export const getServices = cache(async (): Promise<Service[]> =>
  safe(
    'services',
    async () =>
      (await (await getClient()).find({ collection: 'services', sort: ['order', 'title'], limit: 50, pagination: false })).docs,
    [],
  ),
)

/* ---------- helpers ---------- */

export const isMedia = (m: unknown): m is Media => typeof m === 'object' && m !== null && 'url' in m

export function mediaSrc(m: unknown, size?: 'thumb' | 'card' | 'wide'): { src: string; width: number; height: number; alt: string } | null {
  if (!isMedia(m) || !m.url) return null
  const variant = size ? m.sizes?.[size] : undefined
  const url = variant?.url || m.url
  return {
    src: url,
    width: variant?.width || m.width || 1200,
    height: variant?.height || m.height || 800,
    alt: m.alt || '',
  }
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export { STATUS_LABEL } from './content-shared'
