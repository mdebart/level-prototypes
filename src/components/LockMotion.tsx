import type { CSSProperties, ReactNode } from 'react'
import s from './LockMotion.module.css'

/**
 * Motion pieces from 03 Locks → ▶️ Lock Animations (39:29674).
 * Each is driven by props so a prototype's timeline can choreograph them.
 */

/** Request Ring — 1px ring that draws around the 200px button when a command is sent. (Loader Progress) */
export function RequestRing({ visible, drawn, drawMs, ease, fadeMs = 400 }: { visible: boolean; drawn: boolean; drawMs: number; ease: string; fadeMs?: number }) {
  const C = 2 * Math.PI * 99.5
  return (
    <svg className={s.ring} viewBox="0 0 200 200" width={200} height={200} aria-hidden
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${fadeMs}ms ease` }}>
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="99.5" fill="none" stroke="url(#ring-grad)" strokeWidth="1"
        strokeDasharray={C} strokeDashoffset={drawn ? 0 : C}
        transform="rotate(-90 100 100)"
        style={{ transition: drawn ? `stroke-dashoffset ${drawMs}ms ${ease}` : 'none' }} />
    </svg>
  )
}

/** Blur Ring — the 200px translucent halo behind the resting button (Surfaces/Dim 5% + 16px backdrop blur). */
export function Halo({ visible, ms = 600 }: { visible: boolean; ms?: number }) {
  return <span className={s.halo} style={{ opacity: visible ? 1 : 0, transition: `opacity ${ms}ms ease` }} aria-hidden />
}

/**
 * Pulse — two gradient discs that expand from the button and fade, clipped to the card.
 * Spec (Pulse Animation 39:30004): Fill Large 128 → 396px, Fill Small 8 → 328px, ease 0.15 0.05 0 1.
 * Remount with a new `k` to fire one pulse.
 */
export function Pulse({ k, ms, ease, cx, cy, tone = 'light' }: { k: number; ms: number; ease: string; cx: number; cy: number; tone?: 'light' | 'error' }) {
  if (k <= 0) return null
  const style = { '--pulse-ms': `${ms}ms`, '--pulse-ease': ease, left: cx, top: cy } as CSSProperties
  return (
    <div key={k} className={`${s.pulse} ${tone === 'error' ? s.pulseError : ''}`} style={style} aria-hidden>
      <span className={s.large} />
      <span className={s.small} />
    </div>
  )
}

/**
 * Two-line swap used by the tile title ("Front Door" ⇄ "Unlocking") and the activity line.
 * Spec: Title — outgoing moves up 24 and fades; incoming drops in from −24. 1600ms, ease 0.15 0 0.05 1.
 *       Activity — outgoing moves down 24 and fades; incoming rises from +24.
 */
export function Swap({ a, b, showB, dir, ms, ease, height }: { a: ReactNode; b: ReactNode; showB: boolean; dir: 'up' | 'down'; ms: number; ease: string; height: number }) {
  const off = dir === 'up' ? -24 : 24
  const line = (on: boolean): CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: `translateY(${on ? 0 : off}px)`,
    transition: `opacity ${ms}ms ${ease}, transform ${ms}ms ${ease}`,
  })
  return (
    <div className={s.swap} style={{ height }}>
      <div className={s.line} style={line(!showB)} aria-hidden={showB}>{a}</div>
      <div className={s.line} style={line(showB)} aria-hidden={!showB}>{b}</div>
    </div>
  )
}
