"use client";

import { useState, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import { CROP_PRICING, cropLineItem, money } from "@/lib/crop-pricing";

// Alphabetical crop list for the picker.
const CROPS = [...CROP_PRICING].sort((a, b) => a.crop.localeCompare(b.crop));

export default function PricingCalculator() {
  const [cropName, setCropName] = useState("Strawberry");
  const [acres, setAcres] = useState(250);

  const li = useMemo(() => cropLineItem(cropName, acres), [cropName, acres]);
  const step = (d: number) => setAcres((a) => Math.max(25, Math.min(2000, a + d * 25)));

  return (
    <div className="grid items-stretch gap-6 rounded-panel border border-hair bg-white p-7 shadow-g-md lg:grid-cols-[1fr_1fr] lg:p-9">
      {/* controls */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Per-crop calculator</div>
        <h3 className="mt-2 font-display text-[26px] font-extrabold tracking-[-0.02em] text-forest">
          Price your crop
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-fg2">
          Pricing is set per crop — anchored between conventional and organic input cost — with a volume discount on
          that crop&apos;s acreage.
        </p>

        <label className="mt-6 block text-[12px] font-bold uppercase tracking-[0.08em] text-fg3">
          Crop
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="mt-1.5 block w-full rounded-[12px] border border-hair bg-white px-4 py-3 text-[16px] font-semibold text-forest outline-none focus:border-leaf"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.crop}>{c.crop} · tier {c.tier}</option>
            ))}
          </select>
        </label>

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

        {/* per-acre comparison */}
        <div className="mt-6 overflow-hidden rounded-xl border border-hair">
          <div className="grid grid-cols-[1fr_auto] bg-[#FAF8F2] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg3">
            <span>Per acre</span><span className="text-right">$/ac</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] border-t border-hair px-4 py-2 text-[13px]">
            <span className="text-fg2">Conventional (synthetic)</span>
            <span className="text-right font-mono text-fg2">{li.unknown ? "—" : money(li.conventional)}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] border-t border-hair px-4 py-2 text-[13px]">
            <span className="text-fg2">Organic</span>
            <span className="text-right font-mono text-fg2">{li.unknown ? "—" : money(li.organic)}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] border-t border-hair bg-[#F2F7EC] px-4 py-2 text-[13px]">
            <span className="font-semibold text-forest">AgriPure {li.discount > 0 && <span className="text-leaf-700">(−{Math.round(li.discount * 100)}% volume)</span>}</span>
            <span className="text-right font-mono font-semibold text-forest">{money(li.perAcre)}</span>
          </div>
        </div>
      </div>

      {/* results */}
      <div className="relative overflow-hidden rounded-panel bg-forest p-7 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_50%_-10%,rgba(191,232,154,.26)_0%,rgba(0,23,6,0)_70%)]" />
        <div className="relative flex h-full flex-col">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#9FD27E]">{li.crop} · {acres.toLocaleString()} acres</div>
          <div className="mt-3 font-mono text-[40px] font-semibold leading-none">{money(li.total)}</div>
          <div className="mt-2 text-[14px] text-[#C9DBC0]">
            <span className="font-mono text-white">{money(li.perAcre)}</span> / acre
            {!li.unknown && <span className="text-[#9FD27E]"> · tier {li.tier}</span>}
          </div>

          <div className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-[14px]">
            <div className="flex justify-between"><span className="text-[#A9C4A0]">Comparable organic program</span><span className="font-mono">{li.unknown ? "—" : money(li.organicTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#A9C4A0]">Conventional (synthetic)</span><span className="font-mono text-[#9FB98F]">{li.unknown ? "—" : money(li.conventionalTotal)}</span></div>
          </div>

          <div className="mt-auto rounded-xl bg-leaf/15 px-4 py-3.5 text-center">
            <div className="text-[13px] text-[#C9DBC0]">You save vs organic</div>
            <div className="font-mono text-[28px] font-bold text-leaf">{li.unknown ? "—" : money(li.savingVsOrganic)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
