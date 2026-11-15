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
  {
    slug: 'lock-animations',
    title: 'Lock operation animations',
    summary: 'Request ring, pulses, button breathing and state change for unlock, lock and lock error — with a live timing panel.',
    figma: 'https://www.figma.com/design/u6oFP5WKMXSZ7Lg11sVma7/?node-id=39-29674',
    Component: lazy(() => import('./lock-animations/LockAnimations')),
  },
]
