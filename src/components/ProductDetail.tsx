"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight } from "lucide-react";
import Stars from "@/components/Stars";
import { bottleSrc, labelSrc, botanicalSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";

type Tab = "bottle" | "label" | "botanical";
type Bundle = { id: string; label: string; gallons: number; acres: number; note: string; best?: boolean; total: number; perAcre: number };

export default function ProductDetail({
  product,
  related,
  bundles = [],
}: {
  product: ProductRow;
  related: ProductRow[];
  bundles?: Bundle[];
}) {
  const [tab, setTab] = useState<Tab>("bottle");

  const images: Record<Tab, string> = {
    bottle: product.image?.trim() || bottleSrc(product.id),
    label: labelSrc(product.id),
    botanical: botanicalSrc(product.id),
  };
  const specs = [
    { label: "N-P-K", value: product.npk },
    { label: "pH", value: product.ph },
    { label: "Application rate", value: product.rate },
    { label: "SKU", value: product.sku },
  ];

  return (
    <div className="mx-auto max-w-container px-8 pb-[90px] pt-8">
      <div className="mb-6 text-[13px] text-fg3">
        <Link href="/shop" className="ap-link !text-fg3 !font-medium">Products</Link>{" "}
        / <span className="text-fg2">{product.name}</span>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* gallery */}
        <div className="lg:sticky lg:top-[100px]">
          <div
            className="relative flex h-[540px] items-center justify-center overflow-hidden rounded-[24px] border border-hair"
            style={{ background: `radial-gradient(circle at 50% 60%, ${product.accentSoft} 0%, #FAF8F2 72%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[tab]} alt={product.name}
              className="max-h-[500px] w-auto max-w-[88%] object-contain drop-shadow-[0_20px_36px_rgba(0,40,8,.22)]" />
          </div>
          <div className="mt-3.5 flex gap-3">
            {(["bottle", "label", "botanical"] as Tab[]).map((k) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex h-[84px] flex-1 items-center justify-center rounded-xl bg-white transition-colors ${tab === k ? "border-[1.5px] border-forest" : "border-[1.5px] border-hair"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[k]} alt={`${product.name} ${k}`} className="max-h-[62px] w-auto max-w-[80%] object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold" style={{ color: product.accent }}>No. {product.num}</span>
            <span className="rounded-full border border-hair bg-[#F0EDE3] px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-fg2">{product.type}</span>
          </div>
          <h1 className="mt-2.5 font-display text-[56px] font-black leading-none tracking-[-0.02em] text-forest">{product.name}</h1>
          <div className="mt-0.5 text-[17px] text-[#7A8076]">{product.category}</div>
          <div className="mt-3.5 flex items-center gap-2.5">
            <Stars rating={product.rating} />
            <span className="text-[13px] text-[#7A8076]">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
          </div>
          <p className="mt-5 text-[17px] leading-[1.65] text-[#3F463E]">{product.long}</p>

          {/* bundle pricing (program-driven, per-acre) */}
          <div className="mt-7 rounded-panel border border-leaf bg-[#F2F7EC] p-6">
            <div className="font-display text-[18px] font-extrabold text-forest">Sold in 3 &amp; 6 gallon bundles</div>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-fg2">
              {product.name} ships as part of the complete seven-product program, custom-matched and
              priced by your acreage.
            </p>
            {bundles.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {bundles.map((b) => (
                  <div key={b.id} className={`rounded-xl border bg-white p-4 ${b.best ? "border-leaf" : "border-hair"}`}>
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-leaf-700">{b.gallons}-gal · {b.acres} ac</div>
                    <div className="mt-1 font-display text-[17px] font-extrabold text-forest">{b.label}</div>
                    <div className="mt-1.5 font-mono text-[22px] font-semibold text-forest">{money(b.total)}</div>
                    <div className="text-[12px] text-leaf-700">{money(b.perAcre)} / acre</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/order-now" className="btn-leaf px-6 py-3 text-[15px]">Order Now <ArrowRight size={16} strokeWidth={2.4} /></Link>
              <Link href="/pricing" className="btn-ghost px-6 py-3 text-[15px]">See full pricing</Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-[18px]">
            <span className="flex items-center gap-[7px] text-[13px] text-fg2"><Truck size={17} strokeWidth={1.8} className="text-leaf-600" />Free freight over $750</span>
            <span className="flex items-center gap-[7px] text-[13px] text-fg2"><ShieldCheck size={17} strokeWidth={1.8} className="text-leaf-600" />OMRI-style · copper-free</span>
          </div>

          {/* specs */}
          <div className="mt-[30px] border-t border-hair pt-6">
            <div className="mb-3.5 font-display text-[18px] font-extrabold text-forest">Specs</div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hair bg-hair">
              {specs.map((s) => (
                <div key={s.label} className="bg-white px-4 py-3.5">
                  <div className="text-xs uppercase tracking-[0.06em] text-fg3">{s.label}</div>
                  <div className="mt-[3px] font-mono text-base text-forest">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="mb-2.5 mt-[22px] text-xs uppercase tracking-[0.06em] text-fg3">Formulated for</div>
            <div className="flex flex-wrap gap-[9px]">
              {product.crops.map((c) => (
                <span key={c} className="rounded-full border border-hair bg-[#F0EDE3] px-3.5 py-[7px] text-[13px] text-[#3F463E]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="mt-20">
        <h2 className="mb-[22px] font-display text-[28px] font-extrabold text-forest">Pairs well with</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="ap-card flex items-center gap-[18px] rounded-card border border-hair bg-white p-5 shadow-g-sm">
              <div className="flex h-[110px] w-[90px] shrink-0 items-center justify-center rounded-xl"
                style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="h-[104px] w-auto object-contain" />
              </div>
              <div>
                <div className="font-mono text-[11px]" style={{ color: p.accent }}>No. {p.num}</div>
                <div className="mt-0.5 font-display text-[20px] font-extrabold text-forest">{p.name}</div>
                <div className="mt-0.5 text-[13px] text-[#7A8076]">{p.category}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
