"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { heroVideoFor, HERO_VIDEO_POSTER, getSales } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import { BundleCards, BottleLineup, type ShopBundle } from "./shop-shared";

/** Version A — "The Program": tinted field-video hero, then each product as a
 * full-width season showcase row, with bundle pricing. The six sold as one. */
export default function ShopExperienceA({ products, bundles }: { products: ProductRow[]; bundles: ShopBundle[] }) {
  return (
    <div className="bg-white text-forest">
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-74px)] items-center overflow-hidden bg-paper px-6 sm:px-10">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className="absolute inset-0 h-full w-full object-cover" src={heroVideoFor("restore")} poster={HERO_VIDEO_POSTER} autoPlay muted loop playsInline preload="auto" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.72) 45%, #ffffff 100%)" }} />
        <div className="relative z-10 mx-auto w-full max-w-container py-16 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">The six-product program</div>
          <h1 className="mx-auto mt-4 max-w-[900px] font-display text-[clamp(40px,7vw,80px)] font-black leading-[0.95] tracking-[-0.02em] text-forest">
            One program. Six inputs. Soil to harvest.
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#3F463E]">
            Every AgriPure operation runs the same six natural products as a single, custom-formulated system —
            fed straight through your irrigation, from soil prep to harvest.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order-now" className="btn-primary px-8 py-[15px] text-[16px]">Build my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <a href="#pricing" className="btn-ghost px-7 py-[15px] text-[16px]">See bundle pricing</a>
          </div>
          <div className="mt-3 text-[14px] text-fg2">Custom-priced by your crop &amp; acreage</div>

          <div className="mt-12">
            <BottleLineup products={products} size="md" />
          </div>
        </div>
      </section>

      {/* BUNDLE PRICING */}
      <section id="pricing" className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-10 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Sold as a bundle</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">Pick your coverage</h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[17px] leading-[1.6] text-fg2">
              Each bundle covers a set acreage with all six products — custom-priced by your crop and acreage. Build your
              formulation to see your exact per-acre quote.
            </p>
          </div>
          <BundleCards bundles={bundles} />
        </div>
      </section>

      {/* SEASON SHOWCASE — each product */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">What&apos;s inside</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">The six, across your season</h2>
        </div>

        <div className="mx-auto mt-14 flex max-w-container flex-col gap-16">
          {products.map((p, i) => {
            const flip = i % 2 === 1;
            const s = getSales(p.id);
            return (
              <div key={p.id} className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
                <div className={`flex justify-center ${flip ? "md:order-2" : ""}`}>
                  <div className="relative flex aspect-[4/5] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-[28px] border border-hair"
                    style={{ background: `radial-gradient(circle at 50% 62%, ${p.accentSoft} 0%, #FAF8F2 72%)` }}>
                    <span className="absolute left-6 top-5 font-mono text-[13px] font-semibold" style={{ color: p.accent }}>No. {p.num}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="max-h-[80%] w-auto max-w-[70%] object-contain drop-shadow-[0_24px_42px_rgba(0,40,8,.24)]" />
                  </div>
                </div>
                <div className={flip ? "md:order-1" : ""}>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: p.accent, background: p.accentSoft }}>Step {i + 1} of {products.length}</span>
                    <span className="rounded-full border border-hair bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-fg2">{p.type}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[clamp(34px,5vw,52px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{p.name}</h3>
                  <div className="mt-1 text-[17px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                  <p className="mt-4 max-w-[520px] text-[17px] font-semibold leading-[1.45] text-forest">{s.hook}</p>
                  <p className="mt-2.5 max-w-[520px] text-[15.5px] leading-[1.65] text-fg2">{p.blurb}</p>
                  <Link href={`/products/${p.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                    Explore {p.name} <ArrowRight size={15} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="font-display text-[clamp(30px,5vw,46px)] font-black tracking-[-0.02em] text-forest">Build your custom program.</h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-[#4A524B]">Tell us your crops, soil, and acreage — we&apos;ll formulate all six and price it by the acre.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-primary px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/how-it-works" className="btn-ghost px-8 py-[15px] text-[16px]">Our process</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
