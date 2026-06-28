import Link from "next/link";
import { Clock, Droplets, ArrowRight, Sprout } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import type { ProductRow } from "@/lib/repo";

type Phase = { id: string; phase: string; timing: string; role: string };

// The seven, in the order they're applied across the crop's lifecycle.
const LIFECYCLE: Phase[] = [
  { id: "restore", phase: "Soil preparation", timing: "Before planting", role: "Step one is the ground itself — we rebuild living soil so everything that follows has a healthy foundation." },
  { id: "cleanse", phase: "Weed control", timing: "Pre-emergent · before the crop comes up", role: "Next we clear the field, knocking back weed pressure during the window that matters most — before your crop emerges." },
  { id: "strength", phase: "Germination & rooting", timing: "At planting, through emergence", role: "As seeds go in, we wake them up and drive deep, even roots for a fast, uniform, vigorous stand." },
  { id: "grow", phase: "Growth & plant health", timing: "As the canopy builds", role: "Through the vegetative phase we fuel balanced growth and leaf area while targeting the plant-health problems your specific crop faces — strong growth where your crop is usually weakest." },
  { id: "protect", phase: "Pest protection", timing: "Through the season, as pests appear", role: "Mid-season, we defend the crop from insect pressure with botanical actives that spare pollinators and beneficials." },
  { id: "prevent", phase: "Disease prevention", timing: "Ahead of fungal & viral pressure", role: "Alongside pest control, we get ahead of disease — priming the plant's defenses before fungal and viral pressure costs yield." },
  { id: "boost", phase: "Bloom, fruit & harvest", timing: "Flowering through fruit fill", role: "At the finish, we push flowering, fruit set, and fill for a bigger, cleaner, higher-value harvest." },
];

/** The liked "Every product, across the crop's lifecycle" timeline. */
export default function ProductLifecycle({ products }: { products: ProductRow[] }) {
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const img = (p: ProductRow) => p.image?.trim() || bottleSrc(p.id);

  return (
    <section className="bg-paper-2 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-container">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The seven products</div>
          <h2 className="mt-3 font-display text-[clamp(26px,4.5vw,40px)] font-black tracking-[-0.02em] text-forest">
            Every product, across the crop&apos;s lifecycle
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-[17px] leading-[1.7] text-fg2">
            The seven aren&apos;t a one-time treatment — they&apos;re a season-long program, applied in order from soil
            prep to harvest. Here&apos;s exactly what each one does and when.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute bottom-0 left-[26px] top-2 w-[3px] rounded-full bg-gradient-to-b from-leaf via-[#9FC08A] to-[#C99A2E] sm:left-[31px]" />
          <div className="flex flex-col gap-7">
            {LIFECYCLE.map((item, i) => {
              const p = byId[item.id];
              if (!p) return null;
              return (
                <div key={item.id} className="relative flex gap-5 sm:gap-8">
                  <div className="relative z-10 flex-none">
                    <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-4 border-paper-2 font-display text-[19px] font-black text-white shadow-g-sm sm:h-16 sm:w-16 sm:text-[24px]" style={{ background: p.accent }}>
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
                    <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-[170px_1fr] md:gap-8">
                      <div className="flex items-center justify-center rounded-[18px] py-5" style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img(p)} alt={p.name} className="h-[160px] w-auto object-contain drop-shadow-[0_14px_24px_rgba(0,40,8,.2)]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: p.accent, background: p.accentSoft }}>{item.phase}</span>
                          <span className="font-mono text-[11px] text-fg3">No. {p.num} · {p.type}</span>
                        </div>
                        <h3 className="mt-2.5 font-display text-[28px] font-extrabold tracking-[-0.02em] text-forest">{p.name}</h3>
                        <div className="text-[15px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                        <p className="mt-3 text-[15px] font-medium italic leading-[1.6] text-[#5A6152]">{item.role}</p>
                        <p className="mt-2.5 text-[15.5px] leading-[1.65] text-fg2">{p.long}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[13px]">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E0] px-3 py-1.5 font-semibold text-leaf-700"><Droplets size={14} /> Applied via fertigation</span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-fg2"><Clock size={14} /> {item.timing}</span>
                          <Link href={`/products/${p.id}`} className="ap-link inline-flex items-center gap-1 font-semibold !text-leaf-600">Full details <ArrowRight size={13} strokeWidth={2.4} /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="relative flex items-center gap-5 sm:gap-8">
              <div className="relative z-10 flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full border-4 border-paper-2 bg-forest text-white shadow-g-sm sm:h-16 sm:w-16">
                <Sprout size={26} />
              </div>
              <div className="font-display text-[clamp(18px,3vw,24px)] font-extrabold text-forest">
                A cleaner, higher-value harvest — soil to harvest, all seven working as one.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
