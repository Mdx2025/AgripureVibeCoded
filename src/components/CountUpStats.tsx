"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { prefix: "Up to ", target: 40, suffix: "%", label: "of the world's crops are lost to pests, weeds & disease every year¹" },
  { prefix: "", target: 7, suffix: "-in-1", label: "complete crop program — soil to harvest, one supplier" },
  { prefix: "", target: 100, suffix: "% natural", label: "no synthetic chemicals, no residue, organic-eligible" },
  { prefix: "", target: 0, suffix: "", label: "extra equipment — runs through your existing irrigation" },
];

export default function CountUpStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<number[]>(STATS.map(() => 0));
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const dur = 1300;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setVals(STATS.map((s) => Math.round(s.target * e)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto grid max-w-container gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label}>
          <div className="font-display text-[clamp(34px,5vw,48px)] font-black tracking-[-0.02em] text-forest tabular-nums">
            {s.prefix}{vals[i]}{s.suffix}
          </div>
          <div className="mx-auto mt-1.5 max-w-[230px] text-[14px] leading-[1.5] text-fg2">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
