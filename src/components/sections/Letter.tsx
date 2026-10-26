import type { SiteSetting } from '@/payload-types'
import { ContactForm } from '../ContactForm'

export function Letter({ site, projectOptions }: { site: SiteSetting; projectOptions: string[] }) {
  return (
    <section id="contact" className="section section--sand contact" data-section="contact" aria-labelledby="ct-h">
      <div className="container container--narrow">
        <h2 id="ct-h" className="section-title reveal">Contact</h2>
        <div className="reveal"><ContactForm projectOptions={projectOptions} /></div>
        {site.email && <p className="center contact__mail reveal"><a href={`mailto:${site.email}`}>{site.email}</a></p>}
      </div>
    </section>
  )
}
