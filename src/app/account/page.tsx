import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CUSTOMER_COOKIE } from "@/lib/auth";
import { getAccountById, listQuotesByAccount } from "@/lib/repo";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

import LogoutButton from "@/components/account/LogoutButton";

const statusPill = (status: string, payment: string) => {
  const ordered = status === "ordered";
  const label = ordered ? `Ordered · ${payment.replace(/_/g, " ")}` : "Quote";
  const style = ordered
    ? { color: "#356A26", background: "#E9F0E0" }
    : { color: "#2F6FB0", background: "#E2ECF5" };
  return <span className="inline-block rounded-full px-3 py-[5px] text-xs font-bold" style={style}>{label}</span>;
};

export default function AccountPage() {
  const id = cookies().get(CUSTOMER_COOKIE)?.value;
  if (!id) redirect("/sign-in?next=/account");
  const account = getAccountById(id);
  if (!account) redirect("/sign-in?next=/account");
  const quotes = listQuotesByAccount(id);

  return (
    <div className="mx-auto max-w-container px-8 pb-[90px] pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">My account</div>
          <h1 className="mt-2 font-display text-[44px] font-black tracking-[-0.02em] text-forest">
            {account.name}
          </h1>
          <div className="mt-1 text-[14px] text-fg3">{account.business} · {account.email}</div>
        </div>
        <div className="flex gap-3">
          <Link href="/order-now" className="btn-leaf px-5 py-2.5 text-sm">New quote <ArrowRight size={15} strokeWidth={2.4} /></Link>
          <LogoutButton />
        </div>
      </div>

      <h2 className="mt-10 font-display text-[22px] font-extrabold text-forest">Your quotes &amp; orders</h2>

      {quotes.length === 0 ? (
        <div className="mt-5 rounded-panel border border-hair bg-white p-14 text-center">
          <p className="text-[16px] text-fg2">You don&apos;t have any quotes yet.</p>
          <Link href="/order-now" className="btn-primary mt-5 px-7 py-3 text-[15px]">Build your program</Link>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-panel border border-hair bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
                {["Quote", "Date", "Acres", "Total", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((qt) => (
                <tr key={qt.id} className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                  <td className="px-5 py-4 font-mono text-[13px] text-forest">{qt.number}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-fg3">{new Date(qt.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-5 py-4 font-mono text-sm text-fg2">{qt.acres.toLocaleString()} ac</td>
                  <td className="px-5 py-4 font-mono text-sm font-semibold text-forest">{money(qt.total)}</td>
                  <td className="px-5 py-4">{statusPill(qt.status, qt.payment_status)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/order-now/quote/${qt.id}`} className="ap-link inline-flex items-center gap-1.5 !text-leaf-600 text-[13px]">
                      View <ArrowRight size={14} strokeWidth={2.2} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
