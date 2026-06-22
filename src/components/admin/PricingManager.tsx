"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { bundleQuote, money, type PricingProgram, type PriceTier, type PricingBundle } from "@/lib/pricing";

const field = "rounded-[8px] border border-[#D9D6C7] px-3 py-2 text-sm outline-none focus:border-leaf";
const num = `${field} w-[110px] font-mono`;

export default function PricingManager({ initial }: { initial: PricingProgram }) {
  const [program, setProgram] = useState<PricingProgram>(initial);
  const [status, setStatus] = useState<"" | "saving" | "ok" | "error">("");
  const [error, setError] = useState("");

  const set = (p: Partial<PricingProgram>) => { setProgram((x) => ({ ...x, ...p })); setStatus(""); };
  const setTier = (i: number, t: Partial<PriceTier>) =>
    set({ tiers: program.tiers.map((row, j) => (j === i ? { ...row, ...t } : row)) });
  const setBundle = (i: number, b: Partial<PricingBundle>) =>
    set({ bundles: program.bundles.map((row, j) => (j === i ? { ...row, ...b } : row)) });

  const preview = useMemo(() => program.bundles.map((b) => bundleQuote(b, program)), [program]);

  const save = async () => {
    setStatus("saving"); setError("");
    const r = await fetch("/api/admin/pricing", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(program),
    });
    if (!r.ok) { setStatus("error"); setError((await r.json().catch(() => ({}))).error ?? "Save failed"); return; }
    setProgram((await r.json()).program);
    setStatus("ok");
  };

  return (
    <div className="max-w-[920px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[560px] text-sm text-[#7A8076]">
          This is the single source of truth for per-acre pricing. The Products page bundles, the Pricing page
          calculator, and every new custom quote read these numbers and update the moment you save.
        </p>
        <div className="flex items-center gap-3">
          {status === "ok" && <span className="flex items-center gap-1 text-[13px] font-semibold text-leaf-700"><Check size={15} /> Saved</span>}
          {status === "error" && <span className="text-[13px] font-semibold text-[#B23A1E]">{error}</span>}
          <button onClick={save} disabled={status === "saving"} className="btn-primary px-6 py-2.5 text-sm">
            {status === "saving" ? "Saving…" : "Save pricing"}
          </button>
        </div>
      </div>

      {/* Graduated per-acre tiers */}
      <section className="mb-6 rounded-panel border border-hair bg-white p-6">
        <div className="mb-1 font-display text-[18px] font-extrabold text-forest">Graduated per-acre tiers</div>
        <p className="mb-4 text-[13px] text-fg3">Banded like tax brackets — each acre is charged at the rate for its band. Leave the last tier&apos;s &ldquo;To&rdquo; blank for &ldquo;and up&rdquo;.</p>
        <div className="overflow-hidden rounded-xl border border-hair">
          <div className="grid grid-cols-[1fr_1fr_1fr_44px] gap-px bg-hair">
            {["From (ac)", "To (ac)", "Rate ($/ac)", ""].map((h, i) => (
              <div key={i} className="bg-[#FAF8F2] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">{h}</div>
            ))}
            {program.tiers.map((t, i) => (
              <FragmentRow key={i}>
                <div className="bg-white px-3 py-2">
                  <input className={num} type="number" value={t.from} onChange={(e) => setTier(i, { from: Number(e.target.value) })} />
                </div>
                <div className="bg-white px-3 py-2">
                  <input className={num} type="number" placeholder="∞ (and up)" value={t.to ?? ""} onChange={(e) => setTier(i, { to: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
                <div className="bg-white px-3 py-2">
                  <input className={num} type="number" value={t.rate} onChange={(e) => setTier(i, { rate: Number(e.target.value) })} />
                </div>
                <div className="flex items-center justify-center bg-white">
                  <button onClick={() => set({ tiers: program.tiers.filter((_, j) => j !== i) })} title="Remove tier" className="text-[#C77] hover:text-[#B23A1E]"><Trash2 size={15} /></button>
                </div>
              </FragmentRow>
            ))}
          </div>
        </div>
        <button
          onClick={() => set({ tiers: [...program.tiers, { from: program.tiers.at(-1)?.to ?? 0, to: null, rate: program.tiers.at(-1)?.rate ?? 0 }] })}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-[#C9C6B6] px-3 py-1.5 text-[13px] font-semibold text-leaf-700 hover:bg-[#FAF8F2]">
          <Plus size={14} strokeWidth={2.6} /> Add tier
        </button>
      </section>

      {/* Benchmarks */}
      <section className="mb-6 rounded-panel border border-hair bg-white p-6">
        <div className="mb-4 font-display text-[18px] font-extrabold text-forest">Comparison benchmarks ($/acre)</div>
        <div className="flex flex-wrap gap-6">
          <label className="text-[13px] font-semibold text-fg2">Organic program
            <input className={`${num} mt-1.5 block`} type="number" value={program.organicPerAc} onChange={(e) => set({ organicPerAc: Number(e.target.value) })} />
          </label>
          <label className="text-[13px] font-semibold text-fg2">Conventional (synthetic)
            <input className={`${num} mt-1.5 block`} type="number" value={program.conventionalPerAc} onChange={(e) => set({ conventionalPerAc: Number(e.target.value) })} />
          </label>
        </div>
      </section>

      {/* Bundles */}
      <section className="rounded-panel border border-hair bg-white p-6">
        <div className="mb-1 font-display text-[18px] font-extrabold text-forest">Bundles (3 &amp; 6 gallon)</div>
        <p className="mb-4 text-[13px] text-fg3">Each bundle covers a set acreage; its price is derived from the tiers above. Shown on the Products &amp; Pricing pages.</p>
        <div className="flex flex-col gap-3">
          {program.bundles.map((b, i) => (
            <div key={i} className="grid items-end gap-3 rounded-xl border border-hair bg-[#FCFBF7] p-4 md:grid-cols-[1.4fr_0.7fr_0.7fr_1.6fr_auto]">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">Label
                <input className={`${field} mt-1 block w-full`} value={b.label} onChange={(e) => setBundle(i, { label: e.target.value })} />
              </label>
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">Gallons
                <input className={`${field} mt-1 block w-full font-mono`} type="number" value={b.gallons} onChange={(e) => setBundle(i, { gallons: Number(e.target.value) })} />
              </label>
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">Covers (ac)
                <input className={`${field} mt-1 block w-full font-mono`} type="number" value={b.acres} onChange={(e) => setBundle(i, { acres: Number(e.target.value) })} />
              </label>
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">Note
                <input className={`${field} mt-1 block w-full`} value={b.note} onChange={(e) => setBundle(i, { note: e.target.value })} />
              </label>
              <div className="flex items-center gap-3 pb-1">
                <div className="text-right">
                  <div className="font-mono text-[15px] font-semibold text-forest">{money(preview[i]?.total ?? 0)}</div>
                  <div className="font-mono text-[11px] text-leaf-700">{money(preview[i]?.perAcre ?? 0)}/ac</div>
                </div>
                <label className="flex items-center gap-1 text-[11px] text-fg3"><input type="checkbox" checked={!!b.best} onChange={(e) => setBundle(i, { best: e.target.checked })} /> Best</label>
                <button onClick={() => set({ bundles: program.bundles.filter((_, j) => j !== i) })} title="Remove bundle" className="text-[#C77] hover:text-[#B23A1E]"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => set({ bundles: [...program.bundles, { id: `b${program.bundles.length + 1}`, label: "New Bundle", gallons: 3, acres: 25, note: "" }] })}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-[#C9C6B6] px-3 py-1.5 text-[13px] font-semibold text-leaf-700 hover:bg-[#FAF8F2]">
          <Plus size={14} strokeWidth={2.6} /> Add bundle
        </button>
      </section>
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
