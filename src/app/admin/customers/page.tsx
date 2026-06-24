import { listCustomers } from "@/lib/repo";

export const dynamic = "force-dynamic";

const TH =
  "px-2 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-fg3 first:pl-6 last:pr-6";

export default function CustomersPage() {
  const customers = listCustomers();
  return (
    <div className="overflow-x-auto rounded-card border border-hair bg-white">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-[#EFECE2] bg-[#FAF8F2]">
            <th className={TH}>Customer</th>
            <th className={TH}>Location</th>
            <th className={TH}>Crop</th>
            <th className={TH}>Orders</th>
            <th className={TH}>Lifetime value</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const initials = c.name.split(" ").map((w) => w[0]).join("");
            return (
              <tr
                key={c.id}
                className="cursor-pointer border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-[38px] w-[38px] items-center justify-center rounded-full font-display text-sm font-extrabold text-white"
                      style={{ background: c.avColor }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-forest">{c.name}</div>
                      <div className="text-xs text-[#A6A293]">{c.op}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3.5 text-[13px] text-fg2">{c.location}</td>
                <td className="px-2 py-3.5 text-[13px] text-fg2">{c.crop}</td>
                <td className="px-2 py-3.5 font-mono text-sm text-forest">{c.orders}</td>
                <td className="px-6 py-3.5 font-mono text-sm text-forest">{c.ltv}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
