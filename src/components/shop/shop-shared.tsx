"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { money } from "@/lib/pricing";
import type { ProductRow } from "@/lib/repo";

export type ShopBundle = {
  id: string; label: string; gallons: number; acres: number;
  note: string; best?: boolean; total: number; perAcre: number;
};

/** The six carboys lined up as a single "program" visual. Each links to its page. */
export function BottleLineup({ products, size = "md" }: { products: ProductRow[]; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-[clamp(150px,22vw,260px)]" : size === "sm" ? "h-[88px]" : "h-[clamp(120px,16vw,190px)]";
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-6 sm:gap-x-6">
      {products.map((p) => (
        <Link key={p.id} href={`/products/${p.id}`} className="group flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className={`${h} w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,40,8,.22)] transition-transform duration-300 group-hover:-translate-y-1.5`} />
          <span className="mt-2 font-mono text-[10px] text-fg3">{p.num}</span>
          <span className="font-display text-[13px] font-extrabold text-forest">{p.name}</span>
        </Link>
      ))}
    </div>
  );
}

/** Program bundle pricing cards (3 & 6 gallon) + a volume card. */
export function BundleCards({ bundles, floor }: { bundles: ShopBundle[]; floor: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {bundles.map((b) => (
        <div key={b.id} className={`relative flex flex-col rounded-panel border bg-white p-7 ${b.best ? "border-leaf shadow-g-lg" : "border-hair shadow-g-sm"}`}>
          {b.best && (
            <span className="absolute right-5 top-5 rounded-full bg-leaf px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#04230B]">★ Best value</span>
          )}
          <div className="font-mono text-[12px] uppercase tracking-[0.1em] text-leaf-700">{b.gallons}-gallon bundle</div>
          <div className="mt-1 font-display text-[22px] font-extrabold text-forest">{b.label}</div>
          <div className="mt-0.5 text-[13px] text-fg3">Covers {b.acres} acres · all 6 products</div>
          <div className="mt-5 font-mono text-[34px] font-semibold text-forest">{money(b.total)}</div>
          <div className="mt-1 text-[13px] text-leaf-700">{money(b.perAcre)} / acre</div>
          <ul className="mt-5 flex flex-1 flex-col gap-2 text-[13.5px] text-fg2">
            {["All six products, custom-formulated", "Matched to your soil test & crop", "Fed through your existing irrigation"].map((t) => (
              <li key={t} className="flex items-start gap-2"><Check size={15} className="mt-0.5 flex-none text-leaf-600" /> {t}</li>
            ))}
          </ul>
          <Link href="/order-now" className={`mt-6 ${b.best ? "btn-primary" : "btn-ghost"} h-[48px] w-full text-[15px]`}>
            Get my quote <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
      ))}
      <div className="flex flex-col justify-center rounded-panel border border-dashed border-[#C9C6B6] bg-[#FCFBF7] p-7 text-center">
        <div className="font-display text-[19px] font-extrabold text-forest">Larger operation?</div>
        <p className="mt-2 text-[14px] text-fg2">Volume pricing steps down to <b className="text-forest">{money(floor)}/acre</b>. Build your formulation for an exact per-acre quote.</p>
        <Link href="/order-now" className="btn-leaf mx-auto mt-4 px-6 py-3 text-[15px]">Build my formula</Link>
      </div>
    </div>
  );
}
