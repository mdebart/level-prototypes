import { asset } from '../asset'
import s from './PopUp.module.css'

type Props = {
  open: boolean
  title: string
  body: string
  primary: string
  secondary?: string
  onPrimary: () => void
  onSecondary?: () => void
  onClose: () => void
}

/**
 * Error pop-up — Figma: 03 Locks → Error Overlay → Pop-up (39:30319).
 * White 90% card, 16px backdrop blur, Highlight Icon (error), H2 + Body 2, two CTAs.
 * Enters with 400ms ease 0.16 0.03 0 1 ("Door is open" → Error Overlay).
 */
export function PopUp({ open, title, body, primary, secondary, onPrimary, onSecondary, onClose }: Props) {
  return (
    <div className={s.root} data-open={open} aria-hidden={!open}>
      <div className={s.scrim} />
      <div className={s.card} role="alertdialog" aria-label={title}>
        <button className={s.close} onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1}>
          <img src={asset('close.svg')} width={16} height={16} alt="" />
        </button>
        <div className={s.icon}><img src={asset('error-x.svg')} width={32} height={32} alt="" /></div>
        <div className={s.copy}>
          <p className={`lv-h2 ${s.title}`}>{title}</p>
          <p className={`lv-body2 ${s.body}`}>{body}</p>
        </div>
        <div className={s.ctas}>
          <button className={s.primary} onClick={onPrimary} tabIndex={open ? 0 : -1}>{primary}</button>
          {secondary && (
            <button className={s.secondary} onClick={onSecondary} tabIndex={open ? 0 : -1}>
              {secondary}
              <img src={asset('arrow-charcoal.svg')} width={16} height={16} alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
