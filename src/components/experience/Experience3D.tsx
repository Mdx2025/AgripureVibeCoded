"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { EXPERIENCE_STEPS } from "@/lib/experience-steps";
import { bottleSrc } from "@/lib/products";

export default function Experience3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(-1);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const intro = introRef.current;
    const panel = panelRef.current;
    const cue = cueRef.current;
    if (!section || !canvas || !intro || !panel || !cue) return;

    // Respect reduced-motion: skip the WebGL scene entirely.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setIdx(0);
      return;
    }

    let dispose: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      // Real drone footage is the primary hero. The <video> renders its src in
      // JSX (reliable load + autoplay); if it errors we fall back to WebGL.
      const video = videoRef.current;
      if (video && !videoFailed) {
        // Optional /public/hero/hero.json → { "mode": "loop" | "scrub" }.
        let mode: "loop" | "scrub" = "loop";
        try {
          const res = await fetch("/hero/hero.json", { cache: "no-store" });
          if (res.ok) { const j = await res.json(); if (j?.mode === "scrub") mode = "scrub"; }
        } catch { /* default loop */ }
        if (cancelled) return;
        video.addEventListener("error", () => setVideoFailed(true), { once: true });
        const { createVideoHero } = await import("./videoHero");
        if (cancelled) return;
        dispose = createVideoHero({ video, canvas, section, intro, panel, cue, onIdx: (i) => setIdx(i), mode });
        return;
      }

      const [THREE, { createScene }] = await Promise.all([import("three"), import("./scene")]);
      if (cancelled) return;
      dispose = createScene({ THREE, canvas, section, intro, panel, cue, onIdx: (i) => setIdx(i) });
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [videoFailed]);

  const cur = idx >= 0 ? EXPERIENCE_STEPS[idx] : null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0c1c10]"
      style={{ height: "880vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[linear-gradient(#aacbe0,#dfe7cf)]">
        {!videoFailed && (
          <video
            ref={videoRef}
            src="/hero/hero.mp4"
            className="absolute inset-0 block h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block h-full w-full" />

        {/* cinematic scrims for legibility */}
        <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_40px_rgba(6,16,8,.55)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,8,.62)_0%,rgba(6,16,8,.2)_32%,rgba(6,16,8,0)_54%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[200px] bg-[linear-gradient(0deg,rgba(6,16,8,.6),rgba(6,16,8,0))]" />
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[120px] bg-[linear-gradient(180deg,rgba(6,16,8,.4),rgba(6,16,8,0))]" />

        {/* intro overlay */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ease-smooth"
        >
          <div className="font-mono text-[13px] uppercase tracking-[0.32em] text-[#BFE89A] [text-shadow:0_2px_16px_rgba(0,0,0,.7)]">
            Nano Technology
          </div>
          <h1 className="mt-[18px] max-w-[14ch] font-display text-[clamp(40px,7vw,76px)] font-black leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_6px_34px_rgba(0,0,0,.6)]">
            Natural Pesticides and Nutrients
          </h1>
          <p className="mt-[22px] max-w-[520px] text-[19px] leading-[1.6] text-[#EAF1E3] [text-shadow:0_2px_16px_rgba(0,0,0,.7)]">
            We utilize potentized nano particles to provide a seed&#8209;to&#8209;finish natural
            pesticide and nutrient solution for crops.
          </p>
          <div className="mt-[26px] inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[rgba(6,16,8,.42)] px-5 py-[11px] backdrop-blur-[8px]">
            <span className="h-2 w-2 rounded-full bg-leaf shadow-[0_0_12px_#6FAE52]" />
            <span className="text-sm font-semibold text-white">
              &ldquo;The Best Crop Insurance You Can Buy&rdquo;
            </span>
          </div>
        </div>

        {/* product panel (frosted) — always mounted, opacity driven by the scene */}
        <div
          ref={panelRef}
          className="pointer-events-none absolute left-[5.5%] top-1/2 w-[400px] max-w-[84vw] -translate-y-1/2 opacity-0"
        >
          {cur && (
            <div className="rounded-[22px] border border-white/[0.16] bg-[rgba(7,18,9,.62)] p-[30px] shadow-[0_24px_60px_rgba(0,0,0,.4)] backdrop-blur-[14px]">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs tracking-[0.18em]" style={{ color: cur.accent }}>
                  STEP {cur.step} / 7
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={bottleSrc(cur.id)}
                    alt={cur.name}
                    width={24}
                    height={34}
                    className="h-[34px] w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,.5)]"
                  />
                  <span className="font-mono text-[11px] tracking-[0.06em] text-[#9FC08A]">
                    {cur.name}
                  </span>
                </div>
              </div>
              <h2 className="mt-4 font-display text-[38px] font-black leading-[1.05] tracking-[-0.02em] text-white">
                {cur.title}
              </h2>
              <p className="mt-3.5 text-[16px] leading-[1.62] text-[#E6EEDF]">{cur.desc}</p>
              <div className="mt-5 inline-flex items-center gap-[9px] rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: cur.tcolor, boxShadow: `0 0 10px ${cur.tcolor}` }}
                />
                <span className="font-mono text-[11.5px] tracking-[0.05em] text-[#EAF1E3]">
                  {cur.action}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* progress rail */}
        <div className="pointer-events-none absolute right-[30px] top-1/2 flex -translate-y-1/2 flex-col gap-[11px]">
          {EXPERIENCE_STEPS.map((s, i) => {
            const active = i === idx;
            return (
              <div
                key={s.id}
                className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10.5px] transition-all duration-300"
                style={
                  active
                    ? { background: "#6FAE52", color: "#04230B", fontWeight: 700, transform: "scale(1.15)", boxShadow: "0 0 14px rgba(111,174,82,.7)" }
                    : { background: "rgba(7,18,9,.4)", color: "#cfe3c2", border: "1px solid rgba(255,255,255,.25)" }
                }
              >
                {s.step}
              </div>
            );
          })}
        </div>

        {/* scroll cue */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute bottom-[26px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px]"
        >
          <div className="inline-flex animate-bouncey items-center gap-[9px] rounded-full border border-white/20 bg-[rgba(6,16,8,.5)] px-[18px] py-[9px] backdrop-blur-[8px]">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-white">Scroll</span>
            <ChevronDown size={16} className="text-[#BFE89A]" />
          </div>
        </div>
      </div>
    </section>
  );
}
