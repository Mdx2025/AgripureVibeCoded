"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, ArrowLeft, ImageIcon } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import type { ProductRow } from "@/lib/repo";

const GROUPS = ["Soil", "Growth", "Protection", "Yield"];
const TH = "px-2 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";
const field = "w-full rounded-[8px] border border-[#D9D6C7] px-3 py-2 text-sm outline-none focus:border-leaf";
const lbl = "block text-[11px] font-bold uppercase tracking-[0.06em] text-fg3 mb-1.5";

const emptyDraft = { name: "", category: "", type: "", group: "Soil", price: "", stock: "", sku: "", blurb: "" };

// editable fields surfaced in the full editor
type Form = {
  name: string; category: string; type: string; group: string; price: string; stock: string; sku: string;
  tagline: string; blurb: string; long: string; npk: string; ph: string; omri: string; rate: string;
  image: string; crops: string;
};
const toForm = (p: ProductRow): Form => ({
  name: p.name, category: p.category, type: p.type, group: p.group,
  price: String(p.price), stock: String(p.stock), sku: p.sku,
  tagline: p.tagline, blurb: p.blurb, long: p.long, npk: p.npk, ph: p.ph, omri: p.omri, rate: p.rate,
  image: p.image, crops: p.crops.join(", "),
});

export default function ProductsManager({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const openEdit = (p: ProductRow) => { setEditing(p); setForm(toForm(p)); setError(""); };
  const setF = (k: keyof Form, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const saveEdit = async () => {
    if (!editing || !form) return;
    setBusy(true); setError("");
    const res = await fetch(`/api/products/${editing.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Save failed");
    setEditing(null); setForm(null);
    router.refresh();
  };

  const addProduct = async () => {
    setBusy(true); setError("");
    const res = await fetch("/api/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, price: Number(draft.price), stock: Number(draft.stock || 0) }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json()).error ?? "Could not add product");
    setDraft({ ...emptyDraft }); setAdding(false);
    router.refresh();
  };

  // ---------- FULL EDITOR ----------
  if (editing && form) {
    const previewSrc = form.image?.trim() || bottleSrc(editing.id);
    return (
      <div className="max-w-[940px]">
        <button onClick={() => { setEditing(null); setForm(null); }} className="ap-link mb-4 flex items-center gap-1.5 !text-fg3 text-[13px]">
          <ArrowLeft size={15} /> All products
        </button>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[22px] font-extrabold text-forest">Edit · {editing.name}</h2>
          <div className="flex items-center gap-3">
            {error && <span className="text-[13px] font-semibold text-[#B23A1E]">{error}</span>}
            <button onClick={saveEdit} disabled={busy} className="btn-primary px-6 py-2.5 text-sm">{busy ? "Saving…" : "Save changes"}</button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          {/* media */}
          <div className="rounded-panel border border-hair bg-white p-5">
            <div className="mb-3 flex h-[230px] items-center justify-center overflow-hidden rounded-xl border border-hair"
              style={{ background: `radial-gradient(circle at 50% 65%, ${editing.accentSoft} 0%, #FAF8F2 72%)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc} alt={form.name} className="max-h-[200px] w-auto max-w-[80%] object-contain" />
            </div>
            <label className={lbl}><ImageIcon size={12} className="mb-0.5 mr-1 inline" /> Photo URL</label>
            <input className={field} placeholder="/assets/bottles/restore.png or https://…" value={form.image} onChange={(e) => setF("image", e.target.value)} />
            <p className="mt-1.5 text-[11px] text-fg3">Paste an image URL or path. Leave blank to use the default bottle render.</p>
          </div>

          {/* fields */}
          <div className="flex flex-col gap-5">
            <section className="rounded-panel border border-hair bg-white p-5">
              <div className="mb-3 font-display text-[15px] font-extrabold text-forest">Listing</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={lbl}>Name</label><input className={field} value={form.name} onChange={(e) => setF("name", e.target.value)} /></div>
                <div><label className={lbl}>Category</label><input className={field} value={form.category} onChange={(e) => setF("category", e.target.value)} /></div>
                <div><label className={lbl}>Type</label><input className={field} value={form.type} onChange={(e) => setF("type", e.target.value)} /></div>
                <div><label className={lbl}>Group</label>
                  <select className={field} value={form.group} onChange={(e) => setF("group", e.target.value)}>
                    {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={lbl}>Tagline</label><input className={field} value={form.tagline} onChange={(e) => setF("tagline", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Short blurb (card)</label><input className={field} value={form.blurb} onChange={(e) => setF("blurb", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Full description</label><textarea rows={4} className={`${field} resize-y`} value={form.long} onChange={(e) => setF("long", e.target.value)} /></div>
              </div>
            </section>

            <section className="rounded-panel border border-hair bg-white p-5">
              <div className="mb-3 font-display text-[15px] font-extrabold text-forest">Specs &amp; formulated for</div>
              <div className="grid gap-3 sm:grid-cols-4">
                <div><label className={lbl}>N-P-K</label><input className={field} value={form.npk} onChange={(e) => setF("npk", e.target.value)} /></div>
                <div><label className={lbl}>pH</label><input className={field} value={form.ph} onChange={(e) => setF("ph", e.target.value)} /></div>
                <div><label className={lbl}>Cert.</label><input className={field} value={form.omri} onChange={(e) => setF("omri", e.target.value)} /></div>
                <div><label className={lbl}>App. rate</label><input className={field} value={form.rate} onChange={(e) => setF("rate", e.target.value)} /></div>
                <div className="sm:col-span-4"><label className={lbl}>Formulated for (comma-separated)</label>
                  <input className={field} placeholder="Vineyards, Orchards, Row crops" value={form.crops} onChange={(e) => setF("crops", e.target.value)} />
                </div>
              </div>
            </section>

            <section className="rounded-panel border border-hair bg-white p-5">
              <div className="mb-3 font-display text-[15px] font-extrabold text-forest">Inventory &amp; code</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><label className={lbl}>List price ($)</label><input type="number" className={`${field} font-mono`} value={form.price} onChange={(e) => setF("price", e.target.value)} /></div>
                <div><label className={lbl}>Stock</label><input type="number" className={`${field} font-mono`} value={form.stock} onChange={(e) => setF("stock", e.target.value)} /></div>
                <div><label className={lbl}>SKU</label><input className={`${field} font-mono`} value={form.sku} onChange={(e) => setF("sku", e.target.value)} /></div>
              </div>
              <p className="mt-3 text-[12px] text-fg3">Storefront pricing is set in <b>Pricing Program</b> (per-acre bundles). The list price here is the catalog reference.</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ---------- LIST ----------
  return (
    <div>
      <div className="mb-[18px] flex items-center justify-between">
        <div className="text-sm text-[#7A8076]">{products.length} products · edits publish straight to the storefront</div>
        <button onClick={() => setAdding((v) => !v)} className="btn-primary px-5 py-[11px] text-sm"><Plus size={17} strokeWidth={2} /> Add product</button>
      </div>

      {error && <div className="mb-3 rounded-[10px] border border-[#F0C9BC] bg-[#F8E3DC] px-4 py-2.5 text-sm text-[#B23A1E]">{error}</div>}

      {adding && (
        <div className="mb-4 rounded-card border border-hair bg-white p-5">
          <div className="mb-3 font-display text-base font-extrabold text-forest">New product</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <input className={field} placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className={field} placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            <input className={field} placeholder="Type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} />
            <select className={field} value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })}>
              {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <input className={field} type="number" placeholder="List price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            <input className={field} type="number" placeholder="Stock" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} />
            <input className={field} placeholder="SKU (optional)" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} />
            <input className={field} placeholder="Blurb (optional)" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addProduct} disabled={busy} className="btn-primary px-5 py-2 text-sm">{busy ? "Saving…" : "Create product"}</button>
            <button onClick={() => { setAdding(false); setError(""); }} className="btn-ghost px-5 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-hair bg-white">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              <th className={TH}>Product</th><th className={TH}>SKU</th><th className={TH}>Category</th>
              <th className={TH}>List price</th><th className={TH}>Stock</th><th className={TH}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const low = p.stock < 40;
              return (
                <tr key={p.id} onClick={() => openEdit(p)} className="cursor-pointer border-b border-[#F2EFE6] hover:bg-[#FAF8F2]">
                  <td className="px-6 py-[13px]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-[52px] w-[42px] flex-none items-center justify-center rounded-[9px]"
                        style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image?.trim() || bottleSrc(p.id)} alt={p.name} className="h-12 w-auto object-contain" />
                      </div>
                      <div>
                        <div className="font-mono text-[11px]" style={{ color: p.accent }}>No. {p.num}</div>
                        <div className="font-display text-base font-extrabold text-forest">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-[13px] font-mono text-[12.5px] text-[#7A8076]">{p.sku}</td>
                  <td className="px-2 py-[13px] text-[13px] text-fg2">{p.type}</td>
                  <td className="px-2 py-[13px] font-mono text-sm text-forest">${p.price}</td>
                  <td className="px-2 py-[13px]">
                    <span className="inline-block rounded-full px-2.5 py-[3px] text-xs font-bold"
                      style={low ? { color: "#C97A06", background: "#FBEFD9" } : { color: "#356A26", background: "#E9F0E0" }}>
                      {p.stock} {low ? "· low" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-[13px] text-right">
                    <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1.5 rounded-full border border-hair px-3.5 py-1.5 text-[13px] font-semibold text-forest hover:bg-[#F2EFE6]">
                      <Pencil size={13} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
