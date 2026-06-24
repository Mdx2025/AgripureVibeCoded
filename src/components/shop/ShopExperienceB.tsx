"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";
import { BundleCards, type ShopBundle } from "./shop-shared";

/** Version B — "Bundle Storefront": leads with the bundle pricing, then shows
 * the seven products as a clean grid of "what's inside". */
export default function ShopExperienceB({ products, bundles, floor }: { products: ProductRow[]; bundles: ShopBundle[]; floor: number }) {
  return (
    <div className="bg-white text-forest">
      {/* HERO */}
      <section className="bg-[radial-gradient(120%_120%_at_50%_-10%,#DCEFC8_0%,#FFFFFF_55%)] px-6 pb-10 pt-16 text-center sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">The complete program</div>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,76px)] font-black leading-[0.95] tracking-[-0.02em] text-forest">
            Seven products. One bundle.
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#3F463E]">
            All seven AgriPure inputs, custom-formulated to your crop and soil, sold as one program in 3- and
            6-gallon bundles — priced by the acre.
          </p>
          <div className="mt-3 text-[14px] text-fg2">from <span className="font-display text-[18px] font-extrabold text-forest">{money(floor)}</span>/acre at volume</div>
        </div>
      </section>

      {/* BUNDLE PRICING — the focus */}
      <section id="pricing" className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <BundleCards bundles={bundles} floor={floor} />
        </div>
      </section>

      {/* INSIDE THE BUNDLE — the seven */}
      <section className="border-t border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-10 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Inside every bundle</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">All seven, working as one</h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[17px] leading-[1.6] text-fg2">Each product owns a stage of the season — soil, germination, growth, protection, and yield.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="ap-card group flex gap-5 rounded-panel border border-hair bg-white p-5 shadow-g-sm">
                <div className="flex h-[132px] w-[96px] flex-none items-center justify-center rounded-2xl" style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="h-[122px] w-auto object-contain transition-transform duration-300 group-hover:-translate-y-1" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[11px]" style={{ color: p.accent }}>No. {p.num}</div>
                  <div className="mt-0.5 font-display text-[21px] font-extrabold text-forest">{p.name}</div>
                  <div className="text-[13px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-fg2">{p.blurb}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-bold text-leaf-700">Learn more <ArrowRight size={13} strokeWidth={2.6} /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/order-now" className="btn-primary px-8 py-[15px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
