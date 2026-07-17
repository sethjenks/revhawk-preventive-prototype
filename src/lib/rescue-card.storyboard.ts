/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — expand
 *
 * Read top-to-bottom. Each value is ms after Details click.
 *
 *    0ms   Details clicked / expandedId set
 *   80ms   card height begins easing open (layout)
 *  180ms   why section fades/slides up
 *  320ms   rescue paths stagger in
 *
 * ANIMATION STORYBOARD — path start
 *
 *    0ms   Start clicked on selected path
 *   80ms   steps + optional script expand in
 *  200ms   Log Outreach / Skip actions fade in
 *
 * ANIMATION STORYBOARD — collapse
 *
 *    0ms   Collapse clicked
 *    0ms   paths fade out (fast)
 *  120ms   why fades out
 *  200ms   height collapses to recommended strip
 *
 * ANIMATION STORYBOARD — skip / dismiss exit
 *
 *    0ms   card fade + slide up 8px
 *  220ms   remove from list
 * ───────────────────────────────────────────────────────── */

export const EXPAND_TIMING = {
  layoutOpen: 80,
  why: 180,
  paths: 320,
};

export const PATH_START_TIMING = {
  details: 80,
  actions: 200,
};

export const COLLAPSE_TIMING = {
  chromeOut: 0,
  contentOut: 120,
  layoutClose: 200,
};

export const EXIT_TIMING = {
  fadeSlide: 0,
  remove: 220,
};

export const EXPAND = {
  spring: { type: "spring" as const, stiffness: 320, damping: 32 },
};

export const SECTION = {
  offsetY: 12,
  spring: { type: "spring" as const, stiffness: 350, damping: 28 },
};

export const PATHS = {
  stagger: 0.08,
  offsetY: 10,
  spring: { type: "spring" as const, stiffness: 380, damping: 28 },
};

export const EXIT = {
  offsetY: -8,
  spring: { type: "spring" as const, stiffness: 400, damping: 32 },
};

export const ExpandStage = {
  Idle: 0,
  Layout: 1,
  Why: 2,
  Paths: 3,
} as const;

export type ExpandStageValue =
  (typeof ExpandStage)[keyof typeof ExpandStage];
