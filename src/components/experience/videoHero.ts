// Real-footage hero. Two modes (set via /public/hero/hero.json → { "mode": ... }):
//   "loop"  – plays the clip muted on loop as a cinematic background (default;
//             good for ambient stock footage).
//   "scrub" – scroll drives the clip's currentTime, so a designed "fly-in
//             through the 7 steps" plays forward/back with the scroll (best for
//             a commissioned/bespoke clip cut to the timeline).
// Either way the current frame is drawn to the canvas (reliable compositing)
// and the same 7-step overlays are paced on top.

import { timelineAt, progressFromSection } from "@/lib/hero-timeline";

export type HeroVideoMode = "loop" | "scrub";

interface CreateOpts {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  intro: HTMLElement;
  panel: HTMLElement;
  cue: HTMLElement;
  onIdx: (idx: number) => void;
  mode?: HeroVideoMode;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function createVideoHero(opts: CreateOpts): () => void {
  const { video, canvas, section, intro, panel, cue, onIdx } = opts;
  const mode: HeroVideoMode = opts.mode ?? "loop";
  const ctx = canvas.getContext("2d")!;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  if (mode === "loop") {
    video.loop = true;
    const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("canplay", tryPlay, { once: true });
  } else {
    video.loop = false;
    video.pause();
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
    canvas.height = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
  };
  window.addEventListener("resize", resize);
  resize();

  const draw = () => {
    if (video.readyState < 2) return;
    const cw = canvas.width, ch = canvas.height, iw = video.videoWidth, ih = video.videoHeight;
    if (!iw || !ih) return;
    const s = Math.max(cw / iw, ch / ih); // cover
    const w = iw * s, h = ih * s;
    ctx.drawImage(video, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  let target = 0, cur = 0, curIdx = -2, raf = 0, lastSeek = -1;
  const onScroll = () => { target = progressFromSection(section); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    cur = lerp(cur, target, 0.08);
    const p = cur;
    const t = timelineAt(p);
    intro.style.opacity = String(t.introOpacity);
    panel.style.opacity = t.idx >= 0 ? String(t.panelOpacity) : "0";
    cue.style.opacity = String(t.cueOpacity);
    if (t.idx !== curIdx) { curIdx = t.idx; onIdx(t.idx); }

    if (mode === "scrub") {
      const dur = video.duration;
      if (dur && isFinite(dur) && video.readyState >= 2) {
        const time = Math.min(dur - 0.05, Math.max(0, p * (dur - 0.05)));
        if (lastSeek < 0 || Math.abs(time - lastSeek) > 0.033) { video.currentTime = time; lastSeek = time; }
      }
    }
    draw();
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
    video.pause();
  };
}
