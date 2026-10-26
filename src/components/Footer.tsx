import type { SiteSetting } from '@/payload-types'
import { BrandIcon } from '@/lib/tech-icons'

export function Footer({ site }: { site: SiteSetting }) {
  const year = new Date().getFullYear()
  const s = site.social || {}
  const wa = (s.whatsapp || '').replace(/\D/g, '')
  const socials = [
    { key: 'github', label: 'GitHub', href: s.github },
    { key: 'linkedin', label: 'LinkedIn', href: s.linkedin },
    { key: 'x', label: 'X', href: s.x },
    { key: 'whatsapp', label: 'WhatsApp', href: wa ? `https://wa.me/${wa}` : '' },
    { key: 'email', label: 'Email', href: site.email ? `mailto:${site.email}` : '' },
  ].filter((x) => x.href)
  return (
    <footer className="site-footer">
      <div className="container">
        {socials.length > 0 && (
          <ul className="socials">
            {socials.map((x) => (
              <li key={x.key}>
                <a href={String(x.href)} className="social" target={x.key === 'email' ? undefined : '_blank'} rel={x.key === 'email' ? undefined : 'noopener noreferrer'} aria-label={x.key === 'email' ? 'Email me' : `${x.label} (opens in a new tab)`}>
                  <BrandIcon name={x.key} size={20} />
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="footer-base">© {year} {site.siteName}</p>
      </div>
    </footer>
  )
}
