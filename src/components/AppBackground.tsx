import { asset } from '../asset'
import s from './AppBackground.module.css'

/**
 * App wallpaper — Figma: App Templates → Wallpapers (13425:16007).
 * Default is "Home 3" (15339:5703), the standard app background in the
 * build files (01 Home / Menu, 03 Locks).
 */
export function AppBackground({ src = 'wallpaper-home-3.jpg' }: { src?: string }) {
  return (
    <div className={s.bg} aria-hidden>
      <img src={asset(src)} alt="" />
      <div className={s.overlay} />
    </div>
  )
}
