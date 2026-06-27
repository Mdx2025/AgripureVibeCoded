"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/**
 * Full-screen, step-by-step product flow.
 *
 * - The "Watch the program work" intro is its own separated band at the top.
 * - The seven steps live in NORMAL page flow (no nested scroll container) so the
 *   page never gets "trapped" and the sections after it scroll cleanly. Each step
 *   is one viewport tall, carries that product's accent gradient (like the product
 *   pages), and is a scroll-snap point with `scroll-snap-stop: always` so a single
 *   scroll gesture lands squarely on the next step and can't skip the sequence.
 * - Snapping is enabled on the document only while this flow is mounted (the home
 *   page), so other pages/sections are unaffected.
 * - A sticky rail on the left tracks the active step and jumps on click.
 */
export default function ProductFlowFullscreen({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Enable scroll-snapping for the step sequence — scoped to the page that renders
  // this flow. Proximity (not mandatory) keeps the hero/other sections free to
  // scroll; the per-step `scroll-snap-stop: always` is what forces a clean stop on
  // each step so you can't blow past the sequence.
  useEffect(() => {
    const html = document.documentElement;
    const prevType = html.style.scrollSnapType;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollSnapType = "y proximity";
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollSnapType = prevType;
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  const jump = (i: number) => sections.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-white">
      {/* ── Separated intro band ─────────────────────────────────────────── */}
      <section className="border-y border-hair bg-[radial-gradient(120%_120%_at_50%_-10%,#EAF3DD_0%,#F7F5EE_60%)] px-6 py-20 text-center sm:px-10 sm:py-24">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The seven, step by step</div>
        <h2 className="mt-3 font-display text-[clamp(32px,5.5vw,56px)] font-black tracking-[-0.02em] text-forest">
          Watch the program work
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">
          Scroll through the season — each step snaps into full screen, plays its own film, shows the product, and
          explains exactly what it does for your crop. Jump to any step on the left.
        </p>
        <div className="mt-9 flex flex-col items-center gap-1.5 text-leaf-700">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em]">Start the season</span>
          <ChevronDown size={22} strokeWidth={2.4} className="animate-bounce" />
        </div>
      </section>

      {/* ── Step sequence — one product per screen, snaps in normal page flow ── */}
      <div className="relative">
        {/* sticky rail overlay (vertically centered, pinned through the sequence) */}
        <div className="pointer-events-none sticky top-0 z-30 hidden h-0 lg:block">
          <div className="relative mx-auto max-w-[1180px] px-10">
            <ol className="pointer-events-auto absolute left-10 top-[50svh] flex -translate-y-1/2 flex-col gap-1">
              {products.map((p, i) => {
                const ph = stepPhaseFor(p.id);
                const on = i === active;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => jump(i)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${on ? "bg-white/70 backdrop-blur-sm" : "hover:bg-white/50"}`}
                    >
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-display text-[14px] font-black transition-colors" style={{ background: on ? p.accent : "#E4E1D5", color: on ? "#fff" : "#7A8076" }}>{i + 1}</span>
                      <span className="min-w-0">
                        <span className={`block font-display text-[15px] font-extrabold ${on ? "text-forest" : "text-fg3"}`}>{p.name}</span>
                        <span className="block truncate text-[11.5px] text-fg3">{ph.phase}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {products.map((p, i) => {
          const phase = stepPhaseFor(p.id);
          return (
            <section
              key={p.id}
              data-i={i}
              ref={(el) => { sections.current[i] = el; }}
              className="flex min-h-[100svh] snap-start flex-col justify-center [scroll-snap-stop:always]"
              style={{ background: `linear-gradient(180deg, ${p.accentSoft} 0%, #FFFFFF 94%)` }}
            >
              <div className="mx-auto flex w-full max-w-[1180px] flex-col justify-center px-6 pb-6 pt-[84px] sm:px-10 lg:pl-[230px]">
                {/* heading (centered) */}
                <div className="mx-auto max-w-[820px] text-center">
                  <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: p.accent }}>
                    Step {i + 1} of 7 · {phase.phase}
                  </div>
                  <h2 className="mt-4 font-display text-[clamp(32px,5vw,54px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h2>
                  <div className="mt-1 text-[clamp(16px,2vw,20px)] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                  <p className="mx-auto mt-3.5 max-w-[640px] text-[clamp(16px,2.1vw,21px)] font-semibold leading-[1.4] text-forest">{getSales(p.id).hook}</p>
                </div>

                {/* media: square video + carboy matched to it (height-capped to fit one screen) */}
                <div className="mx-auto mt-6 grid w-full max-w-[940px] items-stretch gap-5 lg:h-[38svh] lg:grid-cols-[1.6fr_1fr]">
                  {/* video — square on mobile, fills the capped row on desktop */}
                  <div className="min-w-0 lg:h-full">
                    <div className="relative aspect-square h-full w-full overflow-hidden rounded-[24px] border bg-black/5 shadow-g-xl lg:aspect-auto" style={{ borderColor: `${p.accent}40` }}>
                      <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">{phase.when}</span>
                    </div>
                  </div>
                  {/* carboy — neutral card so the bottle pops against the tinted section */}
                  <div className="relative aspect-[4/5] min-w-0 overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8F2_100%)] lg:aspect-auto lg:h-full" style={{ borderColor: `${p.accent}40` }}>
                    <span className="absolute left-4 top-4 z-10 font-mono text-[12px] font-semibold" style={{ color: p.accent }}>No. {p.num}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bottleSrc(p.id)} alt={`${p.name} carboy with label`} className="absolute inset-0 m-auto max-h-[86%] w-auto max-w-[80%] object-contain drop-shadow-[0_24px_40px_rgba(0,40,8,.24)]" />
                  </div>
                </div>

                {/* what it does + CTA (centered) */}
                <div className="mx-auto mt-6 max-w-[760px] text-center">
                  <p className="text-[15px] leading-[1.65] text-fg2">{p.long}</p>
                  <Link href={`/products/${p.id}`} className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                    Explore {p.name} <ArrowRight size={16} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
