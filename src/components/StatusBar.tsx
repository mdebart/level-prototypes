import { asset } from '../asset'
import s from './StatusBar.module.css'

/** iOS status bar — Figma: Status Bar (12443:21494) */
export function StatusBar() {
  return (
    <div className={s.bar}>
      <span className={s.time}>9:41</span>
      <img src={asset('status-icons.svg')} width={71.27} height={11.333} alt="" />
    </div>
  )
}
