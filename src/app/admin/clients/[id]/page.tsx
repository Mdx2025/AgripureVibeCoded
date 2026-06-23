import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Building2, MapPin } from "lucide-react";
import { getClientWithQuotes } from "@/lib/repo";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const data = getClientWithQuotes(params.id);
  if (!data) return notFound();
  const { account, quotes } = data;
  const lifetime = quotes.reduce((t, q) => t + q.total, 0);

  return (
    <div className="mx-auto max-w-[1000px]">
      <Link href="/admin/clients" className="ap-link !text-fg3 text-[13px]">← All clients</Link>

      {/* header */}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] font-extrabold tracking-[-0.02em] text-forest">{account.name}</h1>
          <div className="mt-1 text-[14px] text-fg3">{account.business || "—"} · client since {fmtDate(account.created_at)}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[24px] font-semibold text-forest">{money(lifetime)}</div>
          <div className="text-[13px] text-fg3">{quotes.length} order{quotes.length === 1 ? "" : "s"} · lifetime value</div>
        </div>
      </div>

      {/* contact card */}
      <div className="mt-6 grid gap-px overflow-hidden rounded-panel border border-hair bg-hair sm:grid-cols-2">
        {[
          { Icon: Mail, label: "Email", value: account.email },
          { Icon: Phone, label: "Phone", value: account.phone || "—" },
          { Icon: Building2, label: "Business", value: account.business || "—" },
          { Icon: MapPin, label: "Farm address", value: account.address || "—" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 bg-white px-5 py-4">
            <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-[#E9F0E0] text-leaf-700"><Icon size={17} /></div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">{label}</div>
              <div className="text-[15px] text-[#3F463E]">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* orders */}
      <h2 className="mt-9 mb-3 font-display text-[20px] font-extrabold text-forest">Orders &amp; quotes</h2>
      {quotes.length === 0 ? (
        <div className="rounded-panel border border-hair bg-white p-6 text-sm text-fg3">No orders yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {quotes.map((q) => {
            const p = q.payload;
            const ordered = q.status === "ordered";
            return (
              <div key={q.id} className="overflow-hidden rounded-panel border border-hair bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hair bg-[#FAF8F2] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[15px] font-semibold text-forest">{q.number}</span>
                    <span className="inline-block rounded-full px-3 py-[5px] text-xs font-bold"
                      style={ordered ? { color: "#356A26", background: "#E9F0E0" } : { color: "#2F6FB0", background: "#E2ECF5" }}>
                      {ordered ? `Ordered · ${q.payment_status.replace(/_/g, " ")}` : "Quote"}
                    </span>
                    <span className="text-[13px] text-fg3">{fmtDate(q.created_at)}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[18px] font-semibold text-forest">{money(q.total)}</div>
                    <div className="text-[12px] text-fg3">{q.acres.toLocaleString()} ac{q.soil_total ? ` · ${money(q.soil_total)} soil` : ""}</div>
                  </div>
                </div>
                <div className="grid gap-x-8 gap-y-3 px-6 py-4 text-[14px] sm:grid-cols-2">
                  <Detail label="Crops" value={p.crops.join(", ") || "—"} />
                  <Detail label="Acreage" value={p.crops.map((c) => `${c} ${(p.acres[c] || 0).toLocaleString()}ac`).join(" · ") || "—"} />
                  <Detail label="Soil problems" value={p.soil?.join(", ") || "—"} />
                  <Detail label="Weeds" value={p.weeds?.join(", ") || "—"} />
                  <Detail label="Pests by crop" value={p.crops.map((c) => `${c}: ${(p.pestsByCrop?.[c] || []).join(", ") || "—"}`).join(" · ")} />
                  <Detail label="Disease by crop" value={p.crops.map((c) => `${c}: ${(p.diseasesByCrop?.[c] || []).join(", ") || "—"}`).join(" · ")} />
                  <Detail label="Soil samples" value={`${p.crops.length} · ${money(q.soil_total)}`} />
                  <Detail label="Yield loss reported" value={p.crops.filter((c) => p.yieldByCrop?.[c]).join(", ") || "None"} />
                </div>
                <div className="flex flex-wrap gap-4 border-t border-[#F2EFE6] px-6 py-3 text-[13px]">
                  <Link href={`/order-now/quote/${q.id}`} className="ap-link inline-flex items-center gap-1 !text-leaf-600 font-semibold">Customer quote <ArrowRight size={13} strokeWidth={2.4} /></Link>
                  <Link href={`/admin/quotes/${q.id}`} className="ap-link inline-flex items-center gap-1 !text-leaf-600 font-semibold">Lab formulation sheet <ArrowRight size={13} strokeWidth={2.4} /></Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">{label}</div>
      <div className="mt-0.5 text-[#3F463E]">{value}</div>
    </div>
  );
}
