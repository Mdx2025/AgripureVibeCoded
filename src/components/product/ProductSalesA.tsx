"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { bottleSrc, labelSrc, botanicalSrc } from "@/lib/products";
import { getSales } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import InteractiveVideo from "./InteractiveVideo";
import { BundlePricing, FaqList, SpecGrid, CropTags, RelatedRow, RatingInline, type Bundle } from "./sales-shared";

/** Variation A — full-screen cinematic. Dark, immersive, video-forward. */
export default function ProductSalesA({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const bottle = product.image?.trim() || bottleSrc(product.id);

  return (
    <div className="bg-[#06160c] text-white">
      {/* HERO — full viewport */}
      <section className="relative flex min-h-[calc(100vh-74px)] items-center overflow-hidden px-6 sm:px-10">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(80% 70% at 78% 50%, ${accent}38 0%, rgba(6,22,12,0) 60%)` }} />
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: accent }} />
        <div className="relative mx-auto grid w-full max-w-container items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold" style={{ color: accent }}>No. {product.num}</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#C9DBC0]">{product.type}</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(44px,7vw,82px)] font-black leading-[0.95] tracking-[-0.02em]">{product.name}</h1>
            <div className="mt-2 text-[clamp(18px,2.4vw,24px)] font-semibold" style={{ color: accent }}>{product.category}</div>
            <p className="mt-6 max-w-[560px] text-[clamp(18px,2.2vw,22px)] leading-[1.5] text-[#E4EFD9]">{s.hook}</p>
            <p className="mt-3 max-w-[540px] text-[16px] leading-[1.6] text-[#A9C09A]">{s.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.3} /></Link>
              <a href="#explainer" className="btn-ghost-dark px-7 py-[15px] text-[16px]">Watch how it works</a>
            </div>
            <div className="mt-7"><RatingInline product={product} tone="dark" /></div>
          </div>

          <div className="relative flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bottle} alt={product.name} className="h-[clamp(360px,52vh,560px)] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.6)]" />
          </div>
        </div>
        <a href="#explainer" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 hover:text-white"><ArrowDown size={24} className="animate-bounce" /></a>
      </section>

      {/* INTERACTIVE VIDEO */}
      <section id="explainer" className="border-t border-white/10 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-7 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>See it work</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,42px)] font-black tracking-[-0.02em]">How {product.name} earns its place</h2>
          </div>
          <InteractiveVideo src={s.videoSrc} poster={botanicalSrc(product.id)} chapters={s.chapters} accent={accent} label={`Watch the ${product.name} explainer`} />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[820px] rounded-panel border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#C0853C]">The problem</div>
          <h2 className="mt-3 font-display text-[clamp(24px,4vw,36px)] font-black leading-[1.1] tracking-[-0.02em]">{s.problem.title}</h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[17px] leading-[1.7] text-[#C9DBC0]">{s.problem.body}</p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-6 pb-8 sm:px-10">
        <div className="mx-auto max-w-container">
          <h2 className="text-center font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em]">Why growers run {product.name}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.benefits.map((b) => (
              <div key={b.title} className="rounded-panel border border-white/10 bg-white/[0.04] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px]" style={{ background: `${accent}26`, color: accent }}><b.Icon size={24} /></div>
                <h3 className="mt-4 font-display text-[18px] font-extrabold">{b.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-[#A9C09A]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW + STATS */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-container gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="font-display text-[clamp(24px,3.5vw,34px)] font-black tracking-[-0.02em]">How it fits your program</h2>
            <div className="mt-7 flex flex-col gap-4">
              {s.how.map((h, i) => (
                <div key={h.title} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display font-black" style={{ background: accent, color: "#06160c" }}>{i + 1}</div>
                  <div>
                    <div className="font-display text-[17px] font-extrabold">{h.title}</div>
                    <p className="mt-1 text-[14.5px] leading-[1.6] text-[#A9C09A]">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 self-start lg:grid-cols-1">
            {s.stats.map((st) => (
              <div key={st.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center lg:text-left">
                <div className="font-mono text-[clamp(22px,3vw,30px)] font-semibold" style={{ color: accent }}>{st.value}</div>
                <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-[#7FA06C]">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LABEL SHOWCASE */}
      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={labelSrc(product.id)} alt={`${product.name} label`} className="w-full max-w-[420px] rounded-[18px] shadow-g-xl ring-1 ring-white/10" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>On the label</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em]">Every carboy, custom to your crop</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-[#C9DBC0]">{product.long}</p>
            <div className="mt-7"><SpecGrid product={product} tone="dark" /></div>
            <div className="mt-7 text-xs uppercase tracking-[0.06em] text-[#7FA06C]">Formulated for</div>
            <div className="mt-2.5"><CropTags crops={product.crops} tone="dark" /></div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[820px]"><BundlePricing product={product} bundles={bundles} accent={accent} tone="dark" /></div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-7 text-center font-display text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em]">Questions, answered</h2>
          <FaqList faqs={s.faqs} accent={accent} tone="dark" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-white/10 p-10 text-center sm:p-16" style={{ background: `radial-gradient(120% 130% at 50% -20%, ${accent}33 0%, rgba(6,22,12,0) 60%)` }}>
          <h2 className="font-display text-[clamp(28px,5vw,46px)] font-black tracking-[-0.02em]">Put {product.name} to work this season.</h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-[17px] text-[#C9DBC0]">Tell us your crop, soil, and acreage — we&apos;ll formulate all seven and price it by the acre.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>Order Now <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <Link href="/how-it-works" className="btn-ghost-dark px-8 py-[15px] text-[16px]">How it works</Link>
          </div>
        </div>

        {/* related */}
        <div className="mx-auto mt-20 max-w-container">
          <h2 className="mb-6 font-display text-[24px] font-extrabold text-white">Pairs well with</h2>
          <RelatedRow related={related} />
        </div>
      </section>
    </div>
  );
}
