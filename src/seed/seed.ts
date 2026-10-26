/**
 * Seeds starter content. Safe to re-run: it only creates what is missing and never overwrites
 * anything you have edited in the CMS.   Usage:  npm run seed
 */
import { getPayload } from 'payload'
import config from '../payload.config'

type Accent = 'green' | 'cyan' | 'amber' | 'violet' | 'rose'
type Seed = {
  slug: string
  title: string
  category: string
  tagline: string
  summary: string
  stage: 'live' | 'building' | 'concept' | 'archived'
  year?: number
  role?: string
  featured: boolean
  order: number
  accent: Accent
  tech: string[]
  metrics?: { value: string; label: string }[]
  problem?: string
  approach?: string
  architecture?: { title: string; description: string }[]
  outcome?: string
}

const services = [
  { slug: 'web-development', title: 'Web development', icon: 'web', order: 10, summary: 'Fast, accessible websites and web apps, from a first landing page to full platforms with dashboards, roles and payments.' },
  { slug: 'mobile-app-development', title: 'Mobile app development', icon: 'mobile', order: 20, summary: 'Android and cross-platform apps that stay useful on patchy connections and small screens.' },
  { slug: 'e-commerce-solutions', title: 'E-Commerce solutions', icon: 'commerce', order: 30, summary: 'Online stores that make it easy to browse, order and pay, with an admin your team can actually run.' },
  { slug: 'digital-marketing', title: 'Digital marketing', icon: 'marketing', order: 40, summary: 'Search-friendly sites, clear messaging and the analytics to show what is working.' },
  { slug: 'user-experience-design', title: 'User experience design', icon: 'design', order: 50, summary: 'Research, flows, interfaces and design systems that make products feel obvious to use.' },
  { slug: 'erp-development', title: 'ERP development', icon: 'erp', order: 60, summary: 'Operations systems that join sales, stock, finance and reporting so a business can see itself clearly.' },
]

/* Projects still being built carry a short introduction only, by design. */
const projects: Seed[] = [
  {
    slug: 'nexusos', title: 'NexusOS', category: 'erp-development', stage: 'building', year: 2026, featured: true, order: 10, accent: 'green',
    tagline: 'One platform for how a state runs its schools: learning, fees and audit together.',
    summary: 'An education management platform for government, schools, teachers, students and parents, built to serve many states, starting with Kogi.',
    tech: ['Flask', 'PostgreSQL'],
  },
  {
    slug: 'zentry', title: 'Zentry', category: 'mobile-app-development', stage: 'building', year: 2026, featured: true, order: 20, accent: 'cyan',
    tagline: 'Sales, stock, debts and invoices for small businesses, in your pocket.',
    summary: 'A business management app for Nigerian small businesses, on the web and on mobile.',
    tech: ['Flask', 'React Native', 'PostgreSQL'],
  },
  {
    slug: 'clearmission-operations', title: 'Clearmission ERP', category: 'erp-development', stage: 'building', year: 2026, featured: true, order: 30, accent: 'amber',
    tagline: 'Job orders to invoices to profit for a printing, publishing and branding business.',
    summary: 'The operations and accounting system for CLEARMISSION NIG LTD, joining jobs, pricing, inventory and reporting.',
    tech: ['Next.js', 'PostgreSQL'],
  },
  {
    slug: 'arteon', title: 'Arteon', category: 'user-experience-design', stage: 'building', featured: true, order: 40, accent: 'cyan',
    tagline: 'Your portable curator: an AR guide for art galleries.',
    summary: 'An augmented-reality guide and navigation experience for art galleries.',
    tech: ['AR', 'Product design'],
  },
  {
    slug: 'atlascv', title: 'AtlasCV', category: 'web-development', stage: 'building', year: 2026, featured: false, order: 50, accent: 'violet',
    tagline: 'One career profile that writes your résumé, CV, cover letter and portfolio.',
    summary: 'An open-source, self-hosted career document platform: keep one profile, generate every document from it.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    slug: 'project-atlas', title: 'Project Atlas', category: 'web-development', stage: 'building', year: 2026, featured: false, order: 60, accent: 'violet',
    tagline: 'A self-hosted avatar creator with no third-party SDK to break.',
    summary: 'A web avatar creation tool with shape sliders and colour controls, built to be fully self-hosted.',
    tech: ['React', 'Three.js'],
  },
  {
    slug: 'insideoutbrand', title: 'InsideOutBrand.NG', category: 'e-commerce-solutions', stage: 'live', year: 2026, featured: true, order: 70, accent: 'rose',
    role: 'Design and full-stack engineering',
    tagline: 'A storytelling brand where customers commission a story and gifted products.',
    summary: 'The production site for a Nigerian custom storytelling and gifted-product brand, with a story-commission wizard, a catalogue and cart, and an admin dashboard.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'React Three Fiber'],
    metrics: [{ value: '17', label: 'API routes' }, { value: '7', label: 'Admin dashboard tabs' }],
    problem: 'A custom storytelling brand needs a way for customers to describe what they want without a long back-and-forth, and a way for the team to manage commissions and products afterwards.',
    approach: 'A guided commission wizard for customers, a catalogue and cart for gifted products, and an admin dashboard to run it all.',
    architecture: [
      { title: 'Commission wizard', description: 'A step-by-step flow that captures the brief for a custom story.' },
      { title: 'Catalogue and cart', description: 'Gifted products with a cart and checkout path.' },
      { title: 'Admin dashboard', description: 'Seven tabs backed by seventeen API routes for managing commissions, products and orders.' },
      { title: '3D avatars', description: 'Avatar rendering with React Three Fiber.' },
    ],
    outcome: 'Shipped as a full production site on Next.js and PostgreSQL.',
  },
  {
    slug: 'ogidi-ela-heritage', title: 'Ogidi-ELA Heritage Platform', category: 'web-development', stage: 'archived', year: 2026, featured: true, order: 80, accent: 'amber',
    role: 'Design and full-stack engineering',
    tagline: 'A digital home for the cultural identity of Ogidi-ELA and the Okun-Yoruba people.',
    summary: 'A cultural heritage platform for Ogidi-ELA town in Kogi State, preserving Okun-Yoruba identity with content seeded from real community records.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'Radix UI', 'Tailwind CSS'],
    problem: 'A community’s history and traditions are carried by elders and scattered records. Without a shared home they are easy to lose.',
    approach: 'Content was seeded from real community records, with an admin dashboard so the community can keep adding to it.',
    architecture: [
      { title: 'Content model', description: 'Prisma and SQLite store the community’s records, kept simple enough to move or back up.' },
      { title: 'AI cultural guide', description: 'A floating guide that helps visitors explore the culture in conversation.' },
      { title: 'Admin dashboard', description: 'Lets the community maintain the archive without developer help.' },
    ],
    outcome: 'Built as a Next.js app with Radix UI and Tailwind CSS.',
  },
  {
    slug: 'misi-t-restaurant', title: 'Misi T Restaurant & Bakery', category: 'user-experience-design', stage: 'archived', year: 2026, featured: true, order: 90, accent: 'rose',
    role: 'Design and front-end engineering',
    tagline: 'A warm, food-first website for a Lokoja restaurant and bakery.',
    summary: 'A website for Misi T Restaurant & Bakery in Lokoja, built on a Nigerian food-focused design system.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    outcome: 'Plain HTML, CSS and vanilla JavaScript, with a design system derived from the UI/UX Pro Max skill repository.',
  },
  {
    slug: 'w-medix', title: 'W-Medix', category: 'erp-development', stage: 'archived', featured: false, order: 100, accent: 'green',
    role: 'Full-stack engineering',
    tagline: 'Pharmacy management with a typed stack from database to UI.',
    summary: 'A pharmacy management system built with React and Express in TypeScript on PostgreSQL.',
    tech: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle ORM'],
    outcome: 'Completed, with a typed stack from the database through to the UI.',
  },
]

const skills: [string, string][] = [
  ['Python', 'python'], ['Flask', 'flask'], ['Laravel', 'laravel'], ['PHP', 'php'], ['React', 'react'], ['Next.js', 'nextjs'],
  ['Flutter', 'flutter'], ['Dart', 'dart'], ['Android', 'android'], ['Java', 'java'], ['Figma', 'figma'], ['Claude', 'claude'],
  ['Canva', 'canva'], ['Node.js', 'nodejs'],
]

// Technologies you asked to retire from the floating field. The seed removes them if they were added earlier.
const RETIRED = ['Docker', 'Tailwind CSS', 'TypeScript', 'PostgreSQL', 'MySQL']

const journey = [
  { title: 'Software developer and product manager', organisation: 'Independent and client work', type: 'work', startYear: undefined, current: true, order: 10, description: 'Web, mobile and ERP products for small businesses, institutions and founders, owned from first idea to live deployment.' },
  { title: 'Product and engineering', organisation: 'CLEARMISSION NIG LTD', type: 'venture', current: true, order: 20, description: 'Building the operations system for a printing, publishing and branding business, and Zentry for small businesses.' },
  { title: 'Undergraduate studies', organisation: '', type: 'education', current: true, order: 30, description: 'Academic projects include an AI chatbot for student learning, a machine-learning model for predicting student performance and the W-Medix pharmacy system.' },
] as const

const slugs = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-')

async function run() {
  const payload = await getPayload({ config })
  const log = (m: string) => console.log(`[seed] ${m}`)

  // ---- Services
  const serviceId = new Map<string, number>()
  for (const s of services) {
    const found = await payload.find({ collection: 'services', where: { slug: { equals: s.slug } }, limit: 1 })
    if (found.docs[0]) { serviceId.set(s.slug, found.docs[0].id); continue }
    const doc = await payload.create({ collection: 'services', data: { ...s, icon: s.icon as never } })
    serviceId.set(s.slug, doc.id)
    log(`service created: ${s.slug}`)
  }

  // ---- Projects
  for (const p of projects) {
    const existing = await payload.find({ collection: 'projects', where: { slug: { equals: p.slug } }, limit: 1, draft: true })
    if (existing.docs[0]) { log(`project exists: ${p.slug}`); continue }
    await payload.create({
      collection: 'projects',
      draft: false,
      data: {
        title: p.title, slug: p.slug, category: serviceId.get(p.category)!, tagline: p.tagline, summary: p.summary,
        stage: p.stage, year: p.year, role: p.role, featured: p.featured, order: p.order, accent: p.accent,
        tech: p.tech.map((name) => ({ name })),
        metrics: p.metrics, problem: p.problem, approach: p.approach, architecture: p.architecture, outcome: p.outcome,
        _status: 'published',
      },
    })
    log(`project created: ${p.slug}`)
  }

  // ---- Technologies
  const existingSkills = await payload.find({ collection: 'skills', limit: 500, pagination: false })
  for (const s of existingSkills.docs) {
    if (RETIRED.some((r) => slugs(r) === slugs(s.name))) {
      await payload.delete({ collection: 'skills', id: s.id })
      log(`technology removed: ${s.name}`)
    }
  }
  const have = new Set(existingSkills.docs.filter((s) => !RETIRED.some((r) => slugs(r) === slugs(s.name))).map((s) => slugs(s.name)))
  let order = 0
  for (const [name, icon] of skills) {
    order += 10
    if (have.has(slugs(name))) continue
    await payload.create({ collection: 'skills', data: { name, icon: icon as never, order } })
    log(`technology created: ${name}`)
  }

  // ---- Journey
  const exp = await payload.find({ collection: 'experience', limit: 1 })
  if (!exp.totalDocs) {
    for (const e of journey) await payload.create({ collection: 'experience', data: { ...e, organisation: e.organisation || undefined, type: e.type as never } })
    log('journey entries created')
  }

  // ---- Profile (only while untouched)
  const profile = await payload.findGlobal({ slug: 'profile' })
  if (!profile.aboutBody?.length || !profile.aboutBody[0]?.title) {
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        roles: [{ text: 'Software Developer' }, { text: 'AI Enthusiast' }, { text: 'Product Manager' }, { text: 'UI/UX Designer' }],
        aboutTagline: 'I don’t just write code.',
        aboutLead: 'I build digital systems that make small businesses and communities work better.',
        aboutBody: [
          { title: 'What I do', text: 'I fix the everyday problems small businesses face by building digital systems that make their operations efficient and dependable.' },
          { title: 'What I have built', text: 'Web and mobile apps and ERPs: sales and stock tools for small businesses, school management, an operations system for a printing business and a heritage platform for my community.' },
          { title: 'Where I am headed', text: 'I am building for the sustainable growth and development of my community, across healthtech, edtech, business development and waste control. My goal is a community where young entrepreneurs can build and grow, using technology to improve their lives and their businesses.' },
        ],
        interests: [
          { title: 'Climate change', icon: 'climate', text: 'Technology should help us live with the planet, not against it.' },
          { title: 'Sustainable energy', icon: 'energy', text: 'Clean, affordable power is the quiet foundation of every business.' },
          { title: 'Community building', icon: 'community', text: 'Strong communities turn good ideas into lasting change.' },
          { title: 'AI and emerging technologies', icon: 'ai', text: 'Learning, testing and shaping what comes next.' },
        ],
      },
    })
    log('profile seeded')
  }

  const site = await payload.findGlobal({ slug: 'site-settings' })
  if (!site.siteName) log('site settings use defaults')

  log('done')
}

// `payload run` exits as soon as this module finishes loading, so it must be awaited.
try {
  await run()
} catch (e) {
  console.error(e)
  process.exit(1)
}
