import { lazy } from 'react'

/**
 * Every feature prototype is registered here. Each gets:
 *   /#/p/<slug>            full page with title
 *   /#/p/<slug>?embed=1    bare, transparent — for iframes on the portfolio
 */
export const prototypes = [
  {
    slug: 'home-lock',
    title: 'Home · Lock / Unlock',
    summary: 'Glass lock tile with lock/unlock, in-flight, unavailable and jammed states.',
    figma: 'https://www.figma.com/design/6oQpFDicHimuttWqn7CtmG/?node-id=12440-21323',
    Component: lazy(() => import('./home-lock/HomeLock')),
  },
]
