// Shared scroll → step timeline for the hero experience. Used by both the
// real-time WebGL scene and the pre-rendered frame scrubber so they hit the
// exact same beats (see design-handoff/EXPERIENCE_3D.md §A).

export const INTRO_END = 0.085;
export const STEP_COUNT = 7;

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export interface TimelineState {
  idx: number; // -1 during intro, else 0..6
  lt: number; // local progress within the current step
  introOpacity: number;
  panelOpacity: number;
  cueOpacity: number;
}

export function timelineAt(p: number): TimelineState {
  if (p < INTRO_END) {
    return {
      idx: -1,
      lt: 0,
      introOpacity: clamp(1 - p / INTRO_END, 0, 1),
      panelOpacity: 0,
      cueOpacity: 1,
    };
  }
  const seg = (p - INTRO_END) / (1 - INTRO_END);
  const f = clamp(seg * STEP_COUNT, 0, STEP_COUNT - 0.0001);
  const idx = Math.floor(f);
  const lt = f - idx;
  return {
    idx,
    lt,
    introOpacity: 0,
    panelOpacity: clamp(Math.min(lt / 0.12, (1 - lt) / 0.12, 1), 0, 1),
    cueOpacity: clamp(1 - smooth(0.93, 1, p), 0, 1),
  };
}

/** Raw 0..1 scroll progress through the sticky hero section. */
export function progressFromSection(section: HTMLElement): number {
  const r = section.getBoundingClientRect();
  const total = section.offsetHeight - window.innerHeight;
  return total > 0 ? clamp(-r.top, 0, total) / total : 0;
}
