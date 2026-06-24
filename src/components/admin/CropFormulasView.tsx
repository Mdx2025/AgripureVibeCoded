"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

type Row = {
  id: string; crop: string; line: string; line_code: string;
  primary_remedy: string; potency: string; targets: string; rate: string;
};
const LINES = ["Restore", "Cleanse", "Strength", "Grow", "Protect", "Prevent", "Boost"];
const TH = "px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";
const pill = "inline-block rounded-full bg-[#E9F0E0] px-2.5 py-[3px] text-[11px] font-bold text-[#356A26]";
const sel = "rounded-full border border-hair bg-white px-3.5 py-2 text-sm text-forest outline-none focus:border-leaf";
const CAP = 300;

export default function CropFormulasView({ formulas, crops }: { formulas: Row[]; crops: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [crop, setCrop] = useState("");
  const [line, setLine] = useState("");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return formulas.filter((f) =>
      (!crop || f.crop === crop) &&
      (!line || f.line === line) &&
      (!needle || f.crop.toLowerCase().includes(needle) || f.primary_remedy.toLowerCase().includes(needle) || f.targets.toLowerCase().includes(needle)),
    );
  }, [formulas, q, crop, line]);

  const visible = filtered.slice(0, CAP);

  return (
    <div>
      <div className="mb-[18px] text-sm text-[#7A8076]">
        {formulas.length.toLocaleString()} crop-specific lab formulas imported · {crops.length} crops · 7 product lines each.{" "}
        <Link href="/admin/crop-library" className="ap-link !text-leaf-600">Open the Crop Library</Link> to view a crop&apos;s full blends or add a new one.
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-full border border-hair bg-white px-3.5 py-2">
          <Search size={16} className="text-fg3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search crop, remedy, or target…" className="w-full bg-transparent text-sm outline-none" />
        </div>
        <select className={sel} value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="">All crops</option>
          {crops.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={sel} value={line} onChange={(e) => setLine(e.target.value)}>
          <option value="">All product lines</option>
          {LINES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-card border border-hair bg-white">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              {["Crop", "Product Line", "Primary Remedy", "Potency", "Targets", "Rate", ""].map((h) => <th key={h} className={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7} className="py-14 text-center text-sm text-fg3">No formulas match.</td></tr>
            ) : visible.map((f) => (
              <tr key={f.id} onClick={() => router.push(`/admin/crop-library?crop=${encodeURIComponent(f.crop)}`)} className="cursor-pointer border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                <td className="px-6 py-3 text-sm font-semibold text-forest">{f.crop}</td>
                <td className="px-3 py-3"><span className={pill}>{f.line}</span></td>
                <td className="px-3 py-3 text-[13px] text-fg2">{f.primary_remedy || "—"}</td>
                <td className="px-3 py-3 font-mono text-[12px] text-fg2">{f.potency}</td>
                <td className="px-3 py-3 text-[12.5px] text-fg3">{f.targets || "—"}</td>
                <td className="px-3 py-3 text-[12.5px] text-fg3">{f.rate || "—"}</td>
                <td className="px-6 py-3 text-right">
                  <Link href={`/admin/crop-library?crop=${encodeURIComponent(f.crop)}`} className="ap-link inline-flex items-center gap-1 !text-leaf-600 text-[12.5px]">
                    Blend <ArrowRight size={13} strokeWidth={2.2} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > CAP && (
        <div className="mt-3 text-center text-[13px] text-fg3">
          Showing first {CAP} of {filtered.length.toLocaleString()} — refine the search or filters to narrow.
        </div>
      )}
    </div>
  );
}
