import { ImageResponse } from 'next/og'
import { getSite } from '@/lib/content'

export const alt = 'Sultan Ipinmisho: software developer and designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

const BARS = [
  [150, '#8f3118'], [210, '#5a4637'], [120, '#d28b6a'], [260, '#b9472a'], [180, '#5a4637'],
  [300, '#8f3118'], [140, '#d28b6a'], [230, '#b9472a'], [170, '#5a4637'], [280, '#8f3118'], [110, '#d28b6a'],
] as const

/** Generated share card, used until a custom image is uploaded in Site settings. */
export default async function Image() {
  const site = await getSite()
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f6efe6', color: '#2b1d15', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 90 }}>
          <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -3 }}>{site.siteName}</div>
          <div style={{ fontSize: 40, color: '#b9472a', marginTop: 12 }}>Software Developer · UI/UX Designer</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, padding: '0 40px' }}>
          {BARS.map(([h, c], i) => (
            <div key={i} style={{ flex: 1, height: h, background: c, borderRadius: '6px 6px 0 0' }} />
          ))}
        </div>
      </div>
    ),
    size,
  )
}
