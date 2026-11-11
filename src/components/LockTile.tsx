import type { ReactNode } from 'react'
import { asset } from '../asset'
import s from './LockTile.module.css'

type Props = {
  name: string
  onMore?: () => void
  children: ReactNode
}

/**
 * Glass lock card — Figma: Components → Lock Tiles (12246:84465 / 13816:6278)
 * Effect "Lock Card Effect": background blur + 0/16/32 drop shadow.
 */
export function LockTile({ name, onMore, children }: Props) {
  return (
    <section className={s.tile} aria-label={`${name} lock`}>
      <header className={s.header}>
        <h2 className={`lv-h3 ${s.name}`}>{name}</h2>
        <button className={s.more} onClick={onMore} aria-label={`${name} settings`}>
          <img src={asset('settings-icon.svg')} width={4} height={24} alt="" />
        </button>
      </header>
      {children}
    </section>
  )
}
