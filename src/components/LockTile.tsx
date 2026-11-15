import type { ReactNode } from 'react'
import { asset } from '../asset'
import s from './LockTile.module.css'

type Props = {
  name: string
  /** Replaces the plain name, e.g. an animated "Front Door ⇄ Unlocking" swap. */
  title?: ReactNode
  /** Layer under the content, clipped to the card (e.g. lock pulses). */
  underlay?: ReactNode
  onMore?: () => void
  children: ReactNode
}

/**
 * Glass lock card — Figma: Components → Lock Tiles (12246:84465 / 13816:6278)
 * Effect "Lock Card Effect": background blur + 0/16/32 drop shadow.
 */
export function LockTile({ name, title, underlay, onMore, children }: Props) {
  return (
    <section className={s.tile} aria-label={`${name} lock`}>
      {underlay && <div className={s.underlay} aria-hidden>{underlay}</div>}
      <header className={s.header}>
        {title ?? <h2 className={`lv-h3 ${s.name}`}>{name}</h2>}
        <button className={s.more} onClick={onMore} aria-label={`${name} settings`}>
          <img src={asset('settings-icon.svg')} width={4} height={24} alt="" />
        </button>
      </header>
      {children}
    </section>
  )
}
