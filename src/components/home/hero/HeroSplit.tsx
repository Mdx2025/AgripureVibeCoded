"use client";

import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { money } from "@/lib/pricing";

/** Hero 2 — bold split: deep-forest copy panel with proof, motion video on the other half. */
export default function HeroSplit({ floor }: { floor: number }) {
  return (
    <section className="grid min-h-[calc(100vh-74px)] overflow-hidden lg:grid-cols-2">
      {/* copy panel */}
      <div className="relative order-2 flex items-center overflow-hidden bg-[linear-gradient(160deg,#0c1c10_0%,#1f3318_100%)] px-6 py-16 text-white sm:px-10 lg:order-1">
        <div className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-leaf/25 blur-3xl" />
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#BFE89A]">The complete crop program</div>
          <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] font-black leading-[0.96] tracking-[-0.025em]">
            Healthier crops. Bigger yields. Zero chemicals.
          </h1>
          <p className="mt-5 max-w-[460px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-[#D7E5CC]">
            One natural, custom-formulated program — seven products tuned to your soil and crop, fed through your
            existing irrigation from soil prep to harvest.
          </p>

          <ul className="mt-6 flex flex-col gap-2.5">
            {["Builds pest & disease resistance before it strikes", "Recovers yield lost to nature every season", "100% natural — qualifies your crop as organic"].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px] text-[#EAF1E3]">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-leaf text-white"><Check size={12} strokeWidth={3} /></span>{t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <Link href="/how-it-works" className="btn-ghost-dark px-7 py-[15px] text-[16px]">How it works</Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#C9DBC0]">
            <span className="inline-flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} className="fill-[#BFE89A] text-[#BFE89A]" />)}
              <span className="ml-1 font-semibold text-white">4.9</span> · 1,400+ operations
            </span>
            <span>from <span className="font-display text-[16px] font-extrabold text-white">{money(floor)}</span>/acre at volume</span>
          </div>
        </div>
      </div>

      {/* media panel */}
      <div className="relative order-1 min-h-[42vh] lg:order-2 lg:min-h-0">
        <video src="/hero/hero.mp4" className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.15),rgba(6,16,8,.1))]" />
        {/* feather the seam toward the copy panel on desktop */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 lg:block" style={{ background: "linear-gradient(90deg, #14271a 0%, rgba(20,39,26,0) 100%)" }} />
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
        </div>
      </div>
    </section>
  );
}
