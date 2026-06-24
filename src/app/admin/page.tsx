import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ShoppingBag, CircleDollarSign, Users, Boxes, LifeBuoy, ArrowRight } from "lucide-react";
import StatusPill from "@/components/admin/StatusPill";
import RowLink from "@/components/admin/RowLink";
import { bottleSrc } from "@/lib/products";
import {
  KPIS,
  REVENUE_TOTAL,
  REVENUE_MONTHS,
  REVENUE_VALUES,
  CATEGORY_SPLIT,
  stockColor,
} from "@/lib/admin-data";
import { listOrders, listProducts } from "@/lib/repo";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

const KPI_ICONS = [TrendingUp, ShoppingBag, CircleDollarSign, Users];

const QUICK_CARDS = [
  { href: "/admin/orders", label: "Orders", sub: "Order History", Icon: ShoppingBag, tint: "#FBEFD9", fg: "#C97A06" },
  { href: "/admin/clients", label: "Clients", sub: "A Client List", Icon: Users, tint: "#E8F2DE", fg: "#356A26" },
  { href: "/admin/products", label: "Products", sub: "What the client sees", Icon: Boxes, tint: "#F4ECD6", fg: "#B8860B" },
  { href: "/admin/faqs", label: "Client support", sub: "Technical Support", Icon: LifeBuoy, tint: "#E2ECF5", fg: "#2F6FB0" },
];

export default function OverviewPage() {
  const maxRev = Math.max(...REVENUE_VALUES);
  const orders = listOrders();
  const recent = orders.slice(0, 5);
  const receivedThisMonth = orders
    .filter((o) => o.payment === "Paid")
    .reduce((t, o) => t + (Number(String(o.total).replace(/[^0-9.]/g, "")) || 0), 0);
  const lowStock = listProducts()
    .filter((p) => p.stock < 140)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-[18px]">
      {/* quick-nav cards + revenue widget */}
      <div className="grid gap-[18px] lg:grid-cols-[1.7fr_1fr]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="ap-card rounded-card border border-hair bg-white p-[18px] shadow-g-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: c.tint, color: c.fg }}>
                <c.Icon size={20} strokeWidth={1.8} />
              </div>
              <div className="mt-3 font-display text-[18px] font-extrabold text-forest">{c.label}</div>
              <div className="text-[12px] text-fg3">{c.sub}</div>
            </Link>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-card bg-forest p-6 text-white shadow-g-md">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(191,232,154,.4)_0%,rgba(0,23,6,0)_70%)]" />
          <div className="relative flex h-full items-center justify-between">
            <div>
              <div className="font-mono text-[34px] font-semibold">{money(receivedThisMonth)}</div>
              <div className="mt-1 text-[13px] text-[#C9DBC0]">Received this month</div>
            </div>
            <Link href="/admin/orders" className="btn-leaf px-4 py-2 text-sm">View <ArrowRight size={15} strokeWidth={2.2} /></Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k, i) => {
          const Icon = KPI_ICONS[i];
          return (
            <div key={k.label} className="rounded-card border border-hair bg-white p-[22px] shadow-g-sm">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#7A8076]">{k.label}</span>
                <Icon size={18} strokeWidth={1.8} className="text-[#A6A293]" />
              </div>
              <div className="mt-3 font-mono text-[30px] font-semibold text-forest">{k.value}</div>
              <div className="mt-1.5 text-[13px] text-leaf-700">
                {k.trend} <span className="text-[#A6A293]">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* revenue + category */}
      <div className="grid gap-[18px] lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-card border border-hair bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="font-display text-[18px] font-extrabold text-forest">Revenue</div>
              <div className="text-[13px] text-fg3">Last 12 months</div>
            </div>
            <div className="font-mono text-[22px] text-forest">{REVENUE_TOTAL}</div>
          </div>
          <div className="flex h-[180px] items-end gap-2.5">
            {REVENUE_VALUES.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.round((v / maxRev) * 100)}%`,
                    background: i === REVENUE_VALUES.length - 1 ? "#6FAE52" : "#C9DFB6",
                  }}
                />
                <span className="font-mono text-[10px] text-[#A6A293]">{REVENUE_MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-hair bg-white p-6">
          <div className="mb-[18px] font-display text-[18px] font-extrabold text-forest">
            Sales by category
          </div>
          <div className="flex flex-col gap-4">
            {CATEGORY_SPLIT.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span className="font-semibold text-[#3F463E]">{c.label}</span>
                  <span className="font-mono text-[#7A8076]">{c.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F0EDE3]">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent orders + inventory */}
      <div className="grid gap-[18px] lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-card border border-hair bg-white">
          <div className="flex items-center justify-between border-b border-[#EFECE2] px-6 py-5">
            <div className="font-display text-[18px] font-extrabold text-forest">Recent orders</div>
            <Link href="/admin/orders" className="text-[13px] font-semibold text-leaf-600">
              View all
            </Link>
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {recent.map((o) => (
                <RowLink key={o.id} href="/admin/orders" className="border-b border-[#F2EFE6] transition-colors hover:bg-[#FAF8F2]">
                  <td className="px-6 py-[13px] font-mono text-[13px] text-forest">{o.id}</td>
                  <td className="px-2 py-[13px] text-sm text-[#3F463E]">{o.customer}</td>
                  <td className="px-2 py-[13px] text-[13px] text-fg3">{o.product}</td>
                  <td className="px-2 py-[13px] font-mono text-sm text-forest">{o.total}</td>
                  <td className="px-6 py-[13px]">
                    <StatusPill status={o.status} />
                  </td>
                </RowLink>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-card border border-hair bg-white p-6">
          <div className="mb-4 font-display text-[18px] font-extrabold text-forest">
            Inventory watch
          </div>
          <div className="flex flex-col gap-3.5">
            {lowStock.map((p) => {
              const color = stockColor(p.stock);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <Image src={bottleSrc(p.id)} alt={p.name} width={28} height={40} className="h-10 w-auto" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-forest">{p.name}</div>
                    <div className="mt-[5px] h-1.5 overflow-hidden rounded-full bg-[#F0EDE3]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.round((p.stock / p.cap) * 100)}%`, background: color }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[13px]" style={{ color }}>
                    {p.stock} u
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
