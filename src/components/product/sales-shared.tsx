"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import Stars from "@/components/Stars";
import { bottleSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";
import type { Faq } from "@/lib/product-sales";

export type Bundle = { id: string; label: string; gallons: number; acres: number; note: string; best?: boolean; total: number; perAcre: number };

/* Bundle pricing block (program-driven). tone: light card vs dark card. */
export function BundlePricing({ product, bundles, accent, tone = "light" }: { product: ProductRow; bundles: Bundle[]; accent: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={`rounded-panel border p-6 ${dark ? "border-white/15 bg-white/[0.04]" : "border-leaf bg-[#F2F7EC]"}`}>
      <div className={`font-display text-[18px] font-extrabold ${dark ? "text-white" : "text-forest"}`}>Sold in 3 &amp; 6 gallon bundles</div>
      <p className={`mt-1.5 text-[14px] leading-[1.6] ${dark ? "text-[#C9DBC0]" : "text-fg2"}`}>
        {product.name} ships as part of the complete seven-product program, custom-matched and priced by your acreage.
      </p>
      {bundles.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {bundles.map((b) => (
            <div key={b.id} className={`rounded-xl border p-4 ${dark ? "border-white/12 bg-white/[0.05]" : "bg-white"} ${b.best ? "ring-1" : ""}`} style={b.best ? { borderColor: accent, boxShadow: `inset 0 0 0 1px ${accent}` } : undefined}>
              <div className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: accent }}>{b.gallons}-gal · {b.acres} ac</div>
              <div className={`mt-1 font-display text-[17px] font-extrabold ${dark ? "text-white" : "text-forest"}`}>{b.label}</div>
              <div className={`mt-1.5 font-mono text-[22px] font-semibold ${dark ? "text-white" : "text-forest"}`}>{money(b.total)}</div>
              <div className="text-[12px]" style={{ color: accent }}>{money(b.perAcre)} / acre</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/order-now" className="btn-leaf px-6 py-3 text-[15px]" style={{ background: accent }}>Order Now <ArrowRight size={16} strokeWidth={2.4} /></Link>
        <Link href="/pricing" className={`px-6 py-3 text-[15px] ${dark ? "btn-ghost-dark" : "btn-ghost"}`}>See full pricing</Link>
      </div>
    </div>
  );
}

export function TrustRow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const c = tone === "dark" ? "text-[#C9DBC0]" : "text-fg2";
  const ic = tone === "dark" ? "text-[#BFE89A]" : "text-leaf-600";
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      <span className={`flex items-center gap-[7px] text-[13px] ${c}`}><Truck size={17} strokeWidth={1.8} className={ic} />Free freight over $750</span>
      <span className={`flex items-center gap-[7px] text-[13px] ${c}`}><ShieldCheck size={17} strokeWidth={1.8} className={ic} />OMRI-style · copper-free</span>
    </div>
  );
}

export function SpecGrid({ product, tone = "light" }: { product: ProductRow; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const specs = [
    { label: "N-P-K", value: product.npk },
    { label: "pH", value: product.ph },
    { label: "Application rate", value: product.rate },
    { label: "SKU", value: product.sku },
  ];
  return (
    <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl border ${dark ? "border-white/12 bg-white/10" : "border-hair bg-hair"}`}>
      {specs.map((s) => (
        <div key={s.label} className={`px-4 py-3.5 ${dark ? "bg-[#0f2a17]" : "bg-white"}`}>
          <div className={`text-xs uppercase tracking-[0.06em] ${dark ? "text-[#7FA06C]" : "text-fg3"}`}>{s.label}</div>
          <div className={`mt-[3px] font-mono text-base ${dark ? "text-white" : "text-forest"}`}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export function CropTags({ crops, tone = "light" }: { crops: string[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-wrap gap-[9px]">
      {crops.map((c) => (
        <span key={c} className={`rounded-full border px-3.5 py-[7px] text-[13px] ${dark ? "border-white/15 bg-white/[0.06] text-[#D7E5CC]" : "border-hair bg-[#F0EDE3] text-[#3F463E]"}`}>{c}</span>
      ))}
    </div>
  );
}

export function FaqList({ faqs, accent, tone = "light" }: { faqs: Faq[]; accent: string; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(0);
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`overflow-hidden rounded-2xl border ${dark ? "border-white/12 bg-white/[0.04]" : "border-hair bg-white"}`}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className={`font-display text-[16px] font-extrabold ${dark ? "text-white" : "text-forest"}`}>{f.q}</span>
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full" style={{ background: isOpen ? accent : (dark ? "rgba(255,255,255,.1)" : "#E9F0E0"), color: isOpen ? "#fff" : accent }}>
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            {isOpen && <p className={`px-5 pb-5 text-[15px] leading-[1.65] ${dark ? "text-[#C9DBC0]" : "text-fg2"}`}>{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function RelatedRow({ related }: { related: ProductRow[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((p) => (
        <Link key={p.id} href={`/products/${p.id}`} className="ap-card flex items-center gap-[18px] rounded-card border border-hair bg-white p-5 shadow-g-sm">
          <div className="flex h-[110px] w-[90px] shrink-0 items-center justify-center rounded-xl" style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
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
  );
}

export function RatingInline({ product, tone = "light" }: { product: ProductRow; tone?: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-2.5">
      <Stars rating={product.rating} />
      <span className={`text-[13px] ${tone === "dark" ? "text-[#C9DBC0]" : "text-[#7A8076]"}`}>{product.rating.toFixed(1)} · {product.reviews} reviews</span>
    </div>
  );
}
