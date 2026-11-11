import { asset } from '../asset'
import s from './LockButton.module.css'

export type Operation = 'Available' | 'Unavailable' | 'Error'

type Props = {
  locked: boolean
  operation: Operation
  /** true while a lock/unlock command is in flight */
  busy?: boolean
  onPress?: () => void
}

const src = (op: Operation, locked: boolean) =>
  asset(`btn-${op.toLowerCase()}-${locked ? 'locked' : 'unlocked'}.svg`)

/**
 * Lock/unlock button — Figma: Molecules → Locks → Button (12342:63295)
 * Variants: Operation (Available | Unavailable | Error) × Locked (Yes | No).
 * Both locked + unlocked art are stacked so state changes cross-fade.
 */
export function LockButton({ locked, operation, busy = false, onPress }: Props) {
  const isError = operation === 'Error'
  const disabled = operation === 'Unavailable' || busy
  const label = busy ? (locked ? 'Unlocking…' : 'Locking…') : locked ? 'Unlock' : 'Lock'

  return (
    <button
      className={`${s.button} ${busy ? s.busy : ''}`}
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      aria-pressed={locked}
    >
      {[true, false].map((art) => (
        <span key={String(art)} className={`${s.art} ${isError ? s.errorArt : ''}`} data-visible={art === locked}>
          <img src={src(operation, art)} alt="" draggable={false} />
        </span>
      ))}
      {busy && <span className={s.ring} aria-hidden />}
    </button>
  )
}
