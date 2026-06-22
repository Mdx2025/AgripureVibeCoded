"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Rollup = { remedy: string; potency: string; formulaCount: number; cropCount: number; lines: string; sampleTargets: string };
const TH = "px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";

export default function CropRemediesView({ remedies }: { remedies: Rollup[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return remedies.filter((r) => !n || r.remedy.toLowerCase().includes(n) || r.lines.toLowerCase().includes(n) || (r.sampleTargets || "").toLowerCase().includes(n));
  }, [remedies, q]);

  return (
    <div>
      <div className="mb-[18px] text-sm text-[#7A8076]">
        {remedies.length} distinct remedies in use across the imported crop formulas (potentized homeopathic blends).
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-full border border-hair bg-white px-3.5 py-2 max-w-[420px]">
        <Search size={16} className="text-fg3" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a remedy, product line, or target…" className="w-full bg-transparent text-sm outline-none" />
      </div>

      <div className="overflow-hidden rounded-card border border-hair bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              {["Remedy", "Potency", "Formulas", "Crops", "Product Lines", "Sample Target"].map((h) => <th key={h} className={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-14 text-center text-sm text-fg3">No remedies match.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.remedy + r.potency} className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                <td className="px-6 py-3 text-sm font-semibold text-forest">{r.remedy}</td>
                <td className="px-3 py-3 font-mono text-[12px] text-fg2">{r.potency}</td>
                <td className="px-3 py-3 font-mono text-sm text-fg2">{r.formulaCount.toLocaleString()}</td>
                <td className="px-3 py-3 font-mono text-sm text-fg2">{r.cropCount.toLocaleString()}</td>
                <td className="px-3 py-3 text-[12.5px] text-fg3">{r.lines}</td>
                <td className="px-3 py-3 text-[12.5px] text-fg3">{r.sampleTargets || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
