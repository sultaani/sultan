import type { Profile } from '@/payload-types'
import { CityGrid } from './CityGrid'
import { RoleRoller } from './RoleRoller'
import { Scene } from './Scene'
import { ArrowRight } from '../Icons'

export function Hero({ name, profile, resumeUrl }: { name: string; profile: Profile; resumeUrl?: string | null }) {
  const roles = (profile.roles || []).map((r) => r.text).filter(Boolean)
  return (
    <section className="hero" data-section="hero" aria-labelledby="hero-title">
      <div className="hero__sky" aria-hidden="true"><span className="hero__stars" /><span className="hero__orb" /></div>
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__name hero-anim">{name}</h1>
        <div className="hero-anim" style={{ ['--k' as string]: 1 }}><RoleRoller roles={roles} /></div>
        <div className="hero__cta hero-anim" style={{ ['--k' as string]: 2 }}>
          <span className="float" style={{ ['--f' as string]: 0 }}>
            <a className="btn btn--primary btn--lift" href="#contact">Contact me<ArrowRight /></a>
          </span>
          <span className="float" style={{ ['--f' as string]: 1 }}>
            {resumeUrl
              ? <a className="btn btn--float btn--lift" href={resumeUrl} target="_blank" rel="noopener noreferrer">View my resume<span className="sr-only"> (PDF, opens in a new tab)</span></a>
              : <a className="btn btn--float btn--lift" href="#journey">View my resume</a>}
          </span>
        </div>
      </div>
      <CityGrid />
      <Scene />
      <a className="hero__down" href="#about" aria-label="Scroll to About"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></a>
    </section>
  )
}
