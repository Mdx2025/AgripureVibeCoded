"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { money } from "@/lib/pricing";

/** Hero 1 — Cinematic authority: full-bleed field film, bold sales headline,
 * dual CTAs, and a trust/stat bar. */
export default function HeroCinematic({ floor }: { floor: number }) {
  return (
    <section className="relative flex min-h-[calc(100vh-74px)] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(#0c1c10,#1f3318)] px-6 text-center">
      <video src="/hero/hero.mp4" className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
      {/* legibility scrims */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.5)_0%,rgba(6,16,8,.25)_35%,rgba(6,16,8,.7)_100%)]" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_240px_50px_rgba(6,16,8,.6)]" />

      <div className="relative z-10 mx-auto max-w-[920px] py-20">
        <div className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#BFE89A] [text-shadow:0_2px_16px_rgba(0,0,0,.7)]">
          100% Natural · Custom-Formulated · One Program
        </div>
        <h1 className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(40px,7.5vw,84px)] font-black leading-[0.98] tracking-[-0.025em] text-white [text-shadow:0_6px_40px_rgba(0,0,0,.6)]">
          Stop losing your harvest to pests, weeds &amp; disease.
        </h1>
        <p className="mx-auto mt-6 max-w-[600px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#EAF1E3] [text-shadow:0_2px_16px_rgba(0,0,0,.7)]">
          AgriPure is a complete, all-natural crop program — custom-formulated to your soil and fed straight through
          your irrigation, from soil prep to harvest.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/order-now" className="btn-leaf px-8 py-[16px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
          <Link href="/how-it-works" className="btn-ghost-dark px-7 py-[16px] text-[16px]">See how it works</Link>
        </div>

        {/* trust bar */}
        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {["1,400+ operations served", "Up to 40% crop loss recovered", "Organic-eligible · copper-free", `from ${money(floor)}/acre at volume`].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(6,16,8,.42)] px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-[8px]">
              <ShieldCheck size={14} className="text-[#BFE89A]" /> {t}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-white/55">
        <ChevronDown size={24} className="animate-bounce" />
      </div>
    </section>
  );
}
