"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";
import { BundleCards, type ShopBundle } from "./shop-shared";

/** Version C — "Lineup Lookbook": premium dark hero with the full lineup, then
 * each product as a large accent-tinted editorial card, then bundle pricing. */
export default function ShopExperienceC({ products, bundles, floor }: { products: ProductRow[]; bundles: ShopBundle[]; floor: number }) {
  return (
    <div className="bg-white text-forest">
      {/* HERO — dark premium lineup */}
      <section className="relative overflow-hidden bg-[#06160c] px-6 py-20 text-center text-white sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_-10%,rgba(111,174,82,.32)_0%,rgba(6,22,12,0)_60%)]" />
        <div className="relative mx-auto max-w-container">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFE89A]">The AgriPure line</div>
          <h1 className="mx-auto mt-4 max-w-[820px] font-display text-[clamp(40px,7vw,78px)] font-black leading-[0.95] tracking-[-0.02em]">
            Seven products. One complete program.
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-[#D7E5CC]">
            Custom-formulated to your crop and soil, sold as one bundle, fed through your irrigation from soil prep to harvest.
          </p>

          {/* lineup */}
          <div className="mt-12 flex flex-wrap items-end justify-center gap-x-3 gap-y-8 sm:gap-x-6">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="h-[clamp(120px,15vw,180px)] w-auto object-contain drop-shadow-[0_22px_34px_rgba(0,0,0,.5)] transition-transform duration-300 group-hover:-translate-y-1.5" />
                <span className="mt-2 font-mono text-[10px] text-[#7FA06C]">{p.num}</span>
                <span className="font-display text-[13px] font-extrabold text-white">{p.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <a href="#pricing" className="btn-ghost-dark px-7 py-[15px] text-[16px]">See bundle pricing</a>
          </div>
          <div className="mt-3 text-[14px] text-[#C9DBC0]">from <span className="font-display text-[18px] font-extrabold text-white">{money(floor)}</span>/acre at volume</div>
        </div>
      </section>

      {/* EDITORIAL CARDS — each product */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container gap-6 lg:grid-cols-2">
          {products.map((p, i) => {
            const specs = [p.npk && p.npk !== "0–0–0" ? `N-P-K ${p.npk}` : null, p.rate].filter(Boolean) as string[];
            return (
              <div key={p.id} className="overflow-hidden rounded-panel border" style={{ borderColor: `${p.accent}40`, background: `linear-gradient(135deg, ${p.accentSoft} 0%, #FFFFFF 70%)` }}>
                <div className="grid grid-cols-[120px_1fr] gap-5 p-6 sm:grid-cols-[160px_1fr] sm:p-8">
                  <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="h-[clamp(150px,20vw,210px)] w-auto object-contain drop-shadow-[0_20px_34px_rgba(0,40,8,.24)]" />
                  </div>
                  <div className="min-w-0 self-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-semibold" style={{ color: p.accent }}>No. {p.num}</span>
                      <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-fg2">{p.type}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[clamp(28px,3.6vw,40px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h3>
                    <div className="text-[14px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-fg2">{p.blurb}</p>
                    {specs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {specs.map((sp) => (
                          <span key={sp} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 font-mono text-[11.5px] text-fg2">{sp}</span>
                        ))}
                      </div>
                    )}
                    <Link href={`/products/${p.id}`} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: p.accent }}>
                      Learn more <ArrowRight size={14} strokeWidth={2.6} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BUNDLE PRICING */}
      <section id="pricing" className="border-t border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-10 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Sold as a bundle</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">Pick your coverage</h2>
          </div>
          <BundleCards bundles={bundles} floor={floor} />
        </div>
      </section>
    </div>
  );
}
