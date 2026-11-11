import type { ReactNode } from 'react'
import s from './Sheet.module.css'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Bottom drawer — placeholder for Components → Drawers / Overlays until ported. */
export function Sheet({ open, title, onClose, children }: Props) {
  return (
    <div className={s.root} data-open={open} aria-hidden={!open}>
      <button className={s.scrim} onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1} />
      <div className={s.sheet} role="dialog" aria-label={title}>
        <div className={s.grabber} />
        <h3 className={`lv-body1 ${s.title}`}>{title}</h3>
        {children}
      </div>
    </div>
  )
}

export function SheetOption({ label, detail, selected, onSelect }: { label: string; detail?: string; selected?: boolean; onSelect: () => void }) {
  return (
    <button className={s.option} data-selected={selected} onClick={onSelect}>
      <span className="lv-body1">{label}</span>
      {detail && <span className={`lv-body3 ${s.detail}`}>{detail}</span>}
    </button>
  )
}
