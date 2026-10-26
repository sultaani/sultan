import Image from 'next/image'
import type { Profile } from '@/payload-types'
import { mediaSrc } from '@/lib/content'

export function About({ profile }: { profile: Profile }) {
  const cards = (profile.aboutBody || []).filter((c) => c.text)
  const portrait = mediaSrc(profile.portrait, 'thumb')
  return (
    <section id="about" className="section about" data-section="about" aria-labelledby="about-h">
      <div className="container">
        <h2 className="section-title reveal">About</h2>
        <div className="about__intro">
          {portrait && <Image className="about__portrait reveal" src={portrait.src} alt={portrait.alt || 'Portrait'} width={portrait.width} height={portrait.height} />}
          <p id="about-h" className="about__tagline reveal">{profile.aboutTagline || 'I don’t just write code.'}</p>
          {profile.aboutLead && <p className="about__lead reveal">{profile.aboutLead}</p>}
        </div>
        <ul className="about__cards">
          {cards.map((c, i) => (
            <li key={c.id || c.title} className="about__card reveal" style={{ ['--d' as string]: `${i * 90}ms` }}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
