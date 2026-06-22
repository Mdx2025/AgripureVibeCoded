"use client";

import { useMemo, useState } from "react";
import { Eye, X } from "lucide-react";
import StatusPill from "@/components/admin/StatusPill";
import type { OrderRow } from "@/lib/repo";

const TH =
  "px-2 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";

const PAYMENTS = ["Paid", "Pending", "Refunded", "Failed"];
const LAB = ["Queued", "In Production", "Completed", "Shipped", "Cancelled"];

const PAYMENT_STYLE: Record<string, { color: string; background: string }> = {
  Paid: { color: "#356A26", background: "#E9F0E0" },
  Pending: { color: "#C97A06", background: "#FBEFD9" },
  Refunded: { color: "#2F6FB0", background: "#E2ECF5" },
  Failed: { color: "#B23A1E", background: "#F8E3DC" },
};
const LAB_STYLE: Record<string, { color: string; background: string }> = {
  Queued: { color: "#5A6157", background: "#F0EDE3" },
  "In Production": { color: "#2F6FB0", background: "#E2ECF5" },
  Completed: { color: "#356A26", background: "#E9F0E0" },
  Shipped: { color: "#538B3C", background: "#E9F0E0" },
  Cancelled: { color: "#B23A1E", background: "#F8E3DC" },
};
const Pill = ({ text, map }: { text: string; map: Record<string, { color: string; background: string }> }) => (
  <span className="inline-block rounded-full px-3 py-[5px] text-xs font-bold" style={map[text] ?? { color: "#5A6157", background: "#F0EDE3" }}>
    {text}
  </span>
);

const amountVal = (t: string) => Number(String(t).replace(/[^0-9.]/g, "")) || 0;

export default function OrdersTable({ orders, compact = false }: { orders: OrderRow[]; compact?: boolean }) {
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("");
  const [lab, setLab] = useState("");
  const [amountSort, setAmountSort] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [recurringOnly, setRecurringOnly] = useState(false);
  const [view, setView] = useState<OrderRow | null>(null);

  const rows = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => [o.id, o.customer, o.product].some((v) => String(v).toLowerCase().includes(q)));
    }
    if (payment) list = list.filter((o) => o.payment === payment);
    if (lab) list = list.filter((o) => o.lab_production === lab);
    if (recurringOnly) list = list.filter((o) => !!o.recurring && o.recurring !== 0);
    if (amountSort) list = [...list].sort((a, b) => (amountSort === "low" ? amountVal(a.total) - amountVal(b.total) : amountVal(b.total) - amountVal(a.total)));
    else if (dateSort) list = [...list].sort((a, b) => (dateSort === "old" ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at)));
    return list;
  }, [orders, search, payment, lab, recurringOnly, amountSort, dateSort]);

  const selectCls = "rounded-full border border-hair bg-white px-3.5 py-[9px] text-sm text-fg2";

  return (
    <div>
      {!compact && (
        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex w-[220px] items-center gap-2 rounded-full border border-hair bg-[#FAF8F2] px-4 py-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search.." className="w-full border-none bg-transparent text-sm outline-none" />
            </div>
            <select value={dateSort} onChange={(e) => { setDateSort(e.target.value); setAmountSort(""); }} className={selectCls}>
              <option value="">Date Range</option>
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
            <select value={payment} onChange={(e) => setPayment(e.target.value)} className={selectCls}>
              <option value="">Payment</option>
              {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={lab} onChange={(e) => setLab(e.target.value)} className={selectCls}>
              <option value="">Lab Production</option>
              {LAB.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={amountSort} onChange={(e) => { setAmountSort(e.target.value); setDateSort(""); }} className={selectCls}>
              <option value="">Amount</option>
              <option value="low">Low to high</option>
              <option value="high">High to low</option>
            </select>
          </div>
          <div className="flex rounded-full bg-[#EDEAE0] p-1 text-[13px] font-bold">
            <button onClick={() => setRecurringOnly(true)} className={`rounded-full px-3 py-1 ${recurringOnly ? "bg-leaf text-white" : "text-fg2"}`}>Recurring</button>
            <button onClick={() => setRecurringOnly(false)} className={`rounded-full px-3 py-1 ${!recurringOnly ? "bg-forest text-white" : "text-fg2"}`}>All Orders</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-card border border-hair bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              <th className={TH}>Order</th>
              <th className={TH}>Date</th>
              <th className={TH}>Payment</th>
              <th className={TH}>Client</th>
              <th className={TH}>Items</th>
              <th className={TH}>Lab Production</th>
              <th className={TH}>Amount</th>
              <th className={TH}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="py-14 text-center text-sm text-fg3">No orders found.</td></tr>
            ) : rows.map((o) => (
              <tr key={o.id} className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                <td className="px-6 py-3.5 font-mono text-[13px] text-forest">{o.id}</td>
                <td className="px-2 py-3.5 font-mono text-[13px] text-fg3">{o.date}</td>
                <td className="px-2 py-3.5"><Pill text={o.payment} map={PAYMENT_STYLE} /></td>
                <td className="px-2 py-3.5">
                  <div className="text-sm font-semibold text-forest">{o.customer}</div>
                  <div className="text-xs text-[#A6A293]">{o.op}{o.recurring ? " · Recurring" : ""}</div>
                </td>
                <td className="px-2 py-3.5 font-mono text-sm text-fg2">{o.items}</td>
                <td className="px-2 py-3.5"><Pill text={o.lab_production} map={LAB_STYLE} /></td>
                <td className="px-2 py-3.5 font-mono text-sm text-forest">{o.total}</td>
                <td className="px-6 py-3.5">
                  <button onClick={() => setView(o)} className="rounded-full bg-[#EDF3E6] p-1.5 text-[#356A26]" title="View"><Eye size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {view && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,23,6,.45)] p-4" onClick={() => setView(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-[460px] max-w-full rounded-panel bg-white p-8 shadow-g-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-lg font-semibold text-forest">{view.id}</h2>
              <button onClick={() => setView(null)} className="text-fg3"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-2.5 text-sm">
              {[["Client", view.customer], ["Operation", view.op], ["Items", view.product],
                ["Date", view.date], ["Amount", view.total], ["Recurring", view.recurring ? "Yes" : "No"]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-[#F2EFE6] pb-2">
                  <span className="text-fg3">{k}</span><span className="text-right font-medium text-forest">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-fg3">Payment</span><Pill text={view.payment} map={PAYMENT_STYLE} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg3">Lab Production</span><Pill text={view.lab_production} map={LAB_STYLE} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg3">Status</span><StatusPill status={view.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
