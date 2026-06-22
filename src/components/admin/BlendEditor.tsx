"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, Check, RotateCcw } from "lucide-react";
import { parseBlend, serializeBlend, totalPercent, mlFor, type BlendComponent } from "@/lib/blend";
import RemedyCombobox from "./RemedyCombobox";

export interface FormulaRow {
  id: string; crop: string; line: string; line_code: string;
  primary_remedy: string; potency: string; blend: string; targets: string;
  rate: string; method: string; stage: string; cadence: string; lab_note: string;
}

type LineState = {
  meta: FormulaRow;
  rows: BlendComponent[];
  saved: FormulaRow["blend"]; // last-saved blend, to detect dirty
  status: "" | "saving" | "ok" | "error";
  error?: string;
};

const cell = "w-full rounded-lg border border-[#D9D6C7] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-leaf";

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
}

export default function BlendEditor({ crop, formulas, remedyOptions = [] }: { crop: string; formulas: FormulaRow[]; remedyOptions?: string[] }) {
  const [lines, setLines] = useState<LineState[]>(() =>
    formulas.map((f) => ({ meta: f, rows: parseBlend(f.blend), saved: f.blend, status: "" as const })),
  );
  const [drag, setDrag] = useState<{ li: number; ri: number } | null>(null);

  const patch = (li: number, fn: (l: LineState) => LineState) =>
    setLines((prev) => prev.map((l, i) => (i === li ? fn(l) : l)));

  const setRows = (li: number, rows: BlendComponent[]) =>
    patch(li, (l) => ({ ...l, rows, status: l.status === "ok" ? "" : l.status }));

  const dirty = (l: LineState) => serializeBlend(l.rows) !== l.saved;

  const save = async (li: number) => {
    const l = lines[li];
    const blend = serializeBlend(l.rows);
    patch(li, (x) => ({ ...x, status: "saving", error: undefined }));
    const body = {
      crop,
      lineCode: l.meta.line_code,
      blend,
      // top row drives the formula's headline "primary remedy"
      primaryRemedy: l.rows[0]?.remedy ?? l.meta.primary_remedy,
      potency: l.rows[0]?.potency ?? l.meta.potency,
      targets: l.meta.targets, rate: l.meta.rate, method: l.meta.method,
      stage: l.meta.stage, cadence: l.meta.cadence, labNote: l.meta.lab_note,
    };
    const r = await fetch("/api/admin/crop-formulas", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      patch(li, (x) => ({ ...x, status: "error", error: e.error ?? "Save failed" }));
      return;
    }
    patch(li, (x) => ({
      ...x, status: "ok", saved: blend,
      meta: { ...x.meta, blend, primary_remedy: body.primaryRemedy, potency: body.potency },
    }));
  };

  const reset = (li: number) =>
    patch(li, (l) => ({ ...l, rows: parseBlend(l.saved), status: "" }));

  return (
    <div className="flex flex-col gap-5">
      {lines.map((l, li) => {
        const total = totalPercent(l.rows);
        const isDirty = dirty(l);
        return (
          <div key={l.meta.id} className="overflow-hidden rounded-panel border border-hair bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hair bg-[#FAF8F2] px-5 py-3">
              <div className="font-display text-[16px] font-extrabold text-forest">
                {l.meta.line}
                <span className="ml-2 font-mono text-[11px] font-normal text-fg3">{l.meta.line_code}</span>
                {l.meta.targets ? <span className="ml-2 text-[12px] font-normal text-fg3">· {l.meta.targets}</span> : null}
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[12px] ${Math.abs(total - 100) < 0.1 ? "text-leaf-700" : "text-[#B23A1E]"}`}>
                  Σ {total.toFixed(1)}%
                </span>
                {l.status === "ok" && !isDirty && <span className="flex items-center gap-1 text-[12px] font-semibold text-leaf-700"><Check size={14} /> Saved</span>}
                {l.status === "error" && <span className="text-[12px] font-semibold text-[#B23A1E]">{l.error}</span>}
                {isDirty && (
                  <button onClick={() => reset(li)} title="Revert" className="flex h-8 w-8 items-center justify-center rounded-lg border border-hair text-fg3 hover:bg-[#F2EFE6]">
                    <RotateCcw size={14} />
                  </button>
                )}
                <button onClick={() => save(li)} disabled={l.status === "saving" || !isDirty}
                  className="btn-primary px-4 py-1.5 text-[13px] disabled:opacity-40">
                  {l.status === "saving" ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#F2EFE6] text-left text-[11px] font-bold uppercase tracking-[0.05em] text-fg3">
                  <th className="w-8 py-2 pl-4"></th>
                  <th className="py-2 pr-3">Remedy</th>
                  <th className="w-[88px] py-2 pr-3">Potency</th>
                  <th className="w-[96px] py-2 pr-3">Amount %</th>
                  <th className="w-[150px] py-2 pr-3">Charge (3 / 6 gal)</th>
                  <th className="w-10 py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {l.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    draggable
                    onDragStart={() => setDrag({ li, ri })}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!drag || drag.li !== li || drag.ri === ri) return;
                      setRows(li, move(l.rows, drag.ri, ri));
                      setDrag({ li, ri });
                    }}
                    onDragEnd={() => setDrag(null)}
                    className={`border-b border-[#F4F2EA] ${drag && drag.li === li && drag.ri === ri ? "bg-[#F0F5E9]" : ""}`}
                  >
                    <td className="py-1.5 pl-3 align-middle">
                      <span className="flex cursor-grab items-center justify-center text-[#C4C1B2] active:cursor-grabbing"><GripVertical size={16} /></span>
                    </td>
                    <td className="py-1.5 pr-3">
                      <RemedyCombobox value={row.remedy} options={remedyOptions} placeholder="Choose a remedy…"
                        onChange={(v) => setRows(li, l.rows.map((r, i) => (i === ri ? { ...r, remedy: v } : r)))} />
                    </td>
                    <td className="py-1.5 pr-3">
                      <input className={`${cell} font-mono`} value={row.potency}
                        onChange={(e) => setRows(li, l.rows.map((r, i) => (i === ri ? { ...r, potency: e.target.value } : r)))} />
                    </td>
                    <td className="py-1.5 pr-3">
                      <input className={`${cell} font-mono`} type="number" step="0.1" min="0" value={row.percent}
                        onChange={(e) => setRows(li, l.rows.map((r, i) => (i === ri ? { ...r, percent: parseFloat(e.target.value) || 0 } : r)))} />
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[12px] text-fg3">
                      {mlFor(row.percent, 3).toFixed(1)} / {mlFor(row.percent, 6).toFixed(1)} mL
                    </td>
                    <td className="py-1.5 pr-3">
                      <button onClick={() => setRows(li, l.rows.filter((_, i) => i !== ri))}
                        title="Remove remedy" className="flex h-7 w-7 items-center justify-center rounded-lg text-[#C77] hover:bg-[#F8E3DC]">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {l.rows.length === 0 && (
                  <tr><td colSpan={6} className="py-4 pl-4 text-[13px] text-fg3">No remedies — add one below.</td></tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-4 py-2.5">
              <button onClick={() => setRows(li, [...l.rows, { remedy: "", potency: "6C", percent: 0 }])}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#C9C6B6] px-3 py-1.5 text-[13px] font-semibold text-leaf-700 hover:bg-[#FAF8F2]">
                <Plus size={14} strokeWidth={2.6} /> Add remedy
              </button>
              <button
                onClick={() => setRows(li, l.rows.map((r) => ({ ...r, percent: l.rows.length ? Math.round((100 / l.rows.length) * 10) / 10 : 0 })))}
                className="text-[12px] font-semibold text-fg3 hover:text-forest">
                Balance to 100%
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
