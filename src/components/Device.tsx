import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { StatusBar } from './StatusBar'
import s from './Device.module.css'

const W = 375
const H = 812

/**
 * 375×812 app screen (Figma App Screens frame) that scales to fit its
 * container — so the same prototype works full-page or in a small iframe.
 */
export function Device({ children, background }: { children: ReactNode; background?: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / W, height / H, 1.25))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={stageRef} className={s.stage}>
      <div className={s.screen} style={{ transform: `scale(${scale})` }}>
        {background}
        {children}
        <StatusBar />
        <div className={s.homeIndicator} aria-hidden />
      </div>
    </div>
  )
}
