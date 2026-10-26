import type { CardService } from '@/lib/types'
import { SERVICE_ICONS } from '../Icons'

export function Services({ services }: { services: CardService[] }) {
  return (
    <ul className="cards">
      {services.map((s, i) => {
        const Icon = SERVICE_ICONS[s.icon] || SERVICE_ICONS.web
        return (
          <li key={s.slug} className="service reveal" style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}>
            <span className="service__icon"><Icon /></span>
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
          </li>
        )
      })}
    </ul>
  )
}
