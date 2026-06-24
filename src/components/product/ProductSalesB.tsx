"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc, labelSrc, botanicalSrc } from "@/lib/products";
import { getSales } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import InteractiveVideo from "./InteractiveVideo";
import { BundlePricing, FaqList, CropTags, RelatedRow, RatingInline, TrustRow, type Bundle } from "./sales-shared";

type Tab = "bottle" | "label" | "botanical";

/** Variation B — editorial split. Light, gallery-led, spec-forward, calm. */
export default function ProductSalesB({ product, related, bundles }: { product: ProductRow; related: ProductRow[]; bundles: Bundle[] }) {
  const s = getSales(product.id);
  const accent = product.accent;
  const [tab, setTab] = useState<Tab>("bottle");
  const images: Record<Tab, string> = {
    bottle: product.image?.trim() || bottleSrc(product.id),
    label: labelSrc(product.id),
    botanical: botanicalSrc(product.id),
  };

  return (
    <div className="bg-paper">
      {/* breadcrumb */}
      <div className="mx-auto max-w-container px-6 pt-6 sm:px-10">
        <div className="text-[13px] text-fg3">
          <Link href="/shop" className="ap-link !text-fg3 !font-medium">Products</Link> / <span className="text-fg2">{product.name}</span>
        </div>
      </div>

      {/* HERO split */}
      <section className="mx-auto grid max-w-container items-start gap-12 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-2">
        {/* gallery */}
        <div className="lg:sticky lg:top-[96px]">
          <div className="relative flex h-[clamp(380px,56vh,580px)] items-center justify-center overflow-hidden rounded-[24px] border border-hair" style={{ background: `radial-gradient(circle at 50% 60%, ${product.accentSoft} 0%, #FAF8F2 72%)` }}>
            <span className="absolute left-6 top-5 font-mono text-[13px] font-semibold" style={{ color: accent }}>No. {product.num}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[tab]} alt={product.name} className={`object-contain drop-shadow-[0_24px_40px_rgba(0,40,8,.22)] ${tab === "label" ? "max-h-[88%] rounded-lg" : "max-h-[86%] w-auto max-w-[86%]"}`} />
          </div>
          <div className="mt-3.5 flex gap-3">
            {(["bottle", "label", "botanical"] as Tab[]).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`flex h-[84px] flex-1 items-center justify-center rounded-xl bg-white transition-colors ${tab === k ? "border-[1.5px] border-forest" : "border-[1.5px] border-hair"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[k]} alt={`${product.name} ${k}`} className="max-h-[62px] w-auto max-w-[80%] object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold" style={{ color: accent }}>No. {product.num}</span>
            <span className="rounded-full border border-hair bg-[#F0EDE3] px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-fg2">{product.type}</span>
          </div>
          <h1 className="mt-2.5 font-display text-[clamp(44px,6vw,64px)] font-black leading-[0.98] tracking-[-0.02em] text-forest">{product.name}</h1>
          <div className="mt-1 text-[18px] text-[#7A8076]">{product.category}</div>
          <div className="mt-3.5"><RatingInline product={product} /></div>
          <p className="mt-5 text-[clamp(18px,2vw,22px)] font-semibold leading-[1.45] text-forest">{s.hook}</p>
          <p className="mt-3 text-[16.5px] leading-[1.7] text-[#3F463E]">{product.long}</p>

          <div className="mt-7"><BundlePricing product={product} bundles={bundles} accent={accent} /></div>
          <div className="mt-5"><TrustRow /></div>
        </div>
      </section>

      {/* VIDEO band */}
      <section className="border-y border-hair bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Watch &amp; learn</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4vw,42px)] font-black tracking-[-0.02em] text-forest">See exactly what {product.name} does</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-fg2">Tap a chapter to jump straight to what matters — the problem it solves, how it works, and where it fits in your seven-product program.</p>
            <Link href="/order-now" className="btn-primary mt-7 inline-flex px-7 py-3.5 text-[15px]">Build your program <ArrowRight size={16} strokeWidth={2.2} /></Link>
          </div>
          <InteractiveVideo src={s.videoSrc} poster={botanicalSrc(product.id)} chapters={s.chapters} accent={accent} label={`Watch the ${product.name} explainer`} />
        </div>
      </section>

      {/* PROBLEM → BENEFITS */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#C0853C]">The problem</div>
          <h2 className="mt-3 font-display text-[clamp(26px,4.5vw,40px)] font-black tracking-[-0.02em] text-forest">{s.problem.title}</h2>
          <p className="mx-auto mt-4 text-[17px] leading-[1.7] text-fg2">{s.problem.body}</p>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {s.benefits.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-[14px]" style={{ background: product.accentSoft, color: accent }}><b.Icon size={24} /></div>
              <div>
                <h3 className="font-display text-[18px] font-extrabold text-forest">{b.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-fg2">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW timeline */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <h2 className="text-center font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">How it fits your program</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {s.how.map((h, i) => (
              <div key={h.title} className="relative rounded-panel border border-hair bg-white p-7">
                <span className="absolute right-5 top-4 font-display text-[42px] font-black text-[#EDEAE0]">{String(i + 1).padStart(2, "0")}</span>
                <div className="font-mono text-[12px] font-bold" style={{ color: accent }}>STEP {i + 1}</div>
                <h3 className="mt-2 font-display text-[19px] font-extrabold text-forest">{h.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{h.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {s.stats.map((st) => (
              <div key={st.label} className="rounded-2xl border border-hair bg-white px-7 py-4 text-center">
                <div className="font-mono text-[26px] font-semibold text-forest">{st.value}</div>
                <div className="text-[12px] uppercase tracking-[0.06em] text-fg3">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULATED FOR + FAQ */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(24px,3.5vw,32px)] font-black tracking-[-0.02em] text-forest">Formulated for your crop</h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-fg2">Every blend is matched to your soil test and crop, then potentized to nano scale so it absorbs straight through irrigation.</p>
            <div className="mt-6"><CropTags crops={product.crops} /></div>
          </div>
          <div>
            <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,32px)] font-black tracking-[-0.02em] text-forest">Questions, answered</h2>
            <FaqList faqs={s.faqs} accent={accent} />
          </div>
        </div>
      </section>

      {/* related */}
      <section className="mx-auto max-w-container px-6 pb-24 sm:px-10">
        <h2 className="mb-6 font-display text-[28px] font-extrabold text-forest">Pairs well with</h2>
        <RelatedRow related={related} />
      </section>
    </div>
  );
}
