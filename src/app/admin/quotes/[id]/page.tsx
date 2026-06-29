import { notFound } from "next/navigation";
import Link from "next/link";
import { FlaskConical, AlertTriangle } from "lucide-react";
import { getQuote, getCropFormulas } from "@/lib/repo";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function LabSheetPage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id);
  if (!quote) return notFound();
  const p = quote.payload;

  const crops = await Promise.all(p.crops.map(async (crop) => ({
    crop,
    acres: p.acres[crop] || 0,
    formulas: await getCropFormulas(crop),
    soil: p.soilByCrop?.[crop] || [],
    weeds: p.weedsByCrop?.[crop] || [],
    plantHealth: p.plantHealthByCrop?.[crop] || [],
    pests: p.pestsByCrop[crop] || [],
    diseases: p.diseasesByCrop[crop] || [],
    yieldLoss: !!p.yieldByCrop[crop],
  })));

  return (
    <div className="mx-auto max-w-[1000px]">
      <Link href="/admin/quotes" className="ap-link !text-fg3 text-[13px]">← All quotes</Link>

      {/* header */}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-[26px] font-semibold text-forest">{quote.number}</h1>
          <div className="mt-1 text-[14px] text-fg3">
            {quote.customer_name} · {p.customer.business} · {quote.customer_email} · {p.customer.phone}
          </div>
          <div className="text-[13px] text-fg3">{p.customer.address}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[24px] font-semibold text-forest">{money(quote.total)}</div>
          <div className="text-[13px] text-fg3">{quote.acres.toLocaleString()} ac · {quote.status}</div>
        </div>
      </div>

      {/* lab-only banner */}
      <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-[#C7CBB8] bg-[#FBEFD9] px-4 py-3 text-[13px] font-semibold text-[#8a5a00]">
        <FlaskConical size={16} /> Lab formulation sheet — internal only. The customer never sees these blends.
      </div>

      {/* per crop */}
      <div className="mt-6 flex flex-col gap-6">
        {crops.map((c) => (
          <div key={c.crop} className="overflow-hidden rounded-panel border border-hair bg-white">
            <div className="flex items-center justify-between border-b border-hair bg-[#FAF8F2] px-6 py-4">
              <div>
                <div className="font-display text-[20px] font-extrabold text-forest">{c.crop}</div>
                <div className="mt-0.5 text-[12px] text-fg3">
                  {c.acres.toLocaleString()} ac
                  {c.soil.length ? ` · soil: ${c.soil.join(", ")}` : ""}
                  {c.weeds.length ? ` · weeds: ${c.weeds.join(", ")}` : ""}
                  {c.plantHealth.length ? ` · plant health: ${c.plantHealth.join(", ")}` : ""}
                  {c.pests.length ? ` · pests: ${c.pests.join(", ")}` : ""}
                  {c.diseases.length ? ` · disease: ${c.diseases.join(", ")}` : ""}
                  {c.yieldLoss ? " · yield loss reported" : ""}
                </div>
              </div>
              <span className="font-mono text-[12px] text-fg3">{c.formulas.length}/6 products</span>
            </div>

            {c.formulas.length === 0 ? (
              <div className="flex items-center gap-2.5 px-6 py-5 text-[14px] text-[#B23A1E]">
                <AlertTriangle size={16} /> No formula on file for <b>{c.crop}</b> — create one in the{" "}
                <Link href="/admin/crop-library" className="ap-link !text-leaf-600">Crop Library</Link>.
              </div>
            ) : (
              <div className="divide-y divide-[#F2EFE6]">
                {c.formulas.map((f) => (
                  <div key={f.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-display text-[15px] font-extrabold text-forest">
                        {f.line} <span className="font-mono text-[11px] font-normal text-fg3">· {f.primary_remedy} {f.potency}</span>
                      </div>
                      <div className="font-mono text-[11px] text-fg3">{f.targets}</div>
                    </div>
                    <div className="mt-2 rounded-[10px] border border-hair bg-[#FCFBF7] px-3.5 py-2.5 font-mono text-[12.5px] leading-[1.7] text-[#3F463E]">
                      {f.blend}
                    </div>
                    <div className="mt-1.5 text-[11.5px] text-fg3">
                      {f.rate} · {f.method} · {f.stage}
                      {f.lab_note ? ` — note: ${f.lab_note}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
