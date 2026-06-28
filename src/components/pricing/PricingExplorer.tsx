"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Sprout, Check, Minus, X } from "lucide-react";
import MultiCombobox from "@/components/order/MultiCombobox";
import {
  CROP_PRICING, cropLineItem, productBreakdown, quoteForCrops, money,
} from "@/lib/crop-pricing";

// Only crops we actually price can be compared.
const CROP_NAMES = [...CROP_PRICING].map((c) => c.crop).sort((a, b) => a.localeCompare(b));

const ACRE_MAX = 2000;
const clampAc = (n: number) => Math.max(1, Math.min(100000, Math.round(n) || 0));

type Step = "crops" | "acres" | "results";

export default function PricingExplorer() {
  const [step, setStep] = useState<Step>("crops");
  const [crops, setCrops] = useState<string[]>([]);
  const [acres, setAcres] = useState<Record<string, number>>({});
  const [activeCrop, setActiveCrop] = useState<string>("");

  const setCropList = (next: string[]) => {
    setCrops(next);
    setAcres((p) => Object.fromEntries(next.map((c) => [c, p[c] ?? 100])));
    if (!next.includes(activeCrop)) setActiveCrop(next[0] ?? "");
  };

  const cq = useMemo(() => quoteForCrops(acres), [acres]);
  const acresValid = crops.every((c) => (acres[c] || 0) >= 1);

  const goResults = () => { setActiveCrop(crops[0] ?? ""); setStep("results"); };

  return (
    <div>
      {/* progress */}
      <div className="mx-auto mb-10 flex max-w-[520px] items-center gap-2">
        {(["crops", "acres", "results"] as Step[]).map((s, i) => {
          const order = ["crops", "acres", "results"];
          const done = order.indexOf(step) > i;
          const on = step === s;
          return (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-[13px] font-bold ${on ? "bg-forest text-white" : done ? "bg-leaf text-white" : "bg-[#E4E1D5] text-fg3"}`}>
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[13px] font-semibold ${on ? "text-forest" : "text-fg3"}`}>
                {s === "crops" ? "Your crops" : s === "acres" ? "Acreage" : "Comparison"}
              </span>
              {i < 2 && <span className="ml-1 hidden h-px flex-1 bg-hair sm:block" />}
            </div>
          );
        })}
      </div>

      {/* STEP 1 — crops */}
      {step === "crops" && (
        <div className="mx-auto max-w-[680px] text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Transparent, per-crop pricing</div>
          <h1 className="mt-2 font-display text-[clamp(34px,6vw,52px)] font-black tracking-[-0.02em] text-forest">
            What are you growing?
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] leading-[1.6] text-fg2">
            AgriPure is priced per crop — anchored between conventional and organic input cost. Add every crop in your
            operation and we&apos;ll build a side-by-side cost comparison.
          </p>
          <div className="mx-auto mt-8 max-w-[560px] text-left">
            <MultiCombobox
              size="lg"
              value={crops}
              onChange={setCropList}
              options={CROP_NAMES}
              allowCustom={false}
              maxOptions={CROP_NAMES.length}
              listMaxH="max-h-[360px]"
              placeholder="e.g. Strawberry, Almond, Wheat…"
            />
            <p className="mt-2.5 text-center text-[13px] text-fg3">{CROP_NAMES.length} crops priced — start typing to search.</p>
          </div>
          <button
            onClick={() => crops.length && setStep("acres")}
            disabled={!crops.length}
            className="btn-primary mt-8 px-8 py-4 text-[16px] disabled:opacity-40"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2 — acreage */}
      {step === "acres" && (
        <div className="mx-auto max-w-[820px]">
          <div className="text-center">
            <h1 className="font-display text-[clamp(30px,5vw,46px)] font-black tracking-[-0.02em] text-forest">
              How many acres of each crop?
            </h1>
            <p className="mx-auto mt-3 max-w-[560px] text-[16px] leading-[1.6] text-fg2">
              Enter the exact acreage for every crop — drag the slider or type it in. Your volume discount scales with each
              crop&apos;s acreage.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {crops.map((c) => {
              const li = cropLineItem(c, acres[c] || 0);
              return (
                <div key={c} className="rounded-[16px] border border-hair bg-white p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-display text-[20px] font-extrabold text-forest">{c}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min={1} max={100000} value={acres[c] ?? 0}
                        onChange={(e) => setAcres((p) => ({ ...p, [c]: clampAc(Number(e.target.value)) }))}
                        className="w-[120px] rounded-[12px] border border-hair px-3 py-2.5 text-right font-mono text-[19px] outline-none focus:border-leaf"
                      />
                      <span className="text-[15px] text-fg3">acres</span>
                    </div>
                  </div>
                  <input
                    type="range" min={1} max={ACRE_MAX} step={1} value={Math.min(acres[c] ?? 1, ACRE_MAX)}
                    onChange={(e) => setAcres((p) => ({ ...p, [c]: Number(e.target.value) }))}
                    className="h-2 w-full accent-leaf"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-fg3"><span>1 ac</span><span>{ACRE_MAX.toLocaleString()}+ ac</span></div>
                  <div className="mt-3 flex items-baseline justify-between rounded-[10px] bg-[#F7F5EE] px-3.5 py-2.5">
                    <span className="text-[13px] font-bold uppercase tracking-[0.05em] text-leaf-700">AgriPure</span>
                    <span className="font-mono text-[18px] font-bold text-forest">{money(li.perAcre)}<span className="text-[12px] font-normal text-fg3">/ac</span></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-9 flex items-center justify-between">
            <button onClick={() => setStep("crops")} className="btn-ghost px-7 py-4 text-[16px]"><ArrowLeft size={18} /> Back</button>
            <button onClick={() => acresValid && goResults()} disabled={!acresValid} className="btn-primary px-8 py-4 text-[16px] disabled:opacity-40">
              See my comparison <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — results */}
      {step === "results" && (
        <Results crops={crops} acres={acres} cq={cq} activeCrop={activeCrop} setActiveCrop={setActiveCrop} onBack={() => setStep("acres")} />
      )}
    </div>
  );
}

const apCol = "bg-[#F2F7EC]";

// Why AgriPure earns its mid-tier price — what you get vs each alternative.
type Mark = "yes" | "no" | "partial";
const BENEFITS: { label: string; conv: Mark; org: Mark; ap: Mark }[] = [
  { label: "100% natural · OMRI-style · copper-free", conv: "no", org: "yes", ap: "yes" },
  { label: "All 6 crop functions in one system", conv: "no", org: "no", ap: "yes" },
  { label: "Custom-formulated to your crop, soil & pressure", conv: "no", org: "no", ap: "yes" },
  { label: "No synthetic residue · runoff-conscious", conv: "no", org: "yes", ap: "yes" },
  { label: "Builds plant resistance — no repeat-spray spiral", conv: "no", org: "partial", ap: "yes" },
  { label: "Restores living soil season over season", conv: "no", org: "partial", ap: "yes" },
  { label: "Qualifies your crop for the organic price premium", conv: "no", org: "yes", ap: "yes" },
  { label: "One supplier · one season-long program", conv: "no", org: "no", ap: "yes" },
];

function MarkCell({ mark }: { mark: Mark }) {
  if (mark === "yes")
    return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#E9F0E0] text-leaf-700"><Check size={17} strokeWidth={2.6} /></span>;
  if (mark === "partial")
    return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#FBEFD9] text-[#C97A06]"><Minus size={17} strokeWidth={2.6} /></span>;
  return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#F1ECE6] text-[#B23A1E]"><X size={16} strokeWidth={2.6} /></span>;
}

function Results({
  crops, acres, cq, activeCrop, setActiveCrop, onBack,
}: {
  crops: string[];
  acres: Record<string, number>;
  cq: ReturnType<typeof quoteForCrops>;
  activeCrop: string;
  setActiveCrop: (c: string) => void;
  onBack: () => void;
}) {
  const active = activeCrop && crops.includes(activeCrop) ? activeCrop : crops[0];
  const li = cropLineItem(active, acres[active] || 0);
  const rows = productBreakdown(active, acres[active] || 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Your cost comparison</div>
          <h1 className="mt-1.5 font-display text-[clamp(30px,5vw,46px)] font-black tracking-[-0.02em] text-forest">
            {crops.length} crop{crops.length === 1 ? "" : "s"} · {cq.acres.toLocaleString()} acres
          </h1>
        </div>
        <button onClick={onBack} className="btn-ghost px-6 py-3 text-[15px]"><ArrowLeft size={17} /> Edit crops &amp; acreage</button>
      </div>

      {/* summary across all crops */}
      <div className="mt-7 overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[15px]">
            <thead className="border-b border-hair bg-[#FAF8F2] text-[11.5px] uppercase tracking-[0.05em] text-fg3">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Crop</th>
                <th className="px-3 py-3 text-right font-bold">Acres</th>
                <th className="px-3 py-3 text-right font-bold">Conventional /ac</th>
                <th className="px-3 py-3 text-right font-bold">Organic /ac</th>
                <th className={`px-3 py-3 text-right font-bold ${apCol}`}>AgriPure /ac</th>
                <th className="px-3 py-3 text-right font-bold">AgriPure total</th>
                <th className="px-6 py-3 text-right font-bold">Save vs organic</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => {
                const l = cropLineItem(c, acres[c] || 0);
                const on = c === active;
                return (
                  <tr
                    key={c}
                    onClick={() => setActiveCrop(c)}
                    className={`cursor-pointer border-b border-[#F2EFE6] last:border-0 hover:bg-[#FCFBF7] ${on ? "bg-[#FCFBF7]" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-forest">{c}</span>
                      <span className="ml-2 text-[12px] text-fg3">tier {l.tier}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-fg2">{l.acres.toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-right font-mono text-fg2">{money(l.conventional)}</td>
                    <td className="px-3 py-3.5 text-right font-mono text-fg2">{money(l.organic)}</td>
                    <td className={`px-3 py-3.5 text-right font-mono font-semibold text-forest ${apCol}`}>
                      {money(l.perAcre)}{l.discount > 0 && <span className="ml-1 text-[11px] font-semibold text-leaf-700">−{Math.round(l.discount * 100)}%</span>}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-forest">{money(l.total)}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-leaf-700">{money(l.savingVsOrganic)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-hair-strong bg-[#FAF8F2]">
                <td className="px-6 py-4 font-display text-[15px] font-extrabold text-forest">All crops</td>
                <td className="px-3 py-4 text-right font-mono font-semibold text-forest">{cq.acres.toLocaleString()}</td>
                <td className="px-3 py-4 text-right font-mono text-fg2">{money(cq.conventionalTotal)}</td>
                <td className="px-3 py-4 text-right font-mono text-fg2">{money(cq.organicTotal)}</td>
                <td className={`px-3 py-4 text-right font-mono font-bold text-forest ${apCol}`}>{money(cq.effective)}/ac</td>
                <td className="px-3 py-4 text-right font-mono font-bold text-forest">{money(cq.total)}</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-leaf-700">{money(cq.saveVsOrganic)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2.5 text-[12.5px] text-fg3">
        Conventional &amp; organic figures are like-for-like input cost per acre. AgriPure reflects your volume discount at
        each crop&apos;s acreage. {crops.length > 1 && "Select a crop above (or a tab below) to see its 6-product breakdown."}
      </p>

      {/* per-crop detailed 6-product comparison */}
      <div className="mt-10">
        <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-forest">
          Cost per acre, product by product
        </h2>
        <p className="mt-1.5 text-[15px] text-fg2">AgriPure replaces all six inputs with one program. Here&apos;s how each function compares for your selected crop.</p>

        {/* crop tabs */}
        {crops.length > 1 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {crops.map((c) => {
              const on = c === active;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCrop(c)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${on ? "bg-forest text-white" : "border border-hair-strong bg-white text-fg2 hover:border-forest"}`}
                >
                  <Sprout size={14} /> {c}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-panel border border-hair bg-white shadow-g-md">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hair px-6 py-5">
            <div>
              <div className="font-display text-[20px] font-extrabold text-forest">{active} <span className="text-[14px] font-semibold text-fg3">· tier {li.tier} · {li.acres.toLocaleString()} ac</span></div>
              <div className="mt-0.5 text-[13px] text-fg3">{li.discount > 0 ? `Includes a ${Math.round(li.discount * 100)}% volume discount on AgriPure.` : "No volume discount at this acreage."}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[22px] font-bold text-forest">{money(li.perAcre)}/ac</div>
              <div className="text-[12.5px] text-leaf-700">save {money(li.savingVsOrganic)} vs organic</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[15px]">
              <thead>
                <tr className="border-b border-hair bg-[#FAF8F2] text-[11.5px] uppercase tracking-[0.05em] text-fg3">
                  <th className="px-6 py-3 text-left font-bold">Function</th>
                  <th className="px-4 py-3 text-right font-bold">Conventional</th>
                  <th className="px-4 py-3 text-right font-bold">Organic</th>
                  <th className={`px-6 py-3 text-right font-bold ${apCol}`}>AgriPure</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.key} className={i % 2 ? "bg-[#FCFBF7]" : ""}>
                    <td className="px-6 py-3">
                      <span className="font-semibold text-forest">{r.label}</span>
                      <span className="ml-2 text-[12.5px] text-fg3">{r.role}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-fg2">{money(r.conventional)}</td>
                    <td className="px-4 py-3 text-right font-mono text-fg2">{money(r.organic)}</td>
                    <td className={`px-6 py-3 text-right font-mono font-semibold text-forest ${apCol}`}>{money(r.agripure)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-hair-strong">
                  <td className="px-6 py-4 font-display text-[15px] font-extrabold text-forest">Total · per acre</td>
                  <td className="px-4 py-4 text-right font-mono text-[16px] font-semibold text-ink">{money(li.conventional)}</td>
                  <td className="px-4 py-4 text-right font-mono text-[16px] font-semibold text-ink">{money(li.organic)}</td>
                  <td className={`px-6 py-4 text-right font-mono text-[16px] font-bold text-forest ${apCol}`}>{money(li.perAcre)}</td>
                </tr>
                <tr className="bg-[#F2F7EC]">
                  <td className="px-6 py-4 font-display text-[15px] font-extrabold text-forest">{active} · {li.acres.toLocaleString()} acres</td>
                  <td className="px-4 py-4 text-right font-mono text-fg2">{money(li.conventionalTotal)}</td>
                  <td className="px-4 py-4 text-right font-mono text-fg2">{money(li.organicTotal)}</td>
                  <td className={`px-6 py-4 text-right font-mono text-[17px] font-bold text-forest ${apCol}`}>{money(li.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* why AgriPure — what the mid-tier price buys you */}
      <div className="mt-12">
        <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-forest">
          Why choose AgriPure over conventional &amp; organic
        </h2>
        <p className="mt-1.5 max-w-[680px] text-[15px] text-fg2">
          AgriPure lands between conventional and organic on price — but unlike either, it delivers all six functions
          in one custom-matched, residue-free program. Here&apos;s what that price buys that the alternatives don&apos;t.
        </p>
        <div className="mt-5 overflow-hidden rounded-panel border border-hair bg-white shadow-g-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-hair bg-[#FAF8F2]">
                  <th className="w-[46%] px-6 py-4 text-[11.5px] font-bold uppercase tracking-[0.06em] text-fg3">What you get</th>
                  <th className="px-4 py-4 text-center text-[13px] font-extrabold text-ink">Conventional</th>
                  <th className="px-4 py-4 text-center text-[13px] font-extrabold text-ink">Organic</th>
                  <th className={`px-4 py-4 text-center text-[13px] font-extrabold text-forest ${apCol}`}>AgriPure</th>
                </tr>
              </thead>
              <tbody>
                {BENEFITS.map((b, i) => (
                  <tr key={b.label} className={i % 2 ? "bg-[#FCFBF7]" : ""}>
                    <td className="px-6 py-3.5 text-[14.5px] font-medium text-[#3F463E]">{b.label}</td>
                    <td className="px-4 py-3.5 text-center"><MarkCell mark={b.conv} /></td>
                    <td className="px-4 py-3.5 text-center"><MarkCell mark={b.org} /></td>
                    <td className={`px-4 py-3.5 text-center ${apCol}`}><MarkCell mark={b.ap} /></td>
                  </tr>
                ))}
                <tr className="border-t-2 border-hair-strong">
                  <td className="px-6 py-4 font-display text-[15px] font-extrabold text-forest">Your blended price · per acre</td>
                  <td className="px-4 py-4 text-center font-mono text-[15px] font-semibold text-ink">{money(Math.round(cq.conventionalTotal / Math.max(1, cq.acres)))}</td>
                  <td className="px-4 py-4 text-center font-mono text-[15px] font-semibold text-ink">{money(Math.round(cq.organicTotal / Math.max(1, cq.acres)))}</td>
                  <td className={`px-4 py-4 text-center font-mono text-[16px] font-bold text-forest ${apCol}`}>{money(cq.effective)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-2.5 text-[12.5px] text-fg3">
          <span className="text-leaf-700">●</span> included &nbsp; <span className="text-[#C97A06]">●</span> partial &nbsp;
          <span className="text-[#B23A1E]">●</span> not offered. Blended per-acre figures are weighted across your{" "}
          {cq.acres.toLocaleString()} selected acres.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-8 py-10 text-center">
        <h2 className="m-0 font-display text-[28px] font-black tracking-[-0.02em] text-forest">Ready for an exact, custom quote?</h2>
        <p className="mx-auto mt-2.5 max-w-[520px] text-[15px] text-[#4A524B]">
          Order Now carries your crops and acreage through to a soil-matched program and a final per-acre price.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3.5">
          <Link href="/order-now" className="btn-primary px-7 py-[15px] text-[15px]">Get my custom quote <ArrowRight size={16} strokeWidth={2.2} /></Link>
          <Link href="/shop" className="btn-ghost px-7 py-[15px] text-[15px]">Shop the line</Link>
        </div>
      </div>
    </div>
  );
}
