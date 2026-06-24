import { ArrowRight } from "lucide-react";
import { listQuotes } from "@/lib/repo";
import { money } from "@/lib/pricing";
import RowLink from "@/components/admin/RowLink";

export const dynamic = "force-dynamic";

const TH = "px-3 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";

export default function AdminQuotesPage() {
  const quotes = listQuotes();
  return (
    <div>
      <div className="mb-[18px] text-sm text-[#7A8076]">
        {quotes.length} custom quote{quotes.length === 1 ? "" : "s"} received · open one to view the lab formulation
      </div>
      <div className="overflow-hidden rounded-card border border-hair bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
              {["Quote", "Customer", "Crops", "Acres", "Total", "Status", ""].map((h) => (
                <th key={h} className={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr><td colSpan={7} className="py-14 text-center text-sm text-fg3">No quotes yet.</td></tr>
            ) : quotes.map((q) => (
              <RowLink key={q.id} href={`/admin/quotes/${q.id}`} className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                <td className="px-6 py-3.5 font-mono text-[13px] text-forest">{q.number}</td>
                <td className="px-3 py-3.5">
                  <div className="text-sm font-semibold text-forest">{q.customer_name}</div>
                  <div className="text-xs text-[#A6A293]">{q.payload.customer.business}</div>
                </td>
                <td className="px-3 py-3.5 text-[13px] text-fg2">{q.payload.crops.join(", ")}</td>
                <td className="px-3 py-3.5 font-mono text-sm text-fg2">{q.acres.toLocaleString()} ac</td>
                <td className="px-3 py-3.5 font-mono text-sm text-forest">{money(q.total)}</td>
                <td className="px-3 py-3.5">
                  <span className="inline-block rounded-full px-3 py-[5px] text-xs font-bold"
                    style={q.status === "ordered" ? { color: "#356A26", background: "#E9F0E0" } : { color: "#2F6FB0", background: "#E2ECF5" }}>
                    {q.status === "ordered" ? `Ordered · ${q.payment_status.replace(/_/g, " ")}` : "Quote"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <span className="ap-link inline-flex items-center gap-1.5 !text-leaf-600 text-[13px]">
                    Lab sheet <ArrowRight size={14} strokeWidth={2.2} />
                  </span>
                </td>
              </RowLink>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
