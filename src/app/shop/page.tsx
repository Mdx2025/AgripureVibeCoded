import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShopGrid from "@/components/ShopGrid";
import { listProducts, getPricingProgram } from "@/lib/repo";
import { bundleQuote, floorRate, money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  const products = listProducts();
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));
  const floor = floorRate(program);

  return (
    <div className="mx-auto max-w-container px-8 pb-[90px] pt-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The seven</div>
          <h1 className="mt-2 font-display text-[52px] font-black tracking-[-0.02em] text-forest">
            Products
          </h1>
          <p className="mt-3 max-w-[620px] text-[17px] text-fg2">
            Seven natural inputs that work as one system — soil, germination, growth, protection,
            and yield. Sold as a single custom program, available in 3-gallon and 6-gallon bundles
            and priced by your acreage.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/order-now" className="btn-leaf px-6 py-[13px] text-[15px]">
            Order Now <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
          <Link href="/pricing" className="btn-ghost px-6 py-[13px] text-[15px]">See full pricing</Link>
        </div>
      </div>

      {/* bundle pricing — wired to the backend Pricing Program */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => (
          <div key={b.id} className={`relative flex flex-col rounded-panel border bg-white p-7 ${b.best ? "border-leaf shadow-g-lg" : "border-hair shadow-g-sm"}`}>
            {b.best && (
              <span className="absolute right-5 top-5 rounded-full bg-leaf px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#04230B]">★ Best value</span>
            )}
            <div className="font-mono text-[12px] uppercase tracking-[0.1em] text-leaf-700">{b.gallons}-gallon bundle</div>
            <div className="mt-1 font-display text-[22px] font-extrabold text-forest">{b.label}</div>
            <div className="mt-0.5 text-[13px] text-fg3">Covers {b.acres} acres · all 7 products</div>
            <div className="mt-5 font-mono text-[32px] font-semibold text-forest">{money(b.total)}</div>
            <div className="mt-1 text-[13px] text-leaf-700">{money(b.perAcre)} / acre</div>
            <div className="mt-4 flex-1 text-[14px] text-fg2">{b.note}</div>
            <Link href="/order-now" className={`mt-6 ${b.best ? "btn-primary" : "btn-ghost"} h-[48px] w-full text-[15px]`}>
              Get my quote <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
          </div>
        ))}
        {/* volume card */}
        <div className="flex flex-col justify-center rounded-panel border border-dashed border-[#C9C6B6] bg-[#FCFBF7] p-7 text-center">
          <div className="font-display text-[19px] font-extrabold text-forest">Larger operation?</div>
          <p className="mt-2 text-[14px] text-fg2">Volume pricing steps down to <b className="text-forest">{money(floor)}/acre</b>. Build your formulation for an exact per-acre quote.</p>
          <Link href="/order-now" className="btn-leaf mx-auto mt-4 px-6 py-3 text-[15px]">Build my formula</Link>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em] text-forest">The seven products</h2>
        <ShopGrid products={products} />
      </div>
    </div>
  );
}
