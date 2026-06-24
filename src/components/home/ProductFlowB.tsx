"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/** Version B — guided rail. A sticky vertical step navigator on the left tracks
 * (and jumps to) the active product as its card scrolls on the right. */
export default function ProductFlowB({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => cards.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section className="bg-paper-2 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-container">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">A guided walk-through</div>
          <h2 className="mt-3 font-display text-[clamp(30px,5vw,52px)] font-black tracking-[-0.02em] text-forest">Seven steps, one season</h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">Follow the program from soil to harvest. Jump to any step — each one shows the product in action and what it does.</p>
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-[250px_1fr] lg:gap-14">
          {/* sticky rail */}
          <nav className="hidden lg:block">
            <ol className="sticky top-[100px] flex flex-col gap-1">
              {products.map((p, i) => {
                const isActive = i === active;
                const phase = stepPhaseFor(p.id);
                return (
                  <li key={p.id}>
                    <button onClick={() => jump(i)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full font-display text-[13px] font-black transition-colors" style={{ background: isActive ? p.accent : "#E4E1D5", color: isActive ? "#fff" : "#7A8076" }}>{i + 1}</span>
                      <span className="min-w-0">
                        <span className={`block font-display text-[15px] font-extrabold ${isActive ? "text-forest" : "text-fg3"}`}>{p.name}</span>
                        <span className="block truncate text-[11.5px] text-fg3">{phase.phase}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* cards */}
          <div className="flex flex-col gap-8">
            {products.map((p, i) => {
              const s = getSales(p.id);
              const phase = stepPhaseFor(p.id);
              return (
                <div
                  key={p.id}
                  data-i={i}
                  ref={(el) => { cards.current[i] = el; }}
                  className="overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm scroll-mt-[100px]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white" style={{ background: p.accent }}>Step {i + 1} · {phase.when}</span>
                  </div>
                  <div className="p-7 sm:p-9">
                    <div className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: p.accent }}>{phase.phase}</div>
                    <h3 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-black tracking-[-0.02em] text-forest">{p.name}</h3>
                    <div className="text-[16px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                    <p className="mt-4 max-w-[640px] text-[17px] font-semibold leading-[1.45] text-forest">{s.hook}</p>
                    <p className="mt-3 max-w-[660px] text-[15.5px] leading-[1.7] text-fg2">{p.long}</p>
                    <Link href={`/products/${p.id}`} className="ap-link mt-5 inline-flex items-center gap-1.5 font-bold" style={{ color: p.accent }}>
                      Explore {p.name} <ArrowRight size={15} strokeWidth={2.4} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
