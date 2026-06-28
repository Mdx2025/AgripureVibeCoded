"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { bottleSrc, labelSrc } from "@/lib/products";
import { getSales } from "@/lib/product-sales";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";
import { BundlePricing, FaqList, SpecGrid, CropTags, RelatedRow, type Bundle } from "./sales-shared";

/**
 * Everything below the hero for the contained-video variations (F, G): stat band,
 * Without/With, explainer, how-it-works, a dedicated carboy showcase (the bottle's
 * home now that it's out of the hero), label showcase, pricing, FAQ, related, and
 * the sticky buy bar. Each variation supplies only its own hero, then renders this.
 */
export default function SalesBody({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const soft = product.accentSoft;
  const bottle = product.image?.trim() || bottleSrc(product.id);
  const fromPerAcre = bundles.length ? Math.min(...bundles.map((b) => b.perAcre)) : 0;

  return (
    <>
      {/* STAT BAND — overlaps the hero for immediate proof */}
      <section className="relative z-10 px-6 sm:px-10">
        <div className="mx-auto -mt-10 grid max-w-container gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-md sm:grid-cols-3">
          {s.stats.map((st) => (
            <div key={st.label} className="text-center">
              <div className="font-mono text-[clamp(26px,4vw,38px)] font-semibold" style={{ color: accent }}>{st.value}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-fg3">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WITHOUT / WITH */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>Why it matters</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">The difference {product.name} makes</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-panel border border-hair bg-paper-2 p-8">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#C0853C]">Without it</div>
              <h3 className="mt-3 font-display text-[22px] font-extrabold text-forest">{s.problem.title}</h3>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-fg2">{s.problem.body}</p>
            </div>
            <div className="rounded-panel border p-8" style={{ borderColor: accent, background: soft }}>
              <div className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>With {product.name}</div>
              <ul className="mt-4 flex flex-col gap-3">
                {s.benefits.map((b) => (
                  <li key={b.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white" style={{ background: accent }}><Check size={14} strokeWidth={3} /></span>
                    <span className="text-[15.5px] leading-[1.5] text-forest"><strong className="font-bold">{b.title}.</strong> <span className="text-[#3F463E]">{b.body}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW — steps */}
      <section id="how" className="border-t border-hair px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <h2 className="text-center font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">How it fits your program</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {s.how.map((h, i) => (
              <div key={h.title} className="rounded-panel border border-hair bg-white p-7 shadow-g-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[20px] font-black text-white" style={{ background: accent }}>{i + 1}</div>
                <h3 className="mt-4 font-display text-[19px] font-extrabold text-forest">{h.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARBOY SHOWCASE — the bottle's home, lower on the page */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute h-[70%] w-[70%] rounded-full opacity-40 blur-3xl" style={{ background: accent }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bottle} alt={product.name} className="relative h-[clamp(340px,46vh,520px)] w-auto object-contain drop-shadow-[0_36px_56px_rgba(0,40,8,.3)]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>The product</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">Every carboy, custom to your crop</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-fg2">{product.long}</p>
            <div className="mt-7"><SpecGrid product={product} /></div>
            <div className="mt-7 text-xs uppercase tracking-[0.06em] text-fg3">Formulated for</div>
            <div className="mt-2.5"><CropTags crops={product.crops} /></div>
          </div>
        </div>
      </section>

      {/* LABEL SHOWCASE */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={labelSrc(product.id)} alt={`${product.name} label`} className="w-full max-w-[380px] rounded-[18px] shadow-g-xl ring-1 ring-black/5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>On the label</div>
            <h2 className="mt-3 font-display text-[clamp(24px,3.5vw,34px)] font-black tracking-[-0.02em] text-forest">Clear, honest, and crop-specific</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-fg2">{s.labelNote}</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 pb-4 sm:px-10">
        <div className="mx-auto max-w-[820px]"><BundlePricing product={product} bundles={bundles} accent={accent} /></div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-7 text-center font-display text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em] text-forest">Questions, answered</h2>
          <FaqList faqs={s.faqs} accent={accent} />
        </div>
      </section>

      {/* FINAL CTA + related */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-hair p-10 text-center sm:p-16" style={{ background: `radial-gradient(120% 130% at 50% -20%, ${soft} 0%, #FFFFFF 60%)` }}>
          <h2 className="font-display text-[clamp(28px,5vw,46px)] font-black tracking-[-0.02em] text-forest">Put {product.name} to work this season.</h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-[17px] text-fg2">Tell us your crop, soil, and acreage — we&apos;ll formulate all six and price it by the acre.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <Link href="/how-it-works" className="btn-ghost px-8 py-[15px] text-[16px]">How it works</Link>
          </div>
        </div>
        <div className="mx-auto mt-20 max-w-container">
          <h2 className="mb-6 text-center font-display text-[clamp(24px,3.5vw,34px)] font-black tracking-[-0.02em] text-forest">Learn About Other Products In Our Line</h2>
          <RelatedRow related={related} />
        </div>
      </section>

      {/* STICKY BUY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hair bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-container items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bottle} alt="" className="hidden h-11 w-auto object-contain sm:block" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[16px] font-extrabold text-forest">{product.name} <span className="font-sans text-[13px] font-medium text-fg3">· {product.category}</span></div>
            {fromPerAcre > 0 && <div className="text-[12.5px] text-fg2">from <span className="font-mono font-semibold text-forest">{money(fromPerAcre)}</span>/acre · six-product program</div>}
          </div>
          <Link href="/pricing" className="btn-ghost hidden px-5 py-2.5 text-[14px] sm:inline-flex">Pricing</Link>
          <Link href="/order-now" className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-bold text-white" style={{ background: accent }}>Order Now <ArrowRight size={15} strokeWidth={2.4} /></Link>
        </div>
      </div>
    </>
  );
}
