import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSales, productVideoFor, productPosterFor, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "./StepVideo";

/** Version C — cinematic. Each product is a big, centered, accent-tinted panel
 * with its film front-and-center and a bold "what it does" statement. */
export default function ProductFlowC({ products }: { products: ProductRow[] }) {
  return (
    <div className="bg-white">
      <section className="px-6 pt-20 text-center sm:px-10">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The seven, in motion</div>
        <h2 className="mt-3 font-display text-[clamp(30px,5vw,52px)] font-black tracking-[-0.02em] text-forest">Every product, every step</h2>
        <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">Scroll the full season. Each film shows one product at work — and what it does for your crop.</p>
      </section>

      {products.map((p, i) => {
        const s = getSales(p.id);
        const phase = stepPhaseFor(p.id);
        return (
          <section
            key={p.id}
            className="relative overflow-hidden px-6 py-20 sm:px-10"
            style={{ background: i % 2 === 1 ? `linear-gradient(180deg, ${p.accentSoft} 0%, #FFFFFF 100%)` : "#FFFFFF" }}
          >
            {/* giant step watermark */}
            <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[clamp(180px,32vw,420px)] font-black leading-none tracking-tighter opacity-[0.05]" style={{ color: p.accent }}>
              {i + 1}
            </div>

            <div className="relative mx-auto max-w-[1000px]">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white" style={{ background: p.accent }}>
                  Step {i + 1} of 7 · {phase.phase}
                </div>
                <h3 className="mt-5 font-display text-[clamp(40px,7vw,80px)] font-black leading-[0.92] tracking-[-0.03em] text-forest">{p.name}</h3>
                <div className="mt-1 text-[clamp(17px,2.2vw,22px)] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                <p className="mx-auto mt-5 max-w-[680px] text-[clamp(18px,2.2vw,24px)] font-semibold leading-[1.4] text-forest">{s.hook}</p>
              </div>

              {/* film */}
              <div className="relative mx-auto mt-9 aspect-video w-full overflow-hidden rounded-[24px] border shadow-g-xl" style={{ borderColor: `${p.accent}40` }}>
                <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
              </div>

              <div className="mx-auto mt-8 max-w-[720px] text-center">
                <p className="text-[16.5px] leading-[1.75] text-fg2">{p.long}</p>
                <Link href={`/products/${p.id}`} className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white" style={{ background: p.accent }}>
                  Explore {p.name} <ArrowRight size={16} strokeWidth={2.4} />
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
