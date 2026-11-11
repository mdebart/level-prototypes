import { useEffect, useRef, useState } from 'react'
import { asset } from '../../asset'
import { Device } from '../../components/Device'
import { LockTile } from '../../components/LockTile'
import { LockButton, type Operation } from '../../components/LockButton'
import { Activity, type ActivityStatus } from '../../components/Activity'
import { Sheet, SheetOption } from '../../components/Sheet'
import s from './HomeLock.module.css'

/**
 * Prototype: Home → lock tile → lock / unlock
 * Source: App Templates → Type=Home (12440:21323)
 *
 * URL params (handy for portfolio embeds):
 *   ?locked=1          start locked
 *   ?state=offline     start in Unavailable
 *   ?state=jammed      start in Error
 */

type Home = { id: string; name: string; lock: string }
const HOMES: Home[] = [
  { id: 'home', name: 'Home', lock: 'Front Door' },
  { id: 'lake', name: 'Lake House', lock: 'Back Door' },
]

type DemoState = 'normal' | 'offline' | 'jammed'
const OPERATION: Record<DemoState, Operation> = { normal: 'Available', offline: 'Unavailable', jammed: 'Error' }

const LOCK_LATENCY_MS = 1400

function timeLabel(d: Date) {
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date}, ${time}`
}

export default function HomeLock() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? window.location.search)
  const [home, setHome] = useState<Home>(HOMES[0])
  const [locked, setLocked] = useState(params.get('locked') === '1')
  const [busy, setBusy] = useState(false)
  const [demo, setDemo] = useState<DemoState>((params.get('state') as DemoState) || 'normal')
  const [last, setLast] = useState({ who: 'Amelia', when: 'July 6, 7:19 PM' })
  const [sheet, setSheet] = useState<'none' | 'homes' | 'settings'>('none')
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const operation = OPERATION[demo] ?? 'Available'

  const toggle = () => {
    if (busy) return
    if (operation === 'Error') {
      // Retry from jammed: resolves back to normal after a beat
      setBusy(true)
      timer.current = window.setTimeout(() => { setBusy(false); setDemo('normal') }, LOCK_LATENCY_MS)
      return
    }
    setBusy(true)
    timer.current = window.setTimeout(() => {
      setLocked((l) => !l)
      setLast({ who: 'You', when: timeLabel(new Date()) })
      setBusy(false)
      navigator.vibrate?.(12)
    }, LOCK_LATENCY_MS)
  }

  let activity: { status: ActivityStatus; title: string; subtitle: string }
  if (busy) activity = { status: locked ? 'Unlocked' : 'Locked', title: operation === 'Error' ? 'Retrying…' : locked ? 'Unlocking…' : 'Locking…', subtitle: 'Hold your phone near the door' }
  else if (demo === 'offline') activity = { status: 'Information', title: 'Lock unavailable', subtitle: 'Out of Bluetooth range' }
  else if (demo === 'jammed') activity = { status: 'Critical', title: 'Lock jammed', subtitle: 'Tap to retry' }
  else activity = { status: locked ? 'Locked' : 'Unlocked', title: `${locked ? 'Locked' : 'Unlocked'} by ${last.who}`, subtitle: last.when }

  return (
    <Device
      background={
        <div className={s.bg} aria-hidden>
          <img src={asset('wallpaper-home.png')} alt="" />
          <div className={s.overlay} />
        </div>
      }
    >
      <button className={s.nav} onClick={() => setSheet('homes')} aria-label={`${home.name}, switch home`}>
        <span className="lv-h1">{home.name}</span>
        <img className={s.carrot} src={asset('carrot.svg')} width={24} height={8} alt="" />
      </button>

      <div className={s.tile}>
        <LockTile name={home.lock} onMore={() => setSheet('settings')}>
          <LockButton locked={locked} operation={operation} busy={busy} onPress={toggle} />
          <Activity {...activity} onAction={toggle} />
        </LockTile>
      </div>

      <Sheet open={sheet === 'homes'} title="Switch home" onClose={() => setSheet('none')}>
        {HOMES.map((h) => (
          <SheetOption key={h.id} label={h.name} detail={h.lock} selected={h.id === home.id}
            onSelect={() => { setHome(h); setSheet('none') }} />
        ))}
      </Sheet>

      <Sheet open={sheet === 'settings'} title="Prototype states" onClose={() => setSheet('none')}>
        <SheetOption label="Available" detail="Normal lock / unlock" selected={demo === 'normal'} onSelect={() => { setDemo('normal'); setSheet('none') }} />
        <SheetOption label="Unavailable" detail="Out of range — button disabled" selected={demo === 'offline'} onSelect={() => { setDemo('offline'); setSheet('none') }} />
        <SheetOption label="Error" detail="Jammed — tap to retry" selected={demo === 'jammed'} onSelect={() => { setDemo('jammed'); setSheet('none') }} />
      </Sheet>
    </Device>
  )
}
