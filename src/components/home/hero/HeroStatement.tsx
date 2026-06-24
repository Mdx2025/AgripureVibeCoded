"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";

/** Hero 3 — bold statement: huge type, the seven-bottle lineup, and animated
 * count-up proof stats on a deep-forest stage. */
export default function HeroStatement({ products, floor }: { products: ProductRow[]; floor: number }) {
  const stats = [
    { prefix: "Up to ", target: 40, suffix: "%", label: "crop loss recovered" },
    { prefix: "", target: 7, suffix: "-in-1", label: "complete program" },
    { prefix: "", target: 100, suffix: "%", label: "natural · organic-eligible" },
    { prefix: "from $", target: floor, suffix: "/ac", label: "at volume" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<number[]>(stats.map(() => 0));
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
            const e = 1 - Math.pow(1 - p, 3);
            setVals(stats.map((s) => Math.round(s.target * e)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-74px)] flex-col items-center justify-center overflow-hidden bg-[#06160c] px-6 py-16 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_-10%,rgba(111,174,82,.32)_0%,rgba(6,22,12,0)_60%)]" />
      <div className="relative z-10 mx-auto max-w-container">
        <div className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#BFE89A]">Seven products · one program · soil to harvest</div>
        <h1 className="mx-auto mt-5 max-w-[14ch] font-display text-[clamp(44px,9vw,104px)] font-black leading-[0.9] tracking-[-0.03em]">
          Grow more. Spray less. Naturally.
        </h1>
        <p className="mx-auto mt-6 max-w-[600px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#D7E5CC]">
          A complete, all-natural crop program — custom-formulated to your soil and fed through your irrigation.
        </p>

        {/* lineup */}
        <div className="mt-10 flex flex-wrap items-end justify-center gap-x-2 gap-y-4 sm:gap-x-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bottleSrc(p.id)} alt={p.name} className="h-[clamp(78px,11vw,132px)] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,.5)] transition-transform duration-300 group-hover:-translate-y-1.5" />
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/order-now" className="btn-leaf px-8 py-[16px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
          <Link href="/how-it-works" className="btn-ghost-dark px-7 py-[16px] text-[16px]">See how it works</Link>
        </div>

        {/* count-up proof */}
        <div ref={ref} className="mx-auto mt-12 grid max-w-[820px] grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label}>
              <div className="font-display text-[clamp(28px,4vw,42px)] font-black tracking-[-0.02em] tabular-nums text-[#BFE89A]">{s.prefix}{vals[i]}{s.suffix}</div>
              <div className="mx-auto mt-1 max-w-[160px] text-[12.5px] leading-[1.45] text-[#C9DBC0]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
