import { getExperience, getProfile, getProjects, getServices, getSite, getSkills, mediaSrc } from '@/lib/content'
import { toCard, toService } from '@/lib/types'
import { Hero } from '@/components/hero/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { WorkBoard } from '@/components/sections/WorkBoard'
import { TechField } from '@/components/sections/TechField'
import { Interests } from '@/components/sections/Interests'
import { Journey } from '@/components/sections/Journey'
import { Letter } from '@/components/sections/Letter'
import { TLink } from '@/components/Transition'

export const revalidate = 60

export default async function Home() {
  const [site, profile, projects, services, skills, experience] = await Promise.all([getSite(), getProfile(), getProjects(), getServices(), getSkills(), getExperience()])
  const cards = projects.map(toCard)
  const featured = cards.filter((c) => c.featured)
  const board = featured.length ? featured : cards
  const svc = services.map((s) => toService(s, cards.filter((c) => c.category?.slug === s.slug).length))
  const resume = site.resume && typeof site.resume === 'object' ? site.resume.url : null
  const tech = skills.map((s) => {
    const img = mediaSrc(s.iconImage)
    return { name: s.name, icon: s.icon, image: img ? { src: img.src, width: img.width, height: img.height } : null }
  })

  return (
    <>
      <Hero name={site.siteName} profile={profile} />
      <About profile={profile} />

      <section id="services" className="section section--sand" data-section="services" aria-labelledby="sv-h">
        <div className="container">
          <h2 id="sv-h" className="section-title reveal">Services</h2>
          <Services services={svc} />
        </div>
      </section>

      <section id="work" className="section" data-section="work" aria-labelledby="wk-h">
        <div className="container">
          <h2 id="wk-h" className="section-title reveal">Selected work</h2>
          <WorkBoard projects={board} services={svc} />
          <p className="center reveal"><TLink href="/work" className="btn btn--ghost">All projects</TLink></p>
        </div>
      </section>

      {tech.length > 0 && (
        <section id="technologies" className="section section--sand tech-sec" data-section="technologies" aria-labelledby="te-h">
          <div className="container">
            <h2 id="te-h" className="section-title reveal">Technologies</h2>
            <TechField items={tech} />
          </div>
        </section>
      )}

      <Interests profile={profile} />
      <Journey items={experience} resumeUrl={resume} />
      <Letter site={site} projectOptions={cards.slice(0, 6).map((c) => c.title)} />
    </>
  )
}
