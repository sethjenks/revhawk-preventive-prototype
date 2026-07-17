/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — map open (in-card morph)
 *
 *    0ms   Map strip clicked
 *    0ms   card body content begins fading out
 *   80ms   map height eases open (88 → ~420)
 *  200ms   pin pops (snappy spring)
 *  280ms   callout + bottom sheet slide up
 *
 * ANIMATION STORYBOARD — map close
 *
 *    0ms   sheet/callout fade down
 *   80ms   map height collapses
 *  120ms   card body content fades back in
 * ───────────────────────────────────────────────────────── */

export const MAP_OPEN_TIMING = {
  bodyOut: 0,
  height: 80,
  pin: 200,
  sheet: 280,
};

export const MAP_CLOSE_TIMING = {
  sheetOut: 0,
  height: 80,
  bodyIn: 120,
};

export const MAP_HEIGHT = {
  collapsed: 88,
  expanded: 420,
  spring: { type: "spring" as const, stiffness: 320, damping: 32 },
};

export const MAP_BODY = {
  spring: { type: "spring" as const, stiffness: 340, damping: 30 },
};

export const MAP_PIN = {
  initialScale: 0.4,
  finalScale: 1.0,
  spring: { type: "spring" as const, stiffness: 500, damping: 22 },
};

export const MAP_SHEET = {
  offsetY: 24,
  spring: { type: "spring" as const, stiffness: 360, damping: 28 },
};

export const MapStage = {
  Idle: 0,
  Morphing: 1,
  Pin: 2,
  Sheet: 3,
} as const;

export type MapStageValue = (typeof MapStage)[keyof typeof MapStage];
