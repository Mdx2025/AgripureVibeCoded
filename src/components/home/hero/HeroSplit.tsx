"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

const STATS = [
  { n: "40%↓", t: "crop loss recovered", accent: true },
  { n: "1,400+", t: "operations served" },
  { n: "0", t: "synthetic inputs" },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Hero — elevated split: atmospheric deep-forest copy panel (glow + grain +
 * topo lines) that melts into field video on the other half, a floating glass
 * proof card crossing the seam, and a full-width trust bar. */
export default function HeroSplit() {
  const facts = [
    "1,400+ operations served",
    "Up to 40% crop loss recovered",
    "Organic-eligible · copper-free",
    "Custom-priced by crop & acreage",
  ];

  return (
    <section className="flex min-h-[calc(100vh-74px)] flex-col">
      <div className="grid flex-1 overflow-hidden lg:grid-cols-[1.05fr_1fr]">
        {/* copy panel */}
        <div
          className="relative order-2 flex items-center overflow-hidden px-6 py-16 text-white sm:px-12 lg:order-1"
          style={{ background: "radial-gradient(135% 120% at 16% 6%, #0e2a16 0%, #06180b 56%, #030f06 100%)" }}
        >
          {/* soft glows */}
          <div
            className="pointer-events-none absolute -left-28 top-1/4 h-[520px] w-[520px] rounded-full opacity-40 blur-[90px]"
            style={{ background: "radial-gradient(circle,#6FAE52 0%,transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-25 blur-[80px]"
            style={{ background: "radial-gradient(circle,#BFE89A 0%,transparent 70%)" }}
          />
          {/* topo contour lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
            preserveAspectRatio="none"
            viewBox="0 0 600 600"
            fill="none"
            stroke="#BFE89A"
            strokeWidth="1.1"
          >
            <path d="M-20 120 C 140 60, 320 200, 640 110" />
            <path d="M-20 200 C 160 150, 340 280, 640 190" />
            <path d="M-20 300 C 150 250, 360 380, 640 290" />
            <path d="M-20 400 C 170 350, 330 470, 640 390" />
            <path d="M-20 500 C 150 450, 360 560, 640 480" />
          </svg>
          {/* grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: GRAIN, mixBlendMode: "overlay" }}
          />

          <div className="relative mx-auto w-full max-w-[580px] animate-rise lg:ml-auto lg:mr-12">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#BFE89A]/70" />
              <span className="font-mono text-[12px] uppercase tracking-[0.26em] text-[#BFE89A]">100% Natural · Custom-Formulated</span>
            </div>
            <h1 className="mt-5 font-display text-[clamp(44px,5.4vw,76px)] font-black leading-[0.94] tracking-[-0.03em]">
              <span className="bg-[linear-gradient(92deg,#BFE89A_0%,#8BC06F_60%,#6FAE52_100%)] bg-clip-text text-transparent">Natural</span> Pesticides
              <br />&amp; Nutrients
            </h1>
            <p className="mt-6 max-w-[490px] text-[clamp(16px,1.4vw,19px)] leading-[1.62] text-[#D7E5CC]">
              Stop losing your harvest to pests, weeds &amp; disease. One complete, all-natural program — custom-formulated
              to your soil and fed straight through your irrigation, soil prep to harvest.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px] shadow-g-xl">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
              <Link href="/how-it-works" className="btn-ghost-dark px-7 py-[15px] text-[16px]">Our process</Link>
            </div>

            {/* stat row — hairline-divided, big numbers, no boxes */}
            <div className="mt-11 flex items-stretch gap-6">
              {STATS.map(({ n, t, accent }, i) => (
                <div key={t} className="flex items-stretch gap-6">
                  {i > 0 && <div className="w-px self-stretch bg-white/12" />}
                  <div>
                    <div
                      className={
                        "font-display text-[clamp(28px,3vw,34px)] font-black leading-none " +
                        (accent ? "bg-[linear-gradient(92deg,#BFE89A,#6FAE52)] bg-clip-text text-transparent" : "text-white")
                      }
                    >
                      {n}
                    </div>
                    <div className="mt-1.5 text-[13px] font-semibold text-white/65">{t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* media panel */}
        <div className="relative order-1 min-h-[44vh] lg:order-2 lg:min-h-0">
          <video src="/hero/hero.mp4" className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
          {/* left-edge melt scrim — kills the hard 50/50 seam (desktop only) */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: "linear-gradient(to right,#031007 0%,rgba(3,16,7,0.55) 16%,rgba(3,16,7,0) 44%)" }}
          />
          {/* vertical scrim for legibility */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg,rgba(6,16,8,.20),rgba(6,16,8,.05) 30%,rgba(6,16,8,.35))" }}
          />

          <div className="absolute right-5 top-6 flex items-center gap-2 rounded-full bg-black/35 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
          </div>

          {/* floating glass proof card crossing the seam (desktop) */}
          <div className="absolute bottom-16 left-[-46px] hidden w-[230px] rounded-card border border-white/20 bg-white/10 p-4 shadow-g-xl backdrop-blur-xl lg:block">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf/30 text-[#BFE89A]"><Check size={15} strokeWidth={3} /></span>
              <span className="text-[12px] font-bold uppercase tracking-wide text-white/80">Verified field result</span>
            </div>
            <div className="mt-2.5 font-display text-[40px] font-black leading-none text-white">+38%</div>
            <div className="text-[13px] font-semibold text-white/70">avg yield recovery</div>
            <div className="mt-3 flex h-7 items-end gap-1">
              <span className="w-full rounded-sm bg-white/20" style={{ height: "35%" }} />
              <span className="w-full rounded-sm bg-white/30" style={{ height: "55%" }} />
              <span className="w-full rounded-sm bg-leaf/60" style={{ height: "70%" }} />
              <span className="w-full rounded-sm bg-leaf/80" style={{ height: "88%" }} />
              <span className="w-full rounded-sm bg-[#BFE89A]" style={{ height: "100%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* full-width trust bar */}
      <div className="border-t border-white/10 px-6 py-4 sm:px-10" style={{ background: "#06180b" }}>
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
          {facts.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/85">
              {i > 0 && <span className="mr-5 h-1 w-1 rounded-full bg-[#BFE89A]/50" />}
              <ShieldCheck size={14} className="text-[#BFE89A]" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
