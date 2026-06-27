"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/**
 * Full-screen, step-by-step product flow: each of the seven gets its own
 * viewport-height section with the explainer video and the carboy (label
 * shown) to its right, plus the step's explanation. The in-view video plays.
 */
export default function ProductFlowFullscreen({ products }: { products: ProductRow[] }) {
  return (
    <div>
      {/* intro */}
      <section className="px-6 pb-6 pt-16 text-center sm:px-10">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The seven, step by step</div>
        <h2 className="mt-3 font-display text-[clamp(30px,5vw,52px)] font-black tracking-[-0.02em] text-forest">Watch the program work</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">
          Scroll through the season. Each step plays its own film, shows the product, and explains exactly what it does
          for your crop.
        </p>
      </section>

      {products.map((p, i) => {
        const s = getSales(p.id);
        const phase = stepPhaseFor(p.id);
        return (
          <section key={p.id} className={`flex min-h-[calc(100vh-74px)] flex-col justify-center px-6 py-16 sm:px-10 ${i % 2 ? "bg-paper-2" : "bg-white"}`}>
            <div className="mx-auto w-full min-w-0 max-w-container">
              {/* heading */}
              <div className="mx-auto max-w-[860px] text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: p.accent }}>
                  Step {i + 1} of 7 · {phase.phase}
                </div>
                <h2 className="mt-4 font-display text-[clamp(34px,5.5vw,60px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h2>
                <div className="mt-1 text-[clamp(16px,2vw,20px)] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                <p className="mx-auto mt-4 max-w-[660px] text-[clamp(17px,2.2vw,22px)] font-semibold leading-[1.4] text-forest">{s.hook}</p>
              </div>

              {/* media: video + carboy to the right */}
              <div className="mt-9 grid items-stretch gap-5 lg:h-[clamp(340px,58vh,560px)] lg:grid-cols-[1.7fr_1fr]">
                <div className="relative aspect-video min-w-0 overflow-hidden rounded-[24px] border shadow-g-xl lg:aspect-auto lg:h-full" style={{ borderColor: `${p.accent}40` }}>
                  <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">{phase.when}</span>
                </div>
                <div className="relative flex aspect-[4/5] min-w-0 items-center justify-center overflow-hidden rounded-[24px] border lg:aspect-auto lg:h-full" style={{ borderColor: `${p.accent}40`, background: `radial-gradient(circle at 50% 62%, ${p.accentSoft} 0%, #FAF8F2 78%)` }}>
                  <span className="absolute left-4 top-4 font-mono text-[12px] font-semibold" style={{ color: p.accent }}>No. {p.num}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bottleSrc(p.id)} alt={`${p.name} carboy with label`} className="max-h-[82%] w-auto max-w-[78%] object-contain py-6 drop-shadow-[0_24px_40px_rgba(0,40,8,.24)]" />
                </div>
              </div>

              {/* what it does + CTA */}
              <div className="mx-auto mt-7 max-w-[820px] text-center">
                <p className="text-[16px] leading-[1.7] text-fg2">{p.long}</p>
                <Link href={`/products/${p.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                  Explore {p.name} <ArrowRight size={16} strokeWidth={2.4} />
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
