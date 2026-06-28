"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, FlaskConical } from "lucide-react";
import BlendEditor, { type FormulaRow } from "./BlendEditor";

type Formula = FormulaRow;
const LINES = [
  { code: "RES", name: "Restore" }, { code: "CLN", name: "Cleanse" }, { code: "STR", name: "Strength" },
  { code: "GRO", name: "Grow" }, { code: "PRO", name: "Protect" }, { code: "BST", name: "Boost" },
];
const field = "w-full rounded-[10px] border border-[#D9D6C7] px-3 py-2.5 text-sm outline-none focus:border-leaf";

export default function CropLibrary({ crops, remedies = [], initialCrop = "" }: { crops: { crop: string; count: number }[]; remedies?: string[]; initialCrop?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ crop: "", lineCode: "RES", primaryRemedy: "", potency: "6C", blend: "", targets: "", rate: "", method: "", stage: "", labNote: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(
    () => crops.filter((c) => c.crop.toLowerCase().includes(query.toLowerCase())).slice(0, 10),
    [crops, query],
  );

  useEffect(() => {
    if (initialCrop) loadCrop(initialCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCrop]);

  const loadCrop = async (crop: string) => {
    setSelected(crop); setQuery(crop); setOpen(false); setLoading(true);
    const r = await fetch(`/api/admin/crop-formulas?crop=${encodeURIComponent(crop)}`);
    setFormulas(r.ok ? (await r.json()).formulas : []);
    setLoading(false);
  };

  const save = async () => {
    setBusy(true); setError("");
    const r = await fetch("/api/admin/crop-formulas", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft),
    });
    setBusy(false);
    if (!r.ok) return setError((await r.json()).error ?? "Save failed");
    setAdding(false);
    await loadCrop(draft.crop);
    setDraft({ crop: "", lineCode: "RES", primaryRemedy: "", potency: "6C", blend: "", targets: "", rate: "", method: "", stage: "", labNote: "" });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[#7A8076]">{crops.length} crops in the lab library · {crops.reduce((t, c) => t + c.count, 0)} formulas</div>
        <button onClick={() => setAdding((v) => !v)} className="btn-leaf px-5 py-2.5 text-sm"><Plus size={16} strokeWidth={2.4} /> New crop formula</button>
      </div>

      {error && <div className="mb-3 rounded-[10px] border border-[#F0C9BC] bg-[#F8E3DC] px-4 py-2.5 text-sm text-[#B23A1E]">{error}</div>}

      {adding && (
        <div className="mb-5 rounded-panel border border-hair bg-white p-6">
          <div className="mb-3 font-display text-base font-extrabold text-forest">Add / update a formula</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <input className={field} placeholder="Crop (existing or new)" value={draft.crop} onChange={(e) => setDraft({ ...draft, crop: e.target.value })} />
            <select className={field} value={draft.lineCode} onChange={(e) => setDraft({ ...draft, lineCode: e.target.value })}>
              {LINES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <input className={field} placeholder="Potency (e.g. 6C)" value={draft.potency} onChange={(e) => setDraft({ ...draft, potency: e.target.value })} />
            <input className={field} placeholder="Primary remedy" value={draft.primaryRemedy} onChange={(e) => setDraft({ ...draft, primaryRemedy: e.target.value })} />
            <input className={`md:col-span-2 ${field}`} placeholder="Targets (problems)" value={draft.targets} onChange={(e) => setDraft({ ...draft, targets: e.target.value })} />
            <textarea className={`col-span-2 md:col-span-3 ${field} resize-y`} rows={2} placeholder="Lab blend recipe (remedies, ratios, mL charges)" value={draft.blend} onChange={(e) => setDraft({ ...draft, blend: e.target.value })} />
            <input className={field} placeholder="Application rate" value={draft.rate} onChange={(e) => setDraft({ ...draft, rate: e.target.value })} />
            <input className={field} placeholder="Method" value={draft.method} onChange={(e) => setDraft({ ...draft, method: e.target.value })} />
            <input className={field} placeholder="Stage" value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value })} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={busy || !draft.crop || !draft.blend} className="btn-primary px-5 py-2 text-sm">{busy ? "Saving…" : "Save formula"}</button>
            <button onClick={() => setAdding(false)} className="btn-ghost px-5 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* search */}
      <div className="relative max-w-[480px]">
        <div className="flex items-center gap-2 rounded-[12px] border border-hair bg-white px-3.5 py-2.5 focus-within:border-leaf">
          <Search size={16} className="text-fg3" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search a crop to view its lab formulas…"
            className="w-full bg-transparent text-[15px] outline-none"
          />
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute z-30 mt-1.5 max-h-[280px] w-full overflow-y-auto rounded-[12px] border border-hair bg-white p-1.5 shadow-g-lg">
            {filtered.map((c) => (
              <button key={c.crop} onMouseDown={(e) => e.preventDefault()} onClick={() => loadCrop(c.crop)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] text-[#3F463E] hover:bg-[#FAF8F2]">
                <span>{c.crop}</span><span className="font-mono text-[11px] text-fg3">{c.count} products</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* browse-all grid (shown until a crop is opened) */}
      {!selected && !loading && (
        <div className="mt-5">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-fg3">
            {query ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}` : `All crops (${crops.length})`}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {(query ? filtered : crops).map((c) => (
              <button key={c.crop} onClick={() => loadCrop(c.crop)}
                className="flex items-center justify-between rounded-[12px] border border-hair bg-white px-4 py-3 text-left transition-colors hover:border-leaf hover:bg-[#FAF8F2]">
                <span className="truncate text-[14px] font-semibold text-forest">{c.crop}</span>
                <span className="ml-2 flex-none font-mono text-[11px] text-fg3">{c.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* results */}
      {loading && <div className="mt-6 text-sm text-fg3">Loading…</div>}
      {selected && !loading && (
        <div className="mt-6">
          <button onClick={() => { setSelected(null); setQuery(""); }} className="ap-link mb-2 block !text-fg3 text-[13px]">← All crops</button>
          <div className="mb-3 flex items-center gap-2 font-display text-[20px] font-extrabold text-forest">
            <FlaskConical size={18} className="text-leaf-700" /> {selected}
            <span className="font-mono text-[12px] font-normal text-fg3">· {formulas.length} product formulas</span>
          </div>
          <div className="mb-3 text-[12.5px] text-fg3">
            Drag remedies to reorder, edit potency or amount, add/remove rows — then Save each product. The top remedy becomes the formula&apos;s primary. Lab-only; never shown to customers.
          </div>
          {formulas.length === 0 ? (
            <div className="rounded-panel border border-hair bg-white p-6 text-sm text-fg3">No formulas yet — add one above.</div>
          ) : (
            <BlendEditor key={selected} crop={selected} formulas={formulas} remedyOptions={remedies} />
          )}
        </div>
      )}
    </div>
  );
}
