import type { ReactElement, SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} className={['arrow', p.className].filter(Boolean).join(' ')}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
)
export const Search = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const Accessibility = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="4.5" r="1.8" /><path d="M5 8.5c4.5 1.4 9.5 1.4 14 0M12 8.5v5M12 13.5l-3.2 6.5M12 13.5l3.2 6.5" /></svg>
)
export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const Download = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
)
export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
export const Alert = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 8v5M12 16.5v.01" /><path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
)
export const Corner = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M9 10l-5 5 5 5M20 4v7a4 4 0 0 1-4 4H4" /></svg>
)

/* ---------- Service icons (line art, 48px grid) ---------- */
const big = (p: SVGProps<SVGSVGElement>) => ({ ...base(p), viewBox: '0 0 48 48', strokeWidth: 1.6 })
export const SERVICE_ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  web: (p) => <svg {...big(p)}><rect x="5" y="9" width="38" height="30" rx="4" /><path d="M5 17h38" /><circle cx="10" cy="13" r=".8" /><circle cx="14" cy="13" r=".8" /><path d="M13 26l-4 4 4 4M35 26l4 4-4 4M26 24l-4 12" /></svg>,
  mobile: (p) => <svg {...big(p)}><rect x="14" y="4" width="20" height="40" rx="5" /><path d="M21 8h6M22 39h4" /><path d="M19 20h10M19 26h10M19 32h6" /></svg>,
  commerce: (p) => <svg {...big(p)}><path d="M5 8h6l4 22h22l4-16H13" /><circle cx="18" cy="38" r="2.5" /><circle cx="34" cy="38" r="2.5" /></svg>,
  marketing: (p) => <svg {...big(p)}><path d="M8 20v8l22 9V11L8 20z" /><path d="M30 17c4 1 6 3 6 7s-2 6-6 7M13 29l3 11h5l-2-8" /></svg>,
  design: (p) => <svg {...big(p)}><path d="M24 4l12 14-12 26L12 18 24 4z" /><circle cx="24" cy="21" r="3" /><path d="M24 24v20" /></svg>,
  erp: (p) => <svg {...big(p)}><rect x="6" y="6" width="14" height="14" rx="3" /><rect x="28" y="6" width="14" height="14" rx="3" /><rect x="17" y="28" width="14" height="14" rx="3" /><path d="M20 13h8M13 20v4h22v-4M24 24v4" /></svg>,
  data: (p) => <svg {...big(p)}><path d="M6 42h36M10 42V26M20 42V14M30 42V22M40 42V8" /></svg>,
  ai: (p) => <svg {...big(p)}><path d="M24 5l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12zM38 32l1.6 4.4L44 38l-4.4 1.6L38 44l-1.6-4.4L32 38l4.4-1.6L38 32z" /></svg>,
}

/* ---------- Interest illustrations: they animate on hover / focus ---------- */
export const INTEREST_ART: Record<string, () => ReactElement> = {
  climate: () => (
    <svg viewBox="0 0 120 120" className="art art--leaf" aria-hidden="true" focusable="false">
      <path className="art__stem" d="M60 110V58" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path className="art__leaf art__leaf--a" d="M60 70C34 70 22 52 24 30c24 0 38 14 36 40z" fill="currentColor" opacity=".85" />
      <path className="art__leaf art__leaf--b" d="M60 58C84 58 98 42 96 20c-24 0-38 14-36 38z" fill="currentColor" opacity=".55" />
      <circle className="art__drop" cx="30" cy="96" r="3" fill="currentColor" /><circle className="art__drop art__drop--b" cx="92" cy="90" r="2.4" fill="currentColor" />
    </svg>
  ),
  energy: () => (
    <svg viewBox="0 0 120 120" className="art art--sun" aria-hidden="true" focusable="false">
      <g className="art__rays" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M${60 + Math.cos(a) * 34} ${60 + Math.sin(a) * 34}L${60 + Math.cos(a) * 50} ${60 + Math.sin(a) * 50}`} /> })}
      </g>
      <circle cx="60" cy="60" r="22" fill="currentColor" />
    </svg>
  ),
  community: () => (
    <svg viewBox="0 0 120 120" className="art art--people" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.6" fill="none" className="art__links"><path d="M60 34L30 80M60 34l30 46M30 80h60" /></g>
      {[[60, 34], [30, 80], [90, 80]].map(([x, y], i) => <g key={i} className="art__node"><circle cx={x} cy={y} r="14" fill="currentColor" opacity=".9" /><circle cx={x} cy={y - 3} r="4.5" fill="var(--ink)" /><path d={`M${x - 8} ${y + 9}a8 6 0 0 1 16 0`} fill="var(--ink)" /></g>)}
    </svg>
  ),
  ai: () => (
    <svg viewBox="0 0 120 120" className="art art--spark" aria-hidden="true" focusable="false">
      <path className="art__spark art__spark--a" d="M54 16l8 26 26 8-26 8-8 26-8-26-26-8 26-8 8-26z" fill="currentColor" />
      <path className="art__spark art__spark--b" d="M94 70l3.5 10.5L108 84l-10.5 3.5L94 98l-3.5-10.5L80 84l10.5-3.5L94 70z" fill="currentColor" opacity=".7" />
      <circle className="art__spark art__spark--c" cx="22" cy="92" r="4" fill="currentColor" opacity=".6" />
    </svg>
  ),
  health: () => (
    <svg viewBox="0 0 120 120" className="art art--pulse" aria-hidden="true" focusable="false"><path className="art__line" d="M8 62h26l10-26 18 52 12-34 8 8h30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  education: () => (
    <svg viewBox="0 0 120 120" className="art art--book" aria-hidden="true" focusable="false"><path d="M60 30C48 22 30 22 14 28v64c16-6 34-6 46 2 12-8 30-8 46-2V28c-16-6-34-6-46 2z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><path d="M60 30v64" stroke="currentColor" strokeWidth="3" /></svg>
  ),
}

export const Moon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></svg>
)
export const Sun = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></svg>
)
