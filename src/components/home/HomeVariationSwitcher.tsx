"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";

const OPTIONS = [
  { v: "1", name: "Pinned Steps" },
  { v: "2", name: "Guided Rail" },
  { v: "3", name: "Cinematic" },
];

/** Floating control to preview the homepage product-flow layouts. Design-review
 * aid — remove it (and the ?v= param) once a version is chosen. */
export default function HomeVariationSwitcher({ current }: { current: string }) {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] max-w-[calc(100vw-16px)] -translate-x-1/2 print:hidden">
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-black/10 bg-white/95 p-1.5 pl-3 shadow-g-xl backdrop-blur-md">
        <span className="mr-1 hidden items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-fg3 sm:flex">
          <Layers size={14} /> Product flow
        </span>
        {OPTIONS.map((o) => {
          const active = current === o.v;
          return (
            <Link key={o.v} href={`${pathname}?v=${o.v}`} scroll={false} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${active ? "bg-forest text-white" : "text-fg2 hover:bg-[#F0EDE3]"}`}>
              <span className="font-mono opacity-70">{o.v}</span> {o.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
