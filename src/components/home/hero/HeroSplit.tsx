"use client";

import Link from "next/link";
import { ArrowRight, Sprout, TrendingUp, Ban, ShieldCheck } from "lucide-react";
import { money } from "@/lib/pricing";

const POINTS = [
  { Icon: Sprout, t: "Healthier crops" },
  { Icon: TrendingUp, t: "Bigger yields" },
  { Icon: Ban, t: "Zero chemicals" },
];

/** Hero 2 — bold split: deep-forest copy panel with proof points, motion video
 * on the other half, and a full-width trust bar across the bottom. */
export default function HeroSplit({ floor }: { floor: number }) {
  const facts = [
    "1,400+ operations served",
    "Up to 40% crop loss recovered",
    "Organic-eligible · copper-free",
    `from ${money(floor)}/acre at volume`,
  ];

  return (
    <section className="flex min-h-[calc(100vh-74px)] flex-col">
      <div className="grid flex-1 overflow-hidden lg:grid-cols-2">
        {/* copy panel */}
        <div className="relative order-2 flex items-center overflow-hidden bg-[linear-gradient(160deg,#0c1c10_0%,#1f3318_100%)] px-6 py-16 text-white sm:px-10 lg:order-1">
          <div className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-leaf/25 blur-3xl" />
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-10">
            <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#BFE89A]">100% Natural · Custom-Formulated</div>
            <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] font-black leading-[0.96] tracking-[-0.025em]">
              Natural Pesticides and Nutrients
            </h1>
            <p className="mt-5 max-w-[480px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-[#D7E5CC]">
              Stop losing your harvest to pests, weeds &amp; disease. One complete, all-natural program — custom-formulated
              to your soil and fed straight through your irrigation, soil prep to harvest.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
              <Link href="/how-it-works" className="btn-ghost-dark px-7 py-[15px] text-[16px]">How it works</Link>
            </div>

            {/* proof points */}
            <div className="mt-9 grid grid-cols-3 gap-3">
              {POINTS.map(({ Icon, t }) => (
                <div key={t} className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.06] px-3 py-5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf/20 text-[#BFE89A]"><Icon size={22} /></span>
                  <span className="font-display text-[14px] font-extrabold leading-tight text-white">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* media panel */}
        <div className="relative order-1 min-h-[42vh] lg:order-2 lg:min-h-0">
          <video src="/hero/hero.mp4" className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.15),rgba(6,16,8,.1))]" />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
          </div>
        </div>
      </div>

      {/* full-width trust bar */}
      <div className="border-t border-white/10 bg-[#0c1c10] px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
          {facts.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-[13px] font-semibold text-white">
              <ShieldCheck size={14} className="text-[#BFE89A]" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
