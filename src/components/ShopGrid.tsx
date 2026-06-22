"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import type { ProductRow } from "@/lib/repo";

type Sort = "featured" | "low" | "high" | "rating";

export default function ShopGrid({ products }: { products: ProductRow[] }) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    let list = products.filter((p) => filter === "All" || p.group === filter);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, filter, sort]);

  return (
    <>
      <div className="my-[22px] mt-[34px] flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-wrap gap-[9px]">
          {CATEGORIES.map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`cursor-pointer rounded-full px-[18px] py-[9px] text-sm font-semibold transition-all ${
                  active
                    ? "border-[1.5px] border-forest bg-forest text-white"
                    : "border-[1.5px] border-[#D9D6C7] bg-white text-[#3F463E]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] text-fg3">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="cursor-pointer rounded-full border border-[#D9D6C7] bg-white px-3.5 py-[9px] text-sm text-[#26302A]"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
