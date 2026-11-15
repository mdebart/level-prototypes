import s from './LockOrb.module.css'

type Props = {
  /** Visual state of the orb (colour + icon). */
  locked: boolean
  /** "Breathing" step while a command is in flight: 144px → 128px, icon 70%. */
  contracted?: boolean
  /** Red error glow (Lock Error animation). */
  error?: boolean
  /** Transition duration for colour/size changes, ms. */
  duration?: number
  /** CSS easing for colour/size changes. */
  ease?: string
}

/**
 * The 144px lock button "orb", fully coded so it can animate.
 * Figma: 03 Locks → Lock Animations → Button 48px icon (39:29892 / 39:30154)
 *   Locked   — Charcoal fill, white icon, top-left 30% white glow, bottom-right dark glow
 *   Unlocked — Cotton fill, charcoal icon, icon halves spread 4px apart diagonally
 */
export function LockOrb({ locked, contracted = false, error = false, duration = 900, ease = 'cubic-bezier(0.15, 0.05, 0, 1)' }: Props) {
  const style = { '--orb-dur': `${duration}ms`, '--orb-ease': ease } as React.CSSProperties
  return (
    <div className={s.orb} data-locked={locked} data-contracted={contracted} data-error={error} style={style}>
      <span className={s.errorGlow} aria-hidden />
      <svg className={s.svg} viewBox="0 0 144 144" width={144} height={144} aria-hidden>
        <defs>
          <clipPath id="orb-clip"><circle cx="72" cy="72" r="72" /></clipPath>
          <filter id="orb-blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="20" /></filter>
          <linearGradient id="orb-stroke" x1="0" y1="0" x2="0.55" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#3A3A3C" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="orb-dark-glow" x1="0" y1="0" x2="1" y2="0.06">
            <stop offset="0" stopColor="#000" stopOpacity="0.6" />
            <stop offset="1" stopColor="#383838" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="orb-light-glow" x1="0" y1="0" x2="1" y2="0.06">
            <stop offset="0" stopColor="#3A3A3C" stopOpacity="0.12" />
            <stop offset="1" stopColor="#3A3A3C" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        <circle className={s.fill} cx="72" cy="72" r="72" />
        <g clipPath="url(#orb-clip)">
          {/* Locked glow */}
          <g className={s.glowLocked} filter="url(#orb-blur)">
            <rect x="0" y="0" width="72" height="72" fill="#fff" fillOpacity="0.3" />
            <rect x="72" y="72" width="72" height="72" fill="url(#orb-dark-glow)" />
          </g>
          {/* Unlocked glow */}
          <g className={s.glowUnlocked} filter="url(#orb-blur)">
            <rect x="0" y="0" width="72" height="72" fill="#fff" />
            <rect x="76" y="76" width="72" height="72" fill="url(#orb-light-glow)" />
          </g>
        </g>
        <circle cx="72" cy="72" r="71.5" fill="none" stroke="url(#orb-stroke)" strokeWidth="1" />

        {/* Icon: two L-shaped halves in a 48px box centred in the orb */}
        <g className={s.icon} transform="translate(48 48)">
          <g className={s.halfB}><path d="M8 0H0V32H32V24H8V0Z" /></g>
          <g className={s.halfA}><path d="M24 32H32V0H0V8H24V32Z" /></g>
        </g>
      </svg>
    </div>
  )
}
