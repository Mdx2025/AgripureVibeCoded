import { notFound } from "next/navigation";
import { getQuote } from "@/lib/repo";
import { quoteForCrops, money } from "@/lib/crop-pricing";
import PaymentPanel from "@/components/order/PaymentPanel";
import NewAccountNotice from "@/components/order/NewAccountNotice";

export const dynamic = "force-dynamic";

export default function QuotePage({
  params, searchParams,
}: { params: { id: string }; searchParams: { new?: string } }) {
  const quote = getQuote(params.id);
  if (!quote) return notFound();
  const p = quote.payload;
  const cq = quoteForCrops(p.acres);
  const isNew = searchParams?.new === "1";

  const list = (xs: string[]) => (xs.length ? xs.join(", ") : "—");
  const perCropSoil = !!(p.soilByCrop || p.weedsByCrop);

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
            {!perCropSoil && (p.soil?.length || p.weeds?.length) ? (
              <>
                <div><dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">Soil</dt><dd className="mt-0.5 text-[#3F463E]">{list(p.soil || [])}</dd></div>
                <div><dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">Weeds</dt><dd className="mt-0.5 text-[#3F463E]">{list(p.weeds || [])}</dd></div>
              </>
            ) : null}
            {p.crops.map((c) => (
              <div key={c}>
                <dt className="text-[13px] uppercase tracking-[0.06em] text-fg3">
                  {c} — {perCropSoil ? "soil / weeds / " : ""}plant health / pests / disease
                </dt>
                <dd className="mt-0.5 text-[#3F463E]">
                  {perCropSoil ? `${list(p.soilByCrop?.[c] || [])} · ${list(p.weedsByCrop?.[c] || [])} · ` : ""}
                  {list(p.plantHealthByCrop?.[c] || [])} · {list(p.pestsByCrop[c] || [])} · {list(p.diseasesByCrop[c] || [])}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* pricing — per crop, by crop type */}
      <div className="mt-6 overflow-hidden rounded-panel border border-hair bg-white">
        <div className="border-b border-hair px-7 py-5 font-display text-[21px] font-extrabold text-forest">
          Pricing — by crop, with volume discounts
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[15px]">
            <thead className="border-b border-hair bg-[#FAF8F2] text-[11.5px] uppercase tracking-[0.05em] text-fg3">
              <tr>
                <th className="px-7 py-3 text-left font-bold">Crop</th>
                <th className="px-2 py-3 text-right font-bold">Acres</th>
                <th className="px-2 py-3 text-right font-bold">Conv. / Org.</th>
                <th className="px-2 py-3 text-right font-bold">AgriPure $/ac</th>
                <th className="px-7 py-3 text-right font-bold">Line total</th>
              </tr>
            </thead>
            <tbody>
              {cq.lines.map((l) => (
                <tr key={l.id} className="border-b border-[#F2EFE6]">
                  <td className="px-7 py-3.5">
                    <span className="font-semibold text-forest">{l.crop}</span>
                    {!l.unknown && <span className="ml-2 text-[12px] text-fg3">tier {l.tier}</span>}
                  </td>
                  <td className="px-2 py-3.5 text-right font-mono text-fg2">{l.acres.toLocaleString()}</td>
                  <td className="px-2 py-3.5 text-right font-mono text-fg3">
                    {l.unknown ? "—" : `${money(l.conventional)} / ${money(l.organic)}`}
                  </td>
                  <td className="px-2 py-3.5 text-right font-mono text-forest">
                    {money(l.perAcre)}
                    {l.discount > 0 && <span className="ml-1.5 text-[11.5px] font-semibold text-leaf-700">−{Math.round(l.discount * 100)}%</span>}
                  </td>
                  <td className="px-7 py-3.5 text-right font-mono font-semibold text-forest">{money(l.total)}</td>
                </tr>
              ))}
              <tr className="border-b border-[#F2EFE6] bg-[#FAF8F2]">
                <td className="px-7 py-3.5 font-display text-[15px] font-extrabold text-forest">
                  Program subtotal · {cq.bundles.sixGal} × 6-gal{cq.bundles.threeGal > 0 ? ` + ${cq.bundles.threeGal} × 3-gal` : ""} bundles
                </td>
                <td className="px-2 py-3.5 text-right font-mono text-fg3">{cq.acres.toLocaleString()}</td>
                <td className="px-2 py-3.5"></td>
                <td className="px-2 py-3.5 text-right font-mono text-fg3">{money(cq.effective)}/ac</td>
                <td className="px-7 py-3.5 text-right font-mono text-[16px] font-semibold text-forest">{money(cq.total)}</td>
              </tr>
              <tr className="border-b border-[#F2EFE6]">
                <td className="px-7 py-3.5 text-fg2" colSpan={4}>
                  Soil samples — {p.crops.length} crop{p.crops.length === 1 ? "" : "s"}
                  {quote.soil_price > 0 && <span className="text-fg3"> ({money(quote.soil_price)} each)</span>}
                </td>
                <td className="px-7 py-3.5 text-right font-mono text-forest">{money(quote.soil_total)}</td>
              </tr>
              <tr className="bg-[#F2F7EC]">
                <td className="px-7 py-4 font-display text-[17px] font-extrabold text-forest" colSpan={4}>Total due</td>
                <td className="px-7 py-4 text-right font-mono text-[20px] font-bold text-forest">{money(quote.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 border-t border-hair px-7 py-5 sm:grid-cols-3">
          {[
            { label: "Conventional inputs", value: cq.conventionalTotal },
            { label: "Organic inputs", value: cq.organicTotal },
            { label: "AgriPure program", value: cq.total, hl: true },
          ].map((x) => (
            <div key={x.label}>
              <div className="text-[12px] uppercase tracking-[0.05em] text-fg3">{x.label}</div>
              <div className={`mt-0.5 font-mono text-[20px] font-bold ${x.hl ? "text-leaf-700" : "text-fg2"}`}>{money(x.value)}</div>
            </div>
          ))}
        </div>
        <div className="px-7 pb-5 text-[15px] text-leaf-700">
          You save {money(cq.saveVsOrganic)} vs a comparable organic program ({money(cq.organicTotal)}). A soil-sample kit
          ships to your address for each crop — mail your samples to the lab and we&apos;ll formulate your program.
        </div>
      </div>

      <div className="mt-7">
        <PaymentPanel quoteId={quote.id} total={quote.total} email={quote.customer_email} number={quote.number} />
      </div>
    </div>
  );
}
