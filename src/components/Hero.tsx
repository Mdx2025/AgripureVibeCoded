import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PRODUCTS } from "@/lib/products";

/**
 * Storefront hero.
 *
 * The handoff specifies a scroll-driven WebGL "fly into the farm" experience
 * here (see design-handoff/EXPERIENCE_3D.md). This is a high-fidelity 2D
 * stand-in using the exact intro copy + the product lineup, ready to be
 * swapped for the R3F / image-sequence build.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest">
      <div className="absolute inset-0 bg-aurora opacity-90" />
      <div className="absolute inset-0 [box-shadow:inset_0_0_220px_40px_rgba(6,16,8,.55)]" />

      <div className="relative mx-auto flex min-h-[640px] max-w-container flex-col justify-center px-8 py-24">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#CFE3C2]">
          Nano Technology
        </span>
        <h1 className="mt-5 max-w-[15ch] font-display text-[clamp(44px,7vw,84px)] font-black leading-[1.02] tracking-[-0.02em] text-white">
          Natural Pesticides and Nutrients
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-[#C9DBC0]">
          We utilize potentized nano particles to provide a seed-to-finish natural
          pesticide and nutrient solution for crops.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <Link href="/shop" className="btn-leaf px-7 py-[15px] text-[15px]">
            Shop the line <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
          <Link
            href="/find-your-formula"
            className="btn px-7 py-[15px] text-[15px] text-white [border:1.5px_solid_rgba(255,255,255,.4)] hover:bg-white/10"
          >
            Find your formula
          </Link>
          <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2.5 text-[13px] font-medium text-[#CFE3C2]">
            The Best Crop Insurance You Can Buy
          </span>
        </div>

        {/* Product lineup — the seven applied to one system */}
        <div className="ap-sc mt-14 flex items-end gap-2 overflow-x-auto pb-2">
          {PRODUCTS.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex shrink-0 flex-col items-center"
              title={`${p.name} — ${p.category}`}
            >
              <Image
                src={`/assets/bottles/${p.id}.png`}
                alt={p.name}
                width={88}
                height={132}
                className="h-[120px] w-auto drop-shadow-[0_16px_26px_rgba(0,0,0,.45)] transition-transform duration-300 ease-smooth group-hover:-translate-y-1.5"
              />
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#9FD27E]">
                No. {p.num}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 animate-bouncey flex-col items-center gap-1 text-[#CFE3C2]">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Scroll</span>
        <ChevronDown size={18} />
      </div>

      {/* placeholder marker for the eventual 3D build */}
      <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
        3D experience · placeholder
      </span>
    </section>
  );
}
