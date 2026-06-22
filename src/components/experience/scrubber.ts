// Pre-rendered image-sequence scrubber. Draws the frame matching scroll
// progress to a <canvas> and drives the same overlay timeline as the live
// scene. Activated when /hero/frames/manifest.json exists (see EXPERIENCE_3D.md).

import { timelineAt, progressFromSection } from "@/lib/hero-timeline";

export interface FrameManifest {
  count: number; // number of frames
  dir: string; // e.g. "/hero/frames"
  ext: string; // "avif" | "webp" | "jpg"
  pad: number; // zero-pad width, e.g. 4 -> 0001
  mobileDir?: string; // optional downscaled set for narrow viewports
}

interface CreateOpts {
  manifest: FrameManifest;
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  intro: HTMLElement;
  panel: HTMLElement;
  cue: HTMLElement;
  onIdx: (idx: number) => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const frameUrl = (m: FrameManifest, dir: string, i: number) =>
  `${dir}/${String(i + 1).padStart(m.pad, "0")}.${m.ext}`;

export function createScrubber(opts: CreateOpts): () => void {
  const { manifest: m, canvas, section, intro, panel, cue, onIdx } = opts;
  const ctx = canvas.getContext("2d")!;
  const dir = m.mobileDir && window.innerWidth < 768 ? m.mobileDir : m.dir;

  const images: (HTMLImageElement | undefined)[] = new Array(m.count);
  const loaded: boolean[] = new Array(m.count).fill(false);

  // Progressive loader — first frame immediately, then fill in with bounded concurrency.
  let next = 0;
  const CONCURRENCY = 8;
  const loadOne = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { loaded[i] = true; resolve(); };
      img.onerror = () => resolve();
      img.src = frameUrl(m, dir, i);
      images[i] = img;
    });
  const pump = async () => {
    while (next < m.count) {
      const i = next++;
      await loadOne(i);
    }
  };
  // Load frame 0 first so we can paint something ASAP, then start the pool.
  loadOne(0).then(() => { for (let k = 0; k < CONCURRENCY; k++) pump(); });

  const nearestLoaded = (i: number): number => {
    if (loaded[i]) return i;
    for (let d = 1; d < m.count; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < m.count && loaded[i + d]) return i + d;
    }
    return -1;
  };

  const draw = (frameIndex: number) => {
    const idx = nearestLoaded(frameIndex);
    if (idx < 0) return;
    const img = images[idx];
    if (!img) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const scale = Math.max(cw / iw, ch / ih); // cover
    const w = iw * scale, h = ih * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
    canvas.height = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
  };
  window.addEventListener("resize", resize);
  resize();

  let target = 0, cur = 0, curIdx = -2, lastFrame = -1, raf = 0;
  const onScroll = () => { target = progressFromSection(section); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    cur = lerp(cur, target, 0.075); // cinematic damping, matches the live scene
    const p = cur;
    const t = timelineAt(p);

    intro.style.opacity = String(t.introOpacity);
    panel.style.opacity = t.idx >= 0 ? String(t.panelOpacity) : "0";
    cue.style.opacity = String(t.cueOpacity);
    if (t.idx !== curIdx) { curIdx = t.idx; onIdx(t.idx); }

    const frameIndex = Math.round(p * (m.count - 1));
    if (frameIndex !== lastFrame) { lastFrame = frameIndex; draw(frameIndex); }
    else if (!loaded[frameIndex]) draw(frameIndex); // repaint once the frame arrives
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
  };
}
