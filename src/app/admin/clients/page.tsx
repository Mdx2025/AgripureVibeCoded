import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listAccounts } from "@/lib/repo";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const TH = "px-3 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function AdminClientsPage() {
  const clients = listAccounts();

  return (
    <div>
      <div className="mb-[18px] text-sm text-[#7A8076]">
        {clients.length} client{clients.length === 1 ? "" : "s"} · created automatically when an order is placed on the site
      </div>
      <div className="overflow-hidden rounded-card border border-hair bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              {["Client", "Contact", "Orders", "Lifetime value", "Joined", ""].map((h) => (
                <th key={h} className={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={6} className="py-14 text-center text-sm text-fg3">No clients yet — they appear here automatically when someone places an order.</td></tr>
            ) : clients.map((c) => (
              <tr key={c.id} className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                <td className="px-6 py-3.5">
                  <div className="text-sm font-semibold text-forest">{c.name}</div>
                  <div className="text-xs text-[#A6A293]">{c.business || "—"}</div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="text-[13px] text-fg2">{c.email}</div>
                  <div className="text-xs text-fg3">{c.phone || "—"}</div>
                </td>
                <td className="px-3 py-3.5 font-mono text-sm text-fg2">{c.orders}</td>
                <td className="px-3 py-3.5 font-mono text-sm text-forest">{money(c.totalSpend)}</td>
                <td className="px-3 py-3.5 text-[13px] text-fg3">{fmtDate(c.created_at)}</td>
                <td className="px-6 py-3.5 text-right">
                  <Link href={`/admin/clients/${c.id}`} className="ap-link inline-flex items-center gap-1.5 !text-leaf-600 text-[13px]">
                    View <ArrowRight size={14} strokeWidth={2.2} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
