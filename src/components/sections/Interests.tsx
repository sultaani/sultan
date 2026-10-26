import type { Profile } from '@/payload-types'
import { INTEREST_ART } from '../Icons'

export function Interests({ profile }: { profile: Profile }) {
  const items = profile.interests || []
  if (!items.length) return null
  return (
    <section id="interests" className="section interests" data-section="interests" aria-labelledby="int-h">
      <div className="container">
        <h2 id="int-h" className="section-title reveal">Interests</h2>
        <ul className="interest-grid">
          {items.map((it, i) => {
            const Art = INTEREST_ART[it.icon || 'community'] || INTEREST_ART.community
            return (
              <li key={it.id || it.title} className="interest reveal" style={{ ['--d' as string]: `${(i % 4) * 80}ms` }}>
                <div className="interest__art"><Art /></div>
                <h3>{it.title}</h3>
                {it.text && <p>{it.text}</p>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
