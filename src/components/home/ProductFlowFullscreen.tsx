"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/**
 * Full-screen, step-by-step product flow. Each of the seven gets a viewport-
 * height section with centered copy, a landscape (16:9) explainer video, and
 * the carboy (label shown) to its right. A sticky step rail on the left stays
 * vertically centered, tracks the active step, and jumps to any step on click.
 */
export default function ProductFlowFullscreen({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => sections.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="bg-white">
      {/* intro */}
      <section className="px-6 pb-4 pt-16 text-center sm:px-10">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The seven, step by step</div>
        <h2 className="mt-3 font-display text-[clamp(30px,5vw,52px)] font-black tracking-[-0.02em] text-forest">Watch the program work</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">
          Scroll through the season — or jump to any step on the left. Each one plays its own film, shows the product,
          and explains exactly what it does for your crop.
        </p>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-10 xl:gap-14">
          {/* sticky step rail — stays vertically centered */}
          <nav className="hidden lg:block">
            <ol className="sticky top-[50vh] flex -translate-y-1/2 flex-col gap-1">
              {products.map((p, i) => {
                const ph = stepPhaseFor(p.id);
                const on = i === active;
                return (
                  <li key={p.id}>
                    <button onClick={() => jump(i)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-paper-2">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-display text-[14px] font-black transition-colors" style={{ background: on ? p.accent : "#E4E1D5", color: on ? "#fff" : "#7A8076" }}>{i + 1}</span>
                      <span className="min-w-0">
                        <span className={`block font-display text-[15px] font-extrabold ${on ? "text-forest" : "text-fg3"}`}>{p.name}</span>
                        <span className="block truncate text-[11.5px] text-fg3">{ph.phase}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* steps */}
          <div>
            {products.map((p, i) => {
              const s = getSales(p.id);
              const phase = stepPhaseFor(p.id);
              return (
                <section
                  key={p.id}
                  data-i={i}
                  ref={(el) => { sections.current[i] = el; }}
                  className="flex min-h-[calc(100vh-74px)] flex-col justify-center border-t border-hair py-14 first:border-t-0 lg:first:pt-6"
                >
                  {/* heading (centered) */}
                  <div className="mx-auto max-w-[820px] text-center">
                    <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: p.accent }}>
                      Step {i + 1} of 7 · {phase.phase}
                    </div>
                    <h2 className="mt-4 font-display text-[clamp(34px,5.5vw,58px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h2>
                    <div className="mt-1 text-[clamp(16px,2vw,20px)] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                    <p className="mx-auto mt-4 max-w-[640px] text-[clamp(17px,2.2vw,22px)] font-semibold leading-[1.4] text-forest">{s.hook}</p>
                  </div>

                  {/* media: 16:9 video (drives the row height) + carboy matched to it */}
                  <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[1.7fr_1fr]">
                    {/* video — always 16:9 */}
                    <div className="min-w-0">
                      <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border shadow-g-xl" style={{ borderColor: `${p.accent}40` }}>
                        <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                        <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm">{phase.when}</span>
                      </div>
                    </div>
                    {/* carboy — matches the video's height (img is absolute so it never drives height) */}
                    <div className="relative aspect-[4/5] min-w-0 overflow-hidden rounded-[24px] border lg:aspect-auto lg:h-full" style={{ borderColor: `${p.accent}40`, background: `radial-gradient(circle at 50% 62%, ${p.accentSoft} 0%, #FAF8F2 78%)` }}>
                      <span className="absolute left-4 top-4 z-10 font-mono text-[12px] font-semibold" style={{ color: p.accent }}>No. {p.num}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={bottleSrc(p.id)} alt={`${p.name} carboy with label`} className="absolute inset-0 m-auto max-h-[86%] w-auto max-w-[80%] object-contain drop-shadow-[0_24px_40px_rgba(0,40,8,.24)]" />
                    </div>
                  </div>

                  {/* what it does + CTA (centered) */}
                  <div className="mx-auto mt-7 max-w-[820px] text-center">
                    <p className="text-[16px] leading-[1.7] text-fg2">{p.long}</p>
                    <Link href={`/products/${p.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                      Explore {p.name} <ArrowRight size={16} strokeWidth={2.4} />
                    </Link>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
