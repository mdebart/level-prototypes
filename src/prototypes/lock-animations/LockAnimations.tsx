import { useCallback, useEffect, useRef, useState } from 'react'
import { asset } from '../../asset'
import { Device } from '../../components/Device'
import { AppBackground } from '../../components/AppBackground'
import { LockTile } from '../../components/LockTile'
import { LockOrb } from '../../components/LockOrb'
import { Halo, Pulse, RequestRing, Swap } from '../../components/LockMotion'
import { PopUp } from '../../components/PopUp'
import { EASE, FIGMA_SPEC, SNAPPY, TIMING_LABELS, type Timing } from './timing'
import s from './LockAnimations.module.css'

/**
 * Prototype: Lock operation animations
 * Source: 03 Locks → ▶️ Lock Animations (39:29674) — Unlock, Lock, Lock Error.
 *
 * URL params (for portfolio embeds):
 *   ?locked=0          start unlocked (default: locked)
 *   ?outcome=error     next lock attempt fails (Lock Error animation)
 *   ?preset=snappy     use the tighter timing preset
 *   ?autoplay=1        loop lock ⇄ unlock on its own
 */

type Phase = 'idle' | 'request' | 'progress' | 'error'

const NAME = 'Front Door'
const PEOPLE = { amelia: 'Amelia', you: 'You' }

function stamp(d = new Date()) {
  return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

function readParams() {
  const q = new URLSearchParams(window.location.hash.split('?')[1] ?? window.location.search)
  return {
    embed: q.get('embed') === '1',
    locked: q.get('locked') !== '0',
    outcome: (q.get('outcome') === 'error' ? 'error' : 'success') as 'success' | 'error',
    preset: q.get('preset') === 'snappy' ? 'snappy' : 'figma',
    autoplay: q.get('autoplay') === '1',
  }
}

export default function LockAnimations() {
  const params = useRef(readParams()).current
  const [timing, setTiming] = useState<Timing>(params.preset === 'snappy' ? SNAPPY : FIGMA_SPEC)
  const [speed, setSpeed] = useState(1)
  const [outcome, setOutcome] = useState(params.outcome)

  // Visual state
  const [locked, setLocked] = useState(params.locked)
  const [phase, setPhase] = useState<Phase>('idle')
  const [ringDrawn, setRingDrawn] = useState(false)
  const [ringVisible, setRingVisible] = useState(false)
  const [haloVisible, setHaloVisible] = useState(true)
  const [contracted, setContracted] = useState(false)
  const [orbLocked, setOrbLocked] = useState(params.locked)
  const [errorGlow, setErrorGlow] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [popup, setPopup] = useState(false)
  const [activity, setActivity] = useState({ a: { who: PEOPLE.amelia, locked: params.locked, when: 'July 6, 4:27 PM' }, b: null as null | { who: string; locked: boolean; when: string }, showB: false })
  const [elapsed, setElapsed] = useState(0)

  const timers = useRef<number[]>([])
  const raf = useRef(0)
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; cancelAnimationFrame(raf.current) }
  useEffect(() => clear, [])

  const t = useCallback((ms: number) => ms / speed, [speed])
  const at = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, t(ms))) }

  const reset = useCallback((toLocked: boolean) => {
    clear()
    setPhase('idle'); setRingDrawn(false); setRingVisible(false); setHaloVisible(true)
    setContracted(false); setOrbLocked(toLocked); setLocked(toLocked); setErrorGlow(false)
    setShowStatus(false); setPopup(false); setElapsed(0)
    setActivity({ a: { who: PEOPLE.amelia, locked: toLocked, when: 'July 6, 4:27 PM' }, b: null, showB: false })
  }, [])

  const run = useCallback((fail: boolean) => {
    if (phase !== 'idle') return
    clear()
    const T = timing
    const target = !locked
    const willFail = fail && target // errors only on a lock attempt, as in the Figma
    const pulses = willFail ? T.errorPulses : T.pulseCount
    const end = T.progressStart + pulses * T.pulseDur

    // Elapsed clock for the timing panel
    const t0 = performance.now()
    const tick = () => { setElapsed(Math.round((performance.now() - t0) * speed)); raf.current = requestAnimationFrame(tick) }
    raf.current = requestAnimationFrame(tick)

    // 0 — Request Ring
    setPhase('request')
    setRingVisible(true)
    requestAnimationFrame(() => setRingDrawn(true))

    // Title: Front Door → Unlocking/Locking
    at(T.titleDelay, () => setShowStatus(true))

    // Progress: pulses + button breathing
    at(T.progressStart, () => { setPhase('progress'); setRingVisible(false); setHaloVisible(false) })
    for (let i = 0; i < pulses; i++) at(T.progressStart + i * T.pulseDur, () => setPulse((p) => p + 1))
    const steps = Math.max(1, Math.floor((end - T.progressStart) / T.breathDur) - 1)
    for (let i = 0; i < steps; i++) at(T.progressStart + i * T.breathDur, () => setContracted(i % 2 === 0))

    if (willFail) {
      at(end - T.breathDur, () => { setContracted(false); setErrorGlow(true) })
      at(end - T.breathDur + T.popupDelay, () => { setPhase('error'); setPopup(true); cancelAnimationFrame(raf.current) })
      return
    }

    // Final step — orb takes on the new state
    at(end - T.breathDur, () => { setContracted(false); setOrbLocked(target) })
    // Title back, activity updates, halo returns
    at(end, () => {
      setShowStatus(false)
      setHaloVisible(true)
      setLocked(target)
      setActivity((prev) => ({ a: prev.a, b: { who: PEOPLE.you, locked: target, when: stamp() }, showB: true }))
    })
    at(end + Math.max(T.titleDur, T.activityDur), () => {
      setActivity((prev) => ({ a: prev.b ?? prev.a, b: null, showB: false }))
      setPhase('idle')
      cancelAnimationFrame(raf.current)
    })
  }, [phase, locked, timing, speed])

  // Autoplay loop for embeds
  useEffect(() => {
    if (!params.autoplay || phase !== 'idle') return
    const id = window.setTimeout(() => run(false), 2200)
    return () => clearTimeout(id)
  }, [params.autoplay, phase, run])

  const dismissError = () => {
    setPopup(false)
    setErrorGlow(false)
    setShowStatus(false)
    setHaloVisible(true)
    setPhase('idle')
  }
  const retry = () => { dismissError(); window.setTimeout(() => run(false), 450) }

  const verb = locked ? 'Unlocking' : 'Locking'
  const act = (x: { who: string; locked: boolean; when: string }) => (
    <>
      <span className="lv-body1">{x.locked ? 'Locked' : 'Unlocked'} by {x.who}</span>
      <span className={`lv-body3 ${s.muted}`}>{x.when}</span>
    </>
  )

  const device = (
    <Device background={<AppBackground />}>
      <div className={s.nav}>
        <span className="lv-h1">Home</span>
        <img className={s.carrot} src={asset('carrot.svg')} width={24} height={8} alt="" />
      </div>

      <div className={s.tile}>
        <LockTile
          name={NAME}
          title={
            <Swap showB={showStatus} dir="up" ms={t(timing.titleDur)} ease={EASE.text} height={24}
              a={<span className="lv-h3">{NAME}</span>}
              b={<span className="lv-h3">{verb}</span>} />
          }
          underlay={pulse > 0 && <Pulse k={pulse} ms={t(timing.pulseDur)} ease={EASE.motion} cx={163.5} cy={172} tone={errorGlow ? 'error' : 'light'} />}
        >
          <button className={s.button} onClick={() => run(outcome === 'error')} disabled={phase !== 'idle'}
            aria-label={locked ? 'Unlock Front Door' : 'Lock Front Door'}>
            <Halo visible={haloVisible} />
            <RequestRing visible={ringVisible} drawn={ringDrawn} drawMs={t(timing.ringDraw)} ease={EASE.ring} />
            <span className={s.orb}>
              <LockOrb locked={orbLocked} contracted={contracted} error={errorGlow} duration={t(timing.breathDur)} ease={EASE.motion} />
            </span>
          </button>
          <Swap showB={activity.showB} dir="down" ms={t(timing.activityDur)} ease={EASE.text} height={40}
            a={act(activity.a)} b={activity.b ? act(activity.b) : null} />
        </LockTile>
      </div>

      <PopUp open={popup}
        title="Unable to lock"
        body="The Bolt is unable to move freely. Make sure nothing is blocking or limiting your lock’s movement."
        primary="Try again" secondary="Learn more"
        onPrimary={retry} onSecondary={dismissError} onClose={dismissError} />
    </Device>
  )

  if (params.embed) return device

  return (
    <div className={s.layout}>
      <div className={s.stage}>{device}</div>
      <aside className={s.panel} aria-label="Timing controls">
        <div className={s.row}>
          <button className={s.cta} onClick={() => run(outcome === 'error')} disabled={phase !== 'idle'}>
            {locked ? 'Unlock' : 'Lock'}
          </button>
          <button className={s.ghost} onClick={() => reset(!locked)}>Reset</button>
        </div>

        <fieldset className={s.group}>
          <legend>Outcome of next lock</legend>
          {(['success', 'error'] as const).map((o) => (
            <label key={o}><input type="radio" checked={outcome === o} onChange={() => setOutcome(o)} /> {o === 'success' ? 'Success' : 'Error (jammed)'}</label>
          ))}
        </fieldset>

        <fieldset className={s.group}>
          <legend>Preset</legend>
          <label><input type="radio" checked={timing === FIGMA_SPEC} onChange={() => setTiming(FIGMA_SPEC)} /> Figma spec</label>
          <label><input type="radio" checked={timing === SNAPPY} onChange={() => setTiming(SNAPPY)} /> Snappy</label>
        </fieldset>

        <fieldset className={s.group}>
          <legend>Speed · {speed}×</legend>
          <input type="range" min={0.25} max={2} step={0.25} value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </fieldset>

        <fieldset className={s.group}>
          <legend>Timing (ms)</legend>
          {(Object.keys(TIMING_LABELS) as (keyof Timing)[]).map((k) => (
            <label key={k} className={s.field}>
              <span>{TIMING_LABELS[k]}</span>
              <input type="number" value={timing[k]} step={k.includes('Count') || k === 'errorPulses' ? 1 : 50} min={k.includes('Count') || k === 'errorPulses' ? 1 : 0}
                onChange={(e) => setTiming({ ...timing, [k]: Math.max(0, +e.target.value) })} />
            </label>
          ))}
          <button className={s.ghost} onClick={() => navigator.clipboard?.writeText(JSON.stringify(timing, null, 2))}>Copy values</button>
        </fieldset>

        <p className={s.clock}>t = {elapsed} ms</p>
      </aside>
    </div>
  )
}
