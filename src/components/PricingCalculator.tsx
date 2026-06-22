"use client";

import { useState, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import { quoteForAcres, money, DEFAULT_PROGRAM, type PricingProgram } from "@/lib/pricing";

export default function PricingCalculator({ program = DEFAULT_PROGRAM }: { program?: PricingProgram }) {
  const sixGal = program.bundles.find((b) => b.id === "6g") ?? program.bundles.at(-1);
  const [acres, setAcres] = useState(500);

  const { total, effective, organicTotal, convTotal, saveVsOrganic, rows, bundles } = useMemo(() => {
    const q = quoteForAcres(acres, program);
    return {
      rows: q.bands,
      total: q.total,
      effective: q.effective,
      organicTotal: q.organicTotal,
      convTotal: q.conventionalTotal,
      saveVsOrganic: q.saveVsOrganic,
      bundles: q.bundles,
    };
  }, [acres, program]);

  const step = (d: number) => setAcres((a) => Math.max(25, Math.min(2000, a + d * 25)));

  return (
    <div className="grid items-stretch gap-6 rounded-panel border border-hair bg-white p-7 shadow-g-md lg:grid-cols-[1fr_1fr] lg:p-9">
      {/* controls */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Acreage calculator</div>
        <h3 className="mt-2 font-display text-[26px] font-extrabold tracking-[-0.02em] text-forest">
          Price your operation
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-fg2">
          Graduated volume pricing in 25-acre increments — the per-acre rate steps down as you grow.
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="font-mono text-[44px] font-semibold leading-none text-forest">{acres.toLocaleString()}</div>
            <div className="mt-1 text-[13px] text-fg3">acres</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => step(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-hair-strong text-forest hover:bg-paper-2" aria-label="Decrease 25 acres">
              <Minus size={18} />
            </button>
            <button onClick={() => step(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-hair-strong text-forest hover:bg-paper-2" aria-label="Increase 25 acres">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <input
          type="range" min={25} max={2000} step={25} value={acres}
          onChange={(e) => setAcres(parseInt(e.target.value, 10))}
          className="mt-5 w-full accent-leaf"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-fg3">
          <span>25 ac</span><span>2,000 ac</span>
        </div>

        {/* band breakdown */}
        <div className="mt-6 overflow-hidden rounded-xl border border-hair">
          <div className="grid grid-cols-[1fr_auto_auto] bg-[#FAF8F2] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg3">
            <span>Band</span><span className="text-right">$/ac</span><span className="pl-6 text-right">Cost</span>
          </div>
          {rows.map((b) => (
            <div key={b.from} className="grid grid-cols-[1fr_auto_auto] border-t border-hair px-4 py-2 text-[13px]">
              <span className="text-fg2">{b.from}–{b.to == null ? "+" : b.to} ac · {b.acres} ac</span>
              <span className="text-right font-mono text-fg2">${b.rate}</span>
              <span className="pl-6 text-right font-mono text-forest">{money(b.cost)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* results */}
      <div className="relative overflow-hidden rounded-panel bg-forest p-7 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_50%_-10%,rgba(191,232,154,.26)_0%,rgba(0,23,6,0)_70%)]" />
        <div className="relative flex h-full flex-col">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#9FD27E]">AgriPure · {acres.toLocaleString()} acres</div>
          <div className="mt-3 font-mono text-[40px] font-semibold leading-none">{money(total)}</div>
          <div className="mt-2 text-[14px] text-[#C9DBC0]">
            <span className="font-mono text-white">{money(effective)}</span> / acre effective
            <span className="text-[#9FD27E]"> · {bundles} × {sixGal?.gallons ?? 6}-gal bundles</span>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-[14px]">
            <div className="flex justify-between"><span className="text-[#A9C4A0]">Comparable organic program</span><span className="font-mono">{money(organicTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#A9C4A0]">Conventional (synthetic)</span><span className="font-mono text-[#9FB98F]">{money(convTotal)}</span></div>
          </div>

          <div className="mt-auto rounded-xl bg-leaf/15 px-4 py-3.5 text-center">
            <div className="text-[13px] text-[#C9DBC0]">You save vs organic</div>
            <div className="font-mono text-[28px] font-bold text-leaf">{money(saveVsOrganic)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
