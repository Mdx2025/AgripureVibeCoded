"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Single-screen drone-shot hero. Just the looping aerial footage + headline,
 * occupying the first viewport. No scroll-driven 7-step sequence.
 */
export default function HeroDrone() {
  const [failed, setFailed] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[linear-gradient(#0c1c10,#1f3318)]">
      {!failed && (
        <video
          src="/hero/hero.mp4"
          className="absolute inset-0 block h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
        />
      )}

      {/* cinematic scrims for legibility */}
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_40px_rgba(6,16,8,.55)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.35)_0%,rgba(6,16,8,.1)_30%,rgba(6,16,8,.45)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[220px] bg-[linear-gradient(0deg,rgba(6,16,8,.7),rgba(6,16,8,0))]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[120px] bg-[linear-gradient(180deg,rgba(6,16,8,.4),rgba(6,16,8,0))]" />

      {/* intro overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
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

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-[26px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px]">
        <div className="inline-flex animate-bouncey items-center gap-[9px] rounded-full border border-white/20 bg-[rgba(6,16,8,.5)] px-[18px] py-[9px] backdrop-blur-[8px]">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-white">Scroll</span>
          <ChevronDown size={16} className="text-[#BFE89A]" />
        </div>
      </div>
    </section>
  );
}
