"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor, hasRealVideo } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/** Version A — pinned media. The video stays fixed while the seven steps scroll
 * past it; the active step's clip swaps in. Apple-store style. */
export default function ProductFlowA({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    blocks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = products[active];
  const curPhase = stepPhaseFor(cur.id);

  return (
    <section className="bg-white px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-container">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The seven, step by step</div>
          <h2 className="mt-3 font-display text-[clamp(30px,5vw,52px)] font-black tracking-[-0.02em] text-forest">Watch the program work</h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">Scroll through the season. Each step plays its own film and explains exactly what that product does for your crop.</p>
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-2 lg:gap-16">
          {/* sticky media */}
          <div className="hidden lg:block">
            <div className="sticky top-[96px]">
              <div className="relative aspect-video overflow-hidden rounded-[24px] border shadow-g-xl" style={{ borderColor: `${cur.accent}40` }}>
                <StepVideo key={cur.id} src={productVideoFor(cur.id)} poster={productPosterFor(cur.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/65 to-transparent p-5">
                  <div>
                    <div className="font-mono text-[12px] text-white/75">Step {active + 1} of 7 · {curPhase.phase}</div>
                    <div className="font-display text-[26px] font-extrabold text-white">{cur.name}</div>
                  </div>
                  {!hasRealVideo(cur.id) && <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">Placeholder</span>}
                </div>
              </div>
              {/* progress dots */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {products.map((p, i) => (
                  <span key={p.id} className="h-2 rounded-full transition-all" style={{ width: i === active ? 28 : 8, background: i === active ? cur.accent : "#D9D6C7" }} />
                ))}
              </div>
            </div>
          </div>

          {/* steps */}
          <div className="flex flex-col">
            {products.map((p, i) => {
              const s = getSales(p.id);
              const phase = stepPhaseFor(p.id);
              return (
                <div
                  key={p.id}
                  data-i={i}
                  ref={(el) => { blocks.current[i] = el; }}
                  className="flex min-h-[80vh] flex-col justify-center border-t border-hair py-12 first:border-t-0 lg:min-h-[88vh]"
                >
                  {/* inline video on mobile */}
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-[20px] border lg:hidden" style={{ borderColor: `${p.accent}40` }}>
                    <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full font-display text-[18px] font-black text-white" style={{ background: p.accent }}>{i + 1}</span>
                    <div>
                      <div className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: p.accent }}>{phase.phase}</div>
                      <div className="font-mono text-[12px] text-fg3">{phase.when}</div>
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h3>
                  <div className="mt-1 text-[18px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                  <p className="mt-4 max-w-[520px] text-[19px] font-semibold leading-[1.45] text-forest">{s.hook}</p>
                  <p className="mt-3 max-w-[540px] text-[16px] leading-[1.7] text-fg2">{p.long}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <Link href={`/products/${p.id}`} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                      Explore {p.name} <ArrowRight size={15} strokeWidth={2.4} />
                    </Link>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bottleSrc(p.id)} alt="" className="h-12 w-auto object-contain" />
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
