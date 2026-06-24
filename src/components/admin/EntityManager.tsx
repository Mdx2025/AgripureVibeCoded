"use client";

import { useState, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, X } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "select" | "switch" | "qa";
export interface Field {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean;
}
export interface Column {
  key: string;
  label: string;
  mono?: boolean;
  render?: (row: Row) => ReactNode;
}
export interface FilterCfg {
  key: string;
  label: string;
  options: string[];
}
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const field =
  "w-full rounded-[10px] border border-[#D9D6C7] px-3.5 py-2.5 text-sm outline-none focus:border-leaf bg-white";

export default function EntityManager({
  entity,
  initial,
  addLabel,
  fields,
  searchKeys,
  view = "table",
  columns = [],
  renderCard,
  filters = [],
  recurringToggle = false,
  emptyText = "No records found.",
}: {
  entity: string;
  initial: Row[];
  addLabel: string;
  fields: Field[];
  searchKeys: string[];
  view?: "table" | "cards";
  columns?: Column[];
  renderCard?: (row: Row) => ReactNode;
  filters?: FilterCfg[];
  recurringToggle?: boolean;
  emptyText?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [recurringOnly, setRecurringOnly] = useState(false);
  const [open, setOpen] = useState<false | "new" | Row>(false);
  const [draft, setDraft] = useState<Row>({});
  const [viewing, setViewing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const blank = () => {
    const d: Row = {};
    for (const f of fields) d[f.key] = f.type === "switch" ? false : f.type === "qa" ? [{ q: "", a: "" }] : "";
    return d;
  };

  const startNew = () => { setDraft(blank()); setError(""); setOpen("new"); };
  const startEdit = (row: Row) => {
    const d: Row = { ...row };
    for (const f of fields) if (f.type === "switch") d[f.key] = !!row[f.key] && row[f.key] !== 0;
    setDraft(d); setError(""); setOpen(row);
  };

  const rows = useMemo(() => {
    let list = initial;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
    }
    for (const f of filters) {
      const v = filterVals[f.key];
      if (v) list = list.filter((r) => String(r[f.key] ?? "") === v);
    }
    if (recurringToggle && recurringOnly) list = list.filter((r) => !!r.recurring && r.recurring !== 0);
    return list;
  }, [initial, search, filterVals, filters, recurringOnly, recurringToggle, searchKeys]);

  const submit = async () => {
    setBusy(true); setError("");
    const payload: Row = {};
    for (const f of fields) {
      let v = draft[f.key];
      if (f.type === "switch") v = v ? 1 : 0;
      else if (f.type === "number") v = Number(v || 0);
      else if (f.type === "qa") v = Array.isArray(v) ? v.filter((x: Row) => x.q || x.a) : [];
      payload[f.key] = v ?? "";
    }
    const editing = open !== "new" && open !== false;
    const url = editing ? `/api/admin/${entity}/${(open as Row).id}` : `/api/admin/${entity}`;
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Save failed");
    setOpen(false);
    router.refresh();
  };

  const remove = async (row: Row) => {
    if (!confirm("Delete this record?")) return;
    await fetch(`/api/admin/${entity}/${row.id}`, { method: "DELETE" });
    router.refresh();
  };

  const setQa = (i: number, key: "q" | "a", v: string, fk: string) =>
    setDraft((d) => {
      const arr = [...(d[fk] ?? [])];
      arr[i] = { ...arr[i], [key]: v };
      return { ...d, [fk]: arr };
    });

  const actionCell = (row: Row) => (
    <div className="flex items-center justify-end gap-1.5">
      <button onClick={(e) => { e.stopPropagation(); setViewing(row); }} className="rounded-full bg-[#EDF3E6] p-1.5 text-[#356A26]" title="View"><Eye size={15} /></button>
      <button onClick={(e) => { e.stopPropagation(); startEdit(row); }} className="rounded-full bg-[#E2ECF5] p-1.5 text-[#2F6FB0]" title="Edit"><Pencil size={15} /></button>
      <button onClick={(e) => { e.stopPropagation(); remove(row); }} className="rounded-full bg-[#F8E3DC] p-1.5 text-[#B23A1E]" title="Delete"><Trash2 size={15} /></button>
    </div>
  );

  return (
    <div className="rounded-panel border border-hair bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex w-[260px] items-center gap-2 rounded-full border border-hair bg-[#FAF8F2] px-4 py-2.5">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search.." className="w-full border-none bg-transparent text-sm outline-none" />
          </div>
          {filters.map((f) => (
            <select
              key={f.key}
              value={filterVals[f.key] ?? ""}
              onChange={(e) => setFilterVals((s) => ({ ...s, [f.key]: e.target.value }))}
              className="rounded-full border border-hair bg-white px-3.5 py-2.5 text-sm text-fg2"
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {recurringToggle && (
            <div className="flex rounded-full bg-[#EDEAE0] p-1 text-[13px] font-bold">
              <button onClick={() => setRecurringOnly(true)} className={`rounded-full px-3 py-1 ${recurringOnly ? "bg-leaf text-white" : "text-fg2"}`}>Recurring</button>
              <button onClick={() => setRecurringOnly(false)} className={`rounded-full px-3 py-1 ${!recurringOnly ? "bg-forest text-white" : "text-fg2"}`}>All</button>
            </div>
          )}
          <button onClick={startNew} className="btn-leaf px-5 py-2.5 text-sm">{addLabel} <Plus size={16} strokeWidth={2.4} /></button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="py-16 text-center text-sm text-fg3">{emptyText}</div>
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((row) => (
            <div key={row.id} className="group relative rounded-card border border-hair bg-white p-5 shadow-g-sm">
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => startEdit(row)} className="rounded-full bg-[#E2ECF5] p-1.5 text-[#2F6FB0]"><Pencil size={14} /></button>
                <button onClick={() => remove(row)} className="rounded-full bg-[#F8E3DC] p-1.5 text-[#B23A1E]"><Trash2 size={14} /></button>
              </div>
              {renderCard?.(row)}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-hair">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-5">{c.label}</th>
                ))}
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.06em] text-fg3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} onClick={() => setViewing(row)} className="cursor-pointer border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-3 py-3.5 text-sm text-[#3F463E] first:pl-5 ${c.mono ? "font-mono" : ""}`}>
                      {c.render ? c.render(row) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">{actionCell(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* add/edit modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,23,6,.45)] p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="ap-sc max-h-[88vh] w-[560px] max-w-full overflow-y-auto rounded-panel bg-white p-8 shadow-g-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[24px] font-black text-forest">{open === "new" ? addLabel : "Edit"}</h2>
              <button onClick={() => setOpen(false)} className="text-fg3"><X size={22} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className={f.full || f.type === "textarea" || f.type === "qa" ? "col-span-2" : ""}>
                  <label className="mb-1.5 block text-[13px] font-semibold text-fg2">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={3} value={draft[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={`${field} resize-y`} />
                  ) : f.type === "select" ? (
                    <select value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={field}>
                      <option value="">{f.placeholder ?? "Select…"}</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "switch" ? (
                    <button type="button" onClick={() => setDraft({ ...draft, [f.key]: !draft[f.key] })} className="mt-1 h-[26px] w-[46px] rounded-full p-[3px] transition-colors" style={{ background: draft[f.key] ? "#6FAE52" : "#D2CFC1" }}>
                      <div className="h-5 w-5 rounded-full bg-white shadow" style={{ transform: draft[f.key] ? "translateX(20px)" : "translateX(0)" }} />
                    </button>
                  ) : f.type === "qa" ? (
                    <div className="flex flex-col gap-2">
                      {(draft[f.key] ?? []).map((qa: Row, i: number) => (
                        <div key={i} className="grid gap-2 rounded-xl border border-hair bg-[#FAF8F2] p-2.5">
                          <input value={qa.q} placeholder="Question" onChange={(e) => setQa(i, "q", e.target.value, f.key)} className={field} />
                          <input value={qa.a} placeholder="Answer" onChange={(e) => setQa(i, "a", e.target.value, f.key)} className={field} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setDraft((d) => ({ ...d, [f.key]: [...(d[f.key] ?? []), { q: "", a: "" }] }))} className="self-start text-[13px] font-semibold text-leaf-600">+ Add question</button>
                    </div>
                  ) : (
                    <input type={f.type === "number" ? "number" : "text"} value={draft[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={field} />
                  )}
                </div>
              ))}
            </div>
            {error && <div className="mt-3 text-sm font-semibold text-[#B23A1E]">{error}</div>}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn-ghost px-6 py-2.5 text-sm">Cancel</button>
              <button onClick={submit} disabled={busy} className="btn-primary px-7 py-2.5 text-sm">{busy ? "Saving…" : open === "new" ? "Create" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* view modal */}
      {viewing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,23,6,.45)] p-4" onClick={() => setViewing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="ap-sc max-h-[88vh] w-[520px] max-w-full overflow-y-auto rounded-panel bg-white p-8 shadow-g-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[22px] font-black text-forest">Details</h2>
              <button onClick={() => setViewing(null)} className="text-fg3"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-2.5">
              {fields.map((f) => (
                <div key={f.key} className="flex justify-between gap-4 border-b border-[#F2EFE6] pb-2 text-sm">
                  <span className="text-fg3">{f.label}</span>
                  <span className="text-right font-medium text-forest">
                    {f.type === "qa"
                      ? `${(viewing[f.key] ?? []).length} question(s)`
                      : f.type === "switch"
                        ? (viewing[f.key] ? "Yes" : "No")
                        : String(viewing[f.key] ?? "—")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
