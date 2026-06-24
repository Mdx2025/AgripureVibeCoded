"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSales, heroVideoFor, HERO_VIDEO_POSTER } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import SalesBody from "./SalesBody";
import { RatingInline, type Bundle } from "./sales-shared";

/**
 * Variation G — video-third hero: copy spans two-thirds on a clean light wash,
 * the tinted field video sits in a framed portrait panel on the right third.
 * No bottle in the hero (it lives in SalesBody's carboy showcase).
 */
export default function ProductSalesG({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const soft = product.accentSoft;

  return (
    <div className="bg-white pb-20 text-forest">
      {/* HERO — copy 2/3, framed video 1/3 */}
      <section className="relative flex min-h-[calc(100vh-74px)] items-center overflow-hidden px-6 sm:px-10" style={{ background: `linear-gradient(180deg, ${soft} 0%, #FFFFFF 92%)` }}>
        <div className="mx-auto grid w-full max-w-container items-center gap-10 py-16 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold" style={{ color: accent }}>No. {product.num}</span>
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-fg2">{product.type}</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(46px,7.5vw,88px)] font-black leading-[0.92] tracking-[-0.02em] text-forest">{product.name}</h1>
            <div className="mt-2 text-[clamp(18px,2.4vw,26px)] font-semibold" style={{ color: accent }}>{product.category}</div>
            <p className="mt-6 max-w-[620px] text-[clamp(18px,2.2vw,23px)] font-semibold leading-[1.45] text-forest">{s.hook}</p>
            <p className="mt-3 max-w-[560px] text-[16px] leading-[1.6] text-fg2">{s.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.3} /></Link>
              <a href="#explainer" className="btn-ghost px-7 py-[15px] text-[16px]">Watch how it works</a>
            </div>
            <div className="mt-7"><RatingInline product={product} /></div>
          </div>

          {/* framed video panel (one-third) */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[24px] border border-black/10 shadow-g-xl">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video className="absolute inset-0 h-full w-full object-cover" src={heroVideoFor(product.id)} poster={HERO_VIDEO_POSTER} autoPlay muted loop playsInline preload="auto" />
            <div className="pointer-events-none absolute inset-0" style={{ background: accent, opacity: 0.12 }} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)" }} />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
            </div>
          </div>
        </div>
      </section>

      <SalesBody product={product} related={related} bundles={bundles} />
    </div>
  );
}
