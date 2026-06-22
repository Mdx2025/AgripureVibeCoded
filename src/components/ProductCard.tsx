"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import type { ProductRow } from "@/lib/repo";

export default function ProductCard({ product: p }: { product: ProductRow }) {
  const href = `/products/${p.id}`;
  const img = p.image?.trim() || bottleSrc(p.id);

  return (
    <Link
      href={href}
      className="ap-card group flex flex-col overflow-hidden rounded-[20px] border border-hair bg-white shadow-g-sm"
    >
      <div
        className="relative flex h-[280px] items-end justify-center"
        style={{ background: `radial-gradient(circle at 50% 75%, ${p.accentSoft} 0%, #FAF8F2 70%)` }}
      >
        <span className="absolute left-4 top-3.5 font-mono text-xs font-semibold" style={{ color: p.accent }}>
          No. {p.num}
        </span>
        <span className="absolute right-4 top-3.5 rounded-full border border-hair bg-white px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.06em] text-fg2">
          {p.type}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={p.name}
          className="h-[248px] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,40,8,.22)]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 pt-5">
        <h3 className="font-display text-[23px] font-extrabold text-forest">{p.name}</h3>
        <div className="mt-[3px] text-[13px] text-[#7A8076]">{p.category}</div>
        <p className="mt-3 flex-1 text-sm leading-[1.55] text-fg2">{p.blurb}</p>
        <div className="mt-3 text-[12px] font-semibold text-leaf-700">Available in 3-gal &amp; 6-gal bundles</div>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-leaf-600">
          View details <ArrowRight size={15} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
