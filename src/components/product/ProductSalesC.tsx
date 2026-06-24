"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { bottleSrc, labelSrc, botanicalSrc } from "@/lib/products";
import { getSales } from "@/lib/product-sales";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";
import InteractiveVideo from "./InteractiveVideo";
import { FaqList, SpecGrid, CropTags, RelatedRow, RatingInline, type Bundle } from "./sales-shared";

/** Variation C — bold, accent-themed, conversion-focused with a sticky buy bar. */
export default function ProductSalesC({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const soft = product.accentSoft;
  const bottle = product.image?.trim() || bottleSrc(product.id);
  const fromPerAcre = bundles.length ? Math.min(...bundles.map((b) => b.perAcre)) : 0;

  return (
    <div className="bg-white pb-24">
      {/* HERO — accent wash */}
      <section className="relative overflow-hidden px-6 sm:px-10" style={{ background: `linear-gradient(180deg, ${soft} 0%, #FFFFFF 100%)` }}>
        <div className="mx-auto grid max-w-container items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: accent }}>
              No. {product.num} · {product.type}
            </div>
            <h1 className="mt-5 font-display text-[clamp(46px,7.5vw,84px)] font-black leading-[0.92] tracking-[-0.03em] text-forest">{product.name}</h1>
            <p className="mt-4 max-w-[520px] text-[clamp(19px,2.4vw,26px)] font-bold leading-[1.3] text-forest">{s.hook}</p>
            <p className="mt-3 max-w-[500px] text-[16px] leading-[1.6] text-fg2">{s.sub}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <RatingInline product={product} />
              {fromPerAcre > 0 && (
                <div className="text-[15px] text-fg2">from <span className="font-display text-[20px] font-extrabold text-forest">{money(fromPerAcre)}</span>/acre</div>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link href="/order-now" className="px-8 py-[15px] text-[16px] font-bold text-white shadow-g-md transition-transform hover:scale-[1.02] inline-flex items-center gap-2 rounded-full" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.4} /></Link>
              <a href="#explainer" className="btn-ghost px-7 py-[15px] text-[16px]">Watch the video</a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute h-[78%] w-[78%] rounded-full opacity-50 blur-3xl" style={{ background: accent }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bottle} alt={product.name} className="relative h-[clamp(360px,50vh,540px)] w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,40,8,.28)]" />
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="px-6 sm:px-10">
        <div className="mx-auto -mt-8 grid max-w-container gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-md sm:grid-cols-3">
          {s.stats.map((st) => (
            <div key={st.label} className="text-center">
              <div className="font-mono text-[clamp(26px,4vw,38px)] font-semibold" style={{ color: accent }}>{st.value}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-fg3">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section id="explainer" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-7 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>60-second explainer</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,42px)] font-black tracking-[-0.02em] text-forest">Watch {product.name} in action</h2>
          </div>
          <InteractiveVideo src={s.videoSrc} poster={botanicalSrc(product.id)} chapters={s.chapters} accent={accent} label={`Watch the ${product.name} explainer`} />
        </div>
      </section>

      {/* PROBLEM / SOLUTION split */}
      <section className="px-6 pb-4 sm:px-10">
        <div className="mx-auto grid max-w-container gap-6 lg:grid-cols-2">
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
      </section>

      {/* HOW cards */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <h2 className="text-center font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">Three steps to {product.name}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {s.how.map((h, i) => (
              <div key={h.title} className="rounded-panel border border-hair bg-white p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full font-display text-[22px] font-black text-white" style={{ background: accent }}>{i + 1}</div>
                <h3 className="mt-4 font-display text-[19px] font-extrabold text-forest">{h.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LABEL + SPECS */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={labelSrc(product.id)} alt={`${product.name} label`} className="w-full max-w-[400px] rounded-[18px] shadow-g-xl" />
          </div>
          <div>
            <h2 className="font-display text-[clamp(24px,3.5vw,34px)] font-black tracking-[-0.02em] text-forest">What&apos;s in the carboy</h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-fg2">{product.long}</p>
            <div className="mt-6"><SpecGrid product={product} /></div>
            <div className="mt-6 text-xs uppercase tracking-[0.06em] text-fg3">Formulated for</div>
            <div className="mt-2.5"><CropTags crops={product.crops} /></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[820px] px-6 py-20 sm:px-10">
        <h2 className="mb-7 text-center font-display text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em] text-forest">Questions, answered</h2>
        <FaqList faqs={s.faqs} accent={accent} />
      </section>

      {/* related */}
      <section className="mx-auto max-w-container px-6 sm:px-10">
        <h2 className="mb-6 font-display text-[28px] font-extrabold text-forest">Pairs well with</h2>
        <RelatedRow related={related} />
      </section>

      {/* STICKY BUY BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hair bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-container items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bottle} alt="" className="hidden h-11 w-auto object-contain sm:block" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[16px] font-extrabold text-forest">{product.name} <span className="font-sans text-[13px] font-medium text-fg3">· {product.category}</span></div>
            {fromPerAcre > 0 && <div className="text-[12.5px] text-fg2">from <span className="font-mono font-semibold text-forest">{money(fromPerAcre)}</span>/acre · seven-product program</div>}
          </div>
          <Link href="/pricing" className="btn-ghost hidden px-5 py-2.5 text-[14px] sm:inline-flex">Pricing</Link>
          <Link href="/order-now" className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-bold text-white" style={{ background: accent }}>Order Now <ArrowRight size={15} strokeWidth={2.4} /></Link>
        </div>
      </div>
    </div>
  );
}
