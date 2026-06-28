"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpDown, Pencil, Check, X, RotateCcw } from "lucide-react";
import { priceAtAcreage, money, type CropPricing, type PRICING_PARAMS } from "@/lib/crop-pricing";

type Params = typeof PRICING_PARAMS;

const TIER_COLORS: Record<string, string> = {
  S: "#1F7A3D", A: "#3E8E41", B: "#A07A1E", C: "#B2702A", D: "#8A8A8A",
};

type SortKey = "crop" | "tier" | "conventional" | "organic" | "list" | "premiumPct" | "savingsPct";
type Draft = { conventional: string; organic: string; list: string };

export default function CropPricingTable({
  crops, params, overrideIds = [],
}: { crops: CropPricing[]; params: Params; overrideIds?: string[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("list");
  const [dir, setDir] = useState<1 | -1>(-1);

  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ conventional: "", organic: "", list: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Server recomputes effective pricing on every refresh; mirror it locally.
  const overridden = useMemo(() => new Set(overrideIds), [overrideIds]);

  const types = useMemo(
    () => Array.from(new Set(crops.map((c) => c.cropType))).sort(),
    [crops],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = crops.filter((c) => {
      if (tier !== "all" && c.tier !== tier) return false;
      if (type !== "all" && c.cropType !== type) return false;
      if (q && !(c.crop.toLowerCase().includes(q) || c.family.toLowerCase().includes(q) || c.cropType.toLowerCase().includes(q))) return false;
      return true;
    });
    const val = (c: CropPricing) => (sort === "crop" ? c.crop : sort === "tier" ? c.tier : c[sort]);
    return rows.sort((a, b) => {
      const av = val(a), bv = val(b);
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [crops, query, tier, type, sort, dir]);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(k === "crop" || k === "tier" ? 1 : -1); }
  };

  const startEdit = (c: CropPricing) => {
    setError("");
    setEditId(c.id);
    setDraft({ conventional: String(c.conventional), organic: String(c.organic), list: String(c.list) });
  };
  const cancelEdit = () => { setEditId(null); setError(""); };

  const save = async (c: CropPricing) => {
    setSaving(true); setError("");
    try {
      const body = {
        id: c.id,
        conventional: Number(draft.conventional),
        organic: Number(draft.organic),
        list: Number(draft.list),
      };
      if ([body.conventional, body.organic, body.list].some((n) => !Number.isFinite(n) || n < 0))
        throw new Error("Enter non-negative numbers for all three prices.");
      const res = await fetch("/api/admin/crop-pricing", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not save");
      setEditId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const reset = async (c: CropPricing) => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/crop-pricing?id=${encodeURIComponent(c.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not reset");
      if (editId === c.id) setEditId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset");
    } finally {
      setSaving(false);
    }
  };

  const Th = ({ k, children, right }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={`whitespace-nowrap px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.05em] text-fg3 ${right ? "text-right" : "text-left"}`}>
      <button onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1 hover:text-forest ${right ? "flex-row-reverse" : ""} ${sort === k ? "text-forest" : ""}`}>
        {children} <ArrowUpDown size={11} className={sort === k ? "opacity-100" : "opacity-30"} />
      </button>
    </th>
  );

  const tiers = ["S", "A", "B", "C", "D"];
  const priceInput = "w-[84px] rounded-[8px] border border-leaf bg-white px-2 py-1 text-right font-mono text-[13px] text-forest outline-none focus:border-leaf-600";

  return (
    <div className="max-w-[1220px]">
      <p className="mb-5 max-w-[820px] text-sm text-[#7A8076]">
        Per-crop pricing is the source of truth for every quote. AgriPure is anchored at the midpoint between each
        crop&apos;s <strong className="text-forest">conventional</strong> and <strong className="text-forest">organic</strong> input
        cost, then volume-discounted by that crop&apos;s tier on the acreage a grower enters in <strong className="text-forest">Order
        Now</strong>. Edit the conventional, organic, or AgriPure per-acre price for any crop below — changes apply
        instantly to the Order Now estimate, the pricing explorer, and every new quote. {crops.length} crops priced.
      </p>

      {/* Model parameters */}
      <section className="mb-6 rounded-panel border border-hair bg-white p-6">
        <div className="mb-3 font-display text-[18px] font-extrabold text-forest">Model parameters</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] sm:grid-cols-3 lg:grid-cols-4">
          <Param label="Gap position" value={`${params.gapPosition * 100}% (midpoint)`} />
          <Param label="Price floor" value={money(params.priceFloor) + "/ac"} />
          <Param label="No discount ≤" value={`${params.volumeMinAcres} ac`} />
          <Param label="Saturation K" value={String(params.volumeHalfK)} />
          <Param label="Tier S cap" value={`${params.tierCap.S * 100}% · ≥ ${money(params.tierThreshold.S)}`} />
          <Param label="Tier A cap" value={`${params.tierCap.A * 100}% · ≥ ${money(params.tierThreshold.A)}`} />
          <Param label="Tier B cap" value={`${params.tierCap.B * 100}% · ≥ ${money(params.tierThreshold.B)}`} />
          <Param label="Tier C cap" value={`${params.tierCap.C * 100}% · ≥ ${money(params.tierThreshold.C)}`} />
          <Param label="Tier D cap" value={`${params.tierCap.D * 100}% (floor crops)`} />
          <Param label="3-gal bundle" value={`${params.bundle3galAcres} ac`} />
          <Param label="6-gal bundle" value={`${params.bundle6galAcres} ac`} />
          <Param label="COGS at scale" value={money(params.cogsAtScale) + "/ac"} />
        </div>
      </section>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg3" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crop, family, or type…"
            className="w-full rounded-[10px] border border-[#D9D6C7] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-leaf"
          />
        </div>
        <Select value={tier} onChange={setTier} label="Tier" options={[["all", "All tiers"], ...tiers.map((t) => [t, `Tier ${t}`] as [string, string])]} />
        <Select value={type} onChange={setType} label="Type" options={[["all", "All types"], ...types.map((t) => [t, t] as [string, string])]} />
        <span className="ml-auto text-[13px] text-fg3">
          {filtered.length} of {crops.length}{overridden.size > 0 ? ` · ${overridden.size} edited` : ""}
        </span>
      </div>

      {error && <div className="mb-3 rounded-[10px] border border-[#E7C9BC] bg-[#FBEDE6] px-4 py-2.5 text-[13px] font-semibold text-[#B23A1E]">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto rounded-panel border border-hair bg-white">
        <table className="w-full min-w-[1040px] text-[14px]">
          <thead className="border-b border-hair bg-[#FAF8F2]">
            <tr>
              <Th k="crop">Crop</Th>
              <Th k="tier">Tier</Th>
              <Th k="conventional" right>Conventional</Th>
              <Th k="organic" right>Organic</Th>
              <Th k="list" right>AgriPure /ac</Th>
              <Th k="premiumPct" right>vs Conv.</Th>
              <Th k="savingsPct" right>vs Org.</Th>
              <th className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.05em] text-fg3">@250 ac</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.05em] text-fg3">@1000 ac</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.05em] text-fg3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const editing = editId === c.id;
              const isOverridden = overridden.has(c.id);
              return (
                <tr key={c.id} className={`border-b border-[#F2EFE6] last:border-0 ${editing ? "bg-[#F3F7EE]" : "hover:bg-[#FCFBF7]"}`}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 font-semibold text-forest">
                      {c.crop}
                      {isOverridden && (
                        <span className="rounded-full bg-[#E9F0E0] px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] text-leaf-700">edited</span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-fg3">{c.cropType}{c.industry ? ` · ${c.industry}` : ""}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-black text-white" style={{ background: TIER_COLORS[c.tier] }}>{c.tier}</span>
                  </td>

                  {editing ? (
                    <>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} value={draft.conventional} onChange={(e) => setDraft((d) => ({ ...d, conventional: e.target.value }))} className={priceInput} />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} value={draft.organic} onChange={(e) => setDraft((d) => ({ ...d, organic: e.target.value }))} className={priceInput} />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} value={draft.list} onChange={(e) => setDraft((d) => ({ ...d, list: e.target.value }))} className={priceInput} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2.5 text-right font-mono text-fg2">{money(c.conventional)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-fg2">{money(c.organic)}</td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-forest">{money(c.list)}</td>
                    </>
                  )}

                  <td className="px-3 py-2.5 text-right font-mono text-[#B2702A]">+{c.premiumPct}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-leaf-700">{c.savingsPct}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-fg3">{money(priceAtAcreage(c, 250))}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-fg3">{money(priceAtAcreage(c, 1000))}</td>

                  <td className="px-3 py-2.5">
                    {editing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => save(c)} disabled={saving} title="Save" className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white hover:bg-leaf-700 disabled:opacity-50">
                          <Check size={14} strokeWidth={2.6} />
                        </button>
                        <button onClick={cancelEdit} disabled={saving} title="Cancel" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-hair-strong text-fg2 hover:border-forest">
                          <X size={14} strokeWidth={2.4} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => startEdit(c)} title="Edit prices" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-hair-strong text-fg2 hover:border-leaf hover:text-forest">
                          <Pencil size={13} strokeWidth={2.2} />
                        </button>
                        {isOverridden && (
                          <button onClick={() => reset(c)} disabled={saving} title="Reset to default" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-hair-strong text-fg3 hover:border-[#B2702A] hover:text-[#B2702A]">
                            <RotateCcw size={13} strokeWidth={2.2} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm text-fg3">No crops match your filters.</div>}
      </div>
      <p className="mt-3 text-[12.5px] text-fg3">
        Volume columns apply Formula 3 — a shallow saturating curve capped at each crop&apos;s tier cap (production is
        hand-made, so discounts stay shallow). All figures are $/acre. <span className="text-[#B2702A]">vs Conv.</span> is the
        AgriPure premium over conventional; <span className="text-leaf-700">vs Org.</span> is the saving against organic —
        both recalculated automatically when you edit a price.
      </p>
    </div>
  );
}

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.05em] text-fg3">{label}</div>
      <div className="mt-0.5 font-mono text-[13.5px] font-semibold text-forest">{value}</div>
    </div>
  );
}

function Select({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: [string, string][] }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-fg3">
      <span className="sr-only">{label}</span>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-[#D9D6C7] bg-white px-3 py-2.5 text-sm text-forest outline-none focus:border-leaf"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
