import { asset } from '../asset'
import s from './Activity.module.css'

export type ActivityStatus = 'Locked' | 'Unlocked' | 'Information' | 'Critical'

type Props = {
  status: ActivityStatus
  title: string
  subtitle: string
  onAction?: () => void
}

/** Lock activity line — Figma: Molecules → Locks → Activity (12342:63312) */
export function Activity({ status, title, subtitle, onAction }: Props) {
  const isCritical = status === 'Critical'
  return (
    <div className={s.activity} aria-live="polite">
      <p className={`lv-body1 ${s.title} ${isCritical ? s.critical : ''}`}>{title}</p>
      {isCritical && onAction ? (
        <button className={`lv-body3 ${s.subtitle} ${s.link}`} onClick={onAction}>
          {subtitle}
          <img src={asset('arrow-up-right.svg')} width={16} height={16} alt="" />
        </button>
      ) : (
        <p className={`lv-body3 ${s.subtitle}`}>{subtitle}</p>
      )}
    </div>
  )
}
