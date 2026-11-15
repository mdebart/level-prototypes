/**
 * Lock operation timeline — values from 03 Locks → ▶️ Lock Animations (39:29674) spec cards.
 * All times in ms from the tap. Edit here (or live in the timing panel) to refine.
 */
export type Timing = {
  ringDraw: number        // Request Ring draw (Loader Progress, 700ms)
  progressStart: number   // Pulse + Button animation Step 1 delay (2500ms)
  titleDelay: number      // Title Animation Step 1 delay (2400ms)
  titleDur: number        // Title swap duration (1600ms)
  pulseDur: number        // Pulse Animation duration (1800ms)
  pulseCount: number      // Pulses for a successful operation (Steps 1, 3, 5 → 3)
  breathDur: number       // Button Animation step duration (900ms)
  activityDur: number     // Activity swap duration (1600ms)
  errorPulses: number     // Pulses before the error glow (Lock Error storyboard → 2)
  popupDelay: number      // Error glow → pop-up ("Door is open" → Error Overlay)
}

export const FIGMA_SPEC: Timing = {
  ringDraw: 700,
  progressStart: 2500,
  titleDelay: 2400,
  titleDur: 1600,
  pulseDur: 1800,
  pulseCount: 3,
  breathDur: 900,
  activityDur: 1600,
  errorPulses: 2,
  popupDelay: 900,
}

/** A tighter variant to compare against — same choreography, less waiting. */
export const SNAPPY: Timing = {
  ringDraw: 500,
  progressStart: 700,
  titleDelay: 300,
  titleDur: 700,
  pulseDur: 1300,
  pulseCount: 2,
  breathDur: 650,
  activityDur: 800,
  errorPulses: 2,
  popupDelay: 600,
}

export const EASE = {
  ring: 'cubic-bezier(0.49, 0.025, 0.99, 1.015)',
  motion: 'cubic-bezier(0.15, 0.05, 0, 1)',   // pulse + button
  text: 'cubic-bezier(0.15, 0, 0.05, 1)',     // title + activity
}

export const TIMING_LABELS: Record<keyof Timing, string> = {
  ringDraw: 'Request ring draw',
  progressStart: 'Progress starts at',
  titleDelay: 'Title swap at',
  titleDur: 'Title swap duration',
  pulseDur: 'Pulse duration',
  pulseCount: 'Pulses (success)',
  breathDur: 'Button breath step',
  activityDur: 'Activity swap duration',
  errorPulses: 'Pulses (error)',
  popupDelay: 'Error glow → pop-up',
}
