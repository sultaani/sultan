import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/roboto'
import './globals.css'
import './sections.css'
import './case.css'
import { getProjects, getSite, mediaSrc, siteUrl } from '@/lib/content'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { A11yPanel } from '@/components/A11yPanel'
import { CommandPalette } from '@/components/CommandPalette'
import { ScrollProgress } from '@/components/ScrollProgress'
import { TransitionProvider } from '@/components/Transition'
import { RevealObserver } from '@/components/Reveal'
import { Cursor } from '@/components/Cursor'
import { STATUS_LABEL } from '@/lib/content-shared'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const og = mediaSrc(site.ogImage, 'wide')
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${site.siteName}: ${site.siteDescription.split('.')[0]}`, template: `%s · ${site.siteName}` },
    description: site.siteDescription,
    applicationName: site.siteName,
    authors: [{ name: site.siteName }],
    openGraph: { type: 'website', siteName: site.siteName, title: site.siteName, description: site.siteDescription, url: siteUrl(), ...(og ? { images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }] } : {}) },
    twitter: { card: 'summary_large_image', title: site.siteName, description: site.siteDescription },
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = { themeColor: '#f6efe6', colorScheme: 'light', width: 'device-width', initialScale: 1 }

/** Runs before first paint so saved accessibility choices never flash the wrong state. */
const PRE_PAINT = `(function(){var d=document.documentElement;d.classList.add('js');try{d.dataset.world=sessionStorage.getItem('si-world')==='day'?'day':'night';}catch(e){d.dataset.world='night';}try{var s=JSON.parse(localStorage.getItem('si-a11y')||'{}');var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.calm=String(typeof s.calm==='boolean'?s.calm:m);d.dataset.contrast=s.contrast?'high':'normal';d.dataset.spacing=s.spacing?'comfortable':'normal';d.dataset.text=s.text||'md';d.dataset.cursor=s.cursor===false?'off':'on';}catch(e){d.dataset.calm='false';}})();`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [site, projects] = await Promise.all([getSite(), getProjects()])
  const resume = site.resume && typeof site.resume === 'object' ? site.resume.url : null
  return (
    <html lang="en" suppressHydrationWarning data-calm="false" data-contrast="normal" data-spacing="normal" data-text="md" data-cursor="on" data-world="night">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      </head>
      <body id="top">
        <a href="#main" className="skip-link">Skip to main content</a>
        <TransitionProvider>
          <ScrollProgress />
          <div id="site-shell">
            <Header siteName={site.siteName} />
            <main id="main" tabIndex={-1}>{children}</main>
            <Footer site={site} />
          </div>
          <A11yPanel />
          <Cursor />
          <CommandPalette projects={projects.map((p) => ({ slug: p.slug || '', title: p.title, stage: STATUS_LABEL[p.stage || 'live'] }))} resumeUrl={resume} />
        </TransitionProvider>
        <RevealObserver />
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>
      </body>
    </html>
  )
}
