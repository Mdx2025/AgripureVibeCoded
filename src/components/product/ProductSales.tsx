"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSales, heroVideoFor, HERO_VIDEO_POSTER } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import SalesBody from "./SalesBody";
import { RatingInline, type Bundle } from "./sales-shared";

/**
 * The product page layout: split hero — copy on one clean half, the tinted
 * field video filling the other. The bottle lives in SalesBody's carboy
 * showcase further down. Stacks to video-over-copy on mobile.
 */
export default function ProductSales({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const soft = product.accentSoft;

  return (
    <div className="bg-white pb-20 text-forest">
      {/* HERO — split: copy | video */}
      <section className="grid min-h-[calc(100vh-74px)] overflow-hidden lg:grid-cols-2">
        {/* copy panel (clean, fully readable) */}
        <div className="order-2 flex items-center px-6 py-14 sm:px-10 lg:order-1" style={{ background: `linear-gradient(180deg, ${soft} 0%, #FFFFFF 92%)` }}>
          <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold" style={{ color: accent }}>No. {product.num}</span>
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-fg2">{product.type}</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(44px,6.5vw,76px)] font-black leading-[0.95] tracking-[-0.02em] text-forest">{product.name}</h1>
            <div className="mt-2 text-[clamp(18px,2.4vw,24px)] font-semibold" style={{ color: accent }}>{product.category}</div>
            <p className="mt-6 text-[clamp(18px,2.2vw,22px)] font-semibold leading-[1.45] text-forest">{s.hook}</p>
            <p className="mt-3 text-[16px] leading-[1.6] text-fg2">{s.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.3} /></Link>
              <a href="#how" className="btn-ghost px-7 py-[15px] text-[16px]">How it works</a>
            </div>
            <div className="mt-7"><RatingInline product={product} /></div>
          </div>
        </div>

        {/* video panel */}
        <div className="relative order-1 min-h-[44vh] lg:order-2 lg:min-h-0">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="absolute inset-0 h-full w-full object-cover" src={heroVideoFor(product.id)} poster={HERO_VIDEO_POSTER} autoPlay muted loop playsInline preload="auto" />
          <div className="pointer-events-none absolute inset-0" style={{ background: accent, opacity: 0.14 }} />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
          </div>
        </div>
      </section>

      <SalesBody product={product} related={related} bundles={bundles} />
    </div>
  );
}
