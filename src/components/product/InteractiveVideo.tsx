"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import type { Chapter } from "@/lib/product-sales";

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * Interactive product explainer player: poster + play overlay, scrub bar,
 * mute, and clickable chapters that seek to a fraction of the runtime and
 * surface a caption. `accent` themes the controls per product.
 */
export default function InteractiveVideo({
  src,
  poster,
  chapters,
  accent = "#6FAE52",
  label = "Watch the 60-second explainer",
}: {
  src: string;
  poster?: string;
  chapters: Chapter[];
  accent?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);

  // Active chapter = the last one whose start fraction we've passed.
  const frac = dur > 0 ? cur / dur : 0;
  const activeIdx = chapters.reduce((acc, c, i) => (frac + 0.0001 >= c.at ? i : acc), 0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => setCur(v.currentTime);
    const onMeta = () => setDur(v.duration || 0);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setStarted(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const seekToChapter = (c: Chapter) => {
    const v = ref.current;
    if (!v) return;
    const target = (v.duration || 0) * c.at;
    v.currentTime = target;
    setCur(target);
    if (v.paused) {
      v.play();
      setPlaying(true);
      setStarted(true);
    }
  };

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
    setCur(v.currentTime);
  };

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const restart = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setCur(0);
    v.play();
    setPlaying(true);
    setStarted(true);
  };

  return (
    <div>
      <div className="group relative aspect-video w-full overflow-hidden rounded-[20px] border border-black/10 bg-black shadow-g-xl">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onClick={toggle}
        />

        {/* play overlay (before first play) */}
        {!started && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-black/55 via-black/10 to-black/25 text-white"
          >
            <span className="flex h-[78px] w-[78px] items-center justify-center rounded-full shadow-g-lg transition-transform group-hover:scale-105" style={{ background: accent }}>
              <Play size={32} fill="white" strokeWidth={0} className="ml-1" />
            </span>
            <span className="rounded-full bg-black/45 px-4 py-1.5 text-[13px] font-semibold backdrop-blur-sm">{label}</span>
          </button>
        )}

        {/* control bar */}
        <div className={`absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 transition-opacity ${started ? "opacity-100" : "opacity-0"}`}>
          <button onClick={toggle} className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={17} fill="white" strokeWidth={0} /> : <Play size={17} fill="white" strokeWidth={0} className="ml-0.5" />}
          </button>
          <span className="font-mono text-[12px] text-white/90 tabular-nums">{fmt(cur)}</span>
          {/* scrub track */}
          <div onClick={scrub} className="relative h-[6px] flex-1 cursor-pointer rounded-full bg-white/25">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${frac * 100}%`, background: accent }} />
            {/* chapter ticks */}
            {chapters.map((c, i) => (
              <span key={i} className="absolute top-1/2 h-[10px] w-[2px] -translate-y-1/2 rounded-full bg-white/60" style={{ left: `${c.at * 100}%` }} />
            ))}
          </div>
          <span className="font-mono text-[12px] text-white/70 tabular-nums">{fmt(dur)}</span>
          <button onClick={restart} className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25" aria-label="Restart"><RotateCcw size={15} /></button>
          <button onClick={toggleMute} className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25" aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* chapters + live caption */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chapters.map((c, i) => {
          const active = i === activeIdx && started;
          return (
            <button
              key={i}
              onClick={() => seekToChapter(c)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${active ? "text-white" : "border-hair bg-white text-fg2 hover:border-leaf"}`}
              style={active ? { background: accent, borderColor: accent } : undefined}
            >
              <span className="font-mono text-[11px] opacity-70">{String(i + 1).padStart(2, "0")}</span> {c.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[1.5em] text-[14.5px] leading-[1.55] text-fg2">{chapters[activeIdx]?.caption}</p>
    </div>
  );
}
