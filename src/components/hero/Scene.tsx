'use client'
import { toggleWorld, useWorld } from '@/lib/world'

/**
 * A street lamp with a small workstation under it. The lamp is the hidden switch between night and day.
 * The drawing is decorative; the button over the lamp head is the only interactive part.
 */
export function Scene() {
  const world = useWorld()
  return (
    <div className="scene">
      <svg className="scene__art" viewBox="0 0 460 360" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd98f" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffd98f" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="halo">
            <stop offset="0" stopColor="#ffe3a8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ffe3a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="scene__light">
          <polygon points="328,70 352,70 470,350 200,350" fill="url(#cone)" />
          <circle cx="340" cy="70" r="52" fill="url(#halo)" />
        </g>

        {/* street lamp */}
        <g className="scene__lamp">
          <rect x="424" y="332" width="32" height="18" rx="3" />
          <rect x="436" y="96" width="8" height="240" />
          <path d="M440 100 C440 58 392 44 352 54" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          <path d="M314 52 h52 l-9 16 h-34 z" />
          <ellipse className="scene__bulb" cx="340" cy="70" rx="15" ry="5" />
        </g>

        {/* workstation */}
        <g className="scene__desk">
          <rect x="230" y="262" width="190" height="8" rx="3" />
          <rect x="238" y="270" width="6" height="80" />
          <rect x="406" y="270" width="6" height="80" />
          <rect x="290" y="254" width="76" height="8" rx="3" />
          <rect className="scene__screen" x="298" y="208" width="60" height="46" rx="4" />
          <g className="scene__code">
            <rect x="306" y="217" width="26" height="3" rx="1.5" />
            <rect x="306" y="225" width="40" height="3" rx="1.5" />
            <rect x="312" y="233" width="30" height="3" rx="1.5" />
            <rect x="306" y="241" width="22" height="3" rx="1.5" />
          </g>
          <rect x="386" y="244" width="14" height="18" rx="2" />
          <path d="M400 248 h5 a4 4 0 0 1 0 9 h-5" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className="scene__steam" d="M390 238 q-4 -6 0 -11 M396 238 q-4 -6 0 -11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* chair */}
          <rect x="166" y="250" width="6" height="56" rx="3" />
          <rect x="170" y="298" width="58" height="8" rx="4" />
          <rect x="196" y="306" width="5" height="40" />
          <rect x="176" y="346" width="46" height="4" rx="2" />
          {/* person */}
          <g fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
            <path d="M201 258 L199 294" strokeWidth="20" />
            <path d="M202 264 L240 278 L294 257" strokeWidth="9" />
            <path d="M199 294 L248 300 L249 345" strokeWidth="11" />
          </g>
          <circle cx="204" cy="236" r="12" />
        </g>
      </svg>
      <button type="button" className="scene__hit" onClick={toggleWorld} aria-label={world === 'night' ? 'Street lamp. Switch to day' : 'Street lamp. Switch to night'} data-cursor-label={world === 'night' ? 'Day' : 'Night'} />
    </div>
  )
}
