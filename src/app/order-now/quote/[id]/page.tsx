import { notFound } from "next/navigation";
import { getQuote, getPricingProgram } from "@/lib/repo";
import { quoteForAcres, money } from "@/lib/pricing";
import PaymentPanel from "@/components/order/PaymentPanel";
import NewAccountNotice from "@/components/order/NewAccountNotice";

export const dynamic = "force-dynamic";

export default function QuotePage({
  params, searchParams,
}: { params: { id: string }; searchParams: { new?: string } }) {
  const quote = getQuote(params.id);
  if (!quote) return notFound();
  const p = quote.payload;
  const q = quoteForAcres(quote.acres, getPricingProgram());
  const isNew = searchParams?.new === "1";

  const list = (xs: string[]) => (xs.length ? xs.join(", ") : "—");

  return (
    <div className="mx-auto max-w-container px-6 pb-24 pt-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Your custom quote</div>
          <h1 className="mt-2 font-display text-[clamp(38px,6vw,60px)] font-black tracking-[-0.02em] text-forest">
            {quote.number}
          </h1>
          <div className="mt-1.5 text-[16px] text-fg3">{quote.customer_name} · {quote.payload.customer.business}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[clamp(34px,5vw,48px)] font-semibold leading-none text-forest">{money(quote.total)}</div>
          <div className="mt-1.5 text-[15px] text-fg3">{money(quote.effective)}/ac · {quote.acres.toLocaleString()} acres</div>
        </div>
      </div>

      {isNew && <NewAccountNotice quoteId={quote.id} email={quote.customer_email} />}

      {/* program summary */}
      <div className="mt-9 grid gap-6 md:grid-cols-2">
        <div className="rounded-panel border border-hair bg-white p-7">
          <h2 className="font-display text-[21px] font-extrabold text-forest">Your operation</h2>
          <table className="mt-4 w-full text-[16px]">
            <tbody>
              {p.crops.map((c) => (
                <tr key={c} className="border-b border-[#F2EFE6] last:border-0">
                  <td className="py-3 font-semibold text-forest">{c}</td>
                  <td className="py-3 text-right font-mono text-fg2">{(p.acres[c] || 0).toLocaleString()} ac</td>
                  <td className="py-3 pl-4 text-right text-[13px] text-fg3">{p.yieldByCrop[c] ? "yield loss" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-panel border border-hair bg-white p-7 text-[16px]">
          <h2 className="font-display text-[21px] font-extrabold text-forest">Pressures to address</h2>
          <dl className="mt-4 space-y-3.5">
            <div><dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">Soil</dt><dd className="mt-0.5 text-[#3F463E]">{list(p.soil)}</dd></div>
            <div><dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">Weeds</dt><dd className="mt-0.5 text-[#3F463E]">{list(p.weeds)}</dd></div>
            {p.crops.map((c) => (
              <div key={c}>
                <dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">{c} — pests / disease</dt>
                <dd className="mt-0.5 text-[#3F463E]">{list(p.pestsByCrop[c] || [])} · {list(p.diseasesByCrop[c] || [])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* pricing */}
      <div className="mt-6 overflow-hidden rounded-panel border border-hair bg-white">
        <div className="border-b border-hair px-7 py-5 font-display text-[21px] font-extrabold text-forest">
          Pricing — graduated volume rate
        </div>
        <table className="w-full text-[16px]">
          <tbody>
            {q.bands.map((b) => (
              <tr key={b.from} className="border-b border-[#F2EFE6]">
                <td className="px-7 py-3.5 text-fg2">{b.from}–{b.to == null ? "+" : b.to} ac · {b.acres} ac</td>
                <td className="px-2 py-3.5 text-right font-mono text-fg2">${b.rate}/ac</td>
                <td className="px-7 py-3.5 text-right font-mono text-forest">{money(b.cost)}</td>
              </tr>
            ))}
            <tr className="bg-[#FAF8F2]">
              <td className="px-7 py-4 font-display text-[17px] font-extrabold text-forest">Total · {q.bundles} × 6-gal bundles</td>
              <td className="px-2 py-4 text-right font-mono text-fg3">{money(q.effective)}/ac</td>
              <td className="px-7 py-4 text-right font-mono text-[20px] font-bold text-forest">{money(q.total)}</td>
            </tr>
          </tbody>
        </table>
        <div className="px-7 py-4 text-[15px] text-leaf-700">
          You save {money(q.saveVsOrganic)} vs a comparable organic program ({money(q.organicTotal)}).
        </div>
      </div>

      <div className="mt-7">
        <PaymentPanel quoteId={quote.id} total={quote.total} email={quote.customer_email} number={quote.number} />
      </div>
    </div>
  );
}
