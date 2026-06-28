"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, ShoppingBag, Boxes, Users, UsersRound, Settings, LogOut, Search, Bell,
  FlaskConical, Leaf, ShieldCheck, Award, HelpCircle, ChevronDown, Receipt, Microscope, Tag, Menu, X, Globe, Sprout,
} from "lucide-react";

const NAVIGATION = [
  { href: "/admin", label: "Dashboard", Icon: LayoutGrid, badge: "" },
  { href: "/admin/quotes", label: "Quotes", Icon: Receipt, badge: "" },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag, badge: "12" },
  { href: "/admin/clients", label: "Clients", Icon: Users, badge: "" },
  { href: "/admin/products", label: "Products", Icon: Boxes, badge: "" },
  { href: "/admin/pricing", label: "Pricing", Icon: Tag, badge: "" },
  { href: "/admin/crop-pricing", label: "Crop Pricing", Icon: Sprout, badge: "" },
  { href: "/admin/crop-library", label: "Crop Library", Icon: Microscope, badge: "" },
  { href: "/admin/formulas", label: "Formulas", Icon: FlaskConical, badge: "" },
  { href: "/admin/remedies", label: "Remedies", Icon: Leaf, badge: "" },
];
const SUPER_ADMIN = [
  { href: "/admin/admins", label: "Admin", Icon: ShieldCheck, badge: "" },
  { href: "/admin/proven", label: "Proven in the field", Icon: Award, badge: "" },
  { href: "/admin/team", label: "Team", Icon: UsersRound, badge: "" },
  { href: "/admin/faqs", label: "FAQs", Icon: HelpCircle, badge: "" },
  { href: "/admin/seo", label: "SEO", Icon: Globe, badge: "" },
  { href: "/admin/settings", label: "Settings", Icon: Settings, badge: "" },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/quotes": "Custom Quotes",
  "/admin/crop-library": "Crop Library",
  "/admin/orders": "Client Purchase History",
  "/admin/clients": "Clients",
  "/admin/products": "Products",
  "/admin/pricing": "Pricing Program",
  "/admin/crop-pricing": "Crop Pricing",
  "/admin/formulas": "Formulas",
  "/admin/remedies": "Remedies",
  "/admin/admins": "Admins",
  "/admin/proven": "Proven in the field",
  "/admin/team": "Team",
  "/admin/faqs": "FAQs",
  "/admin/seo": "SEO & Metadata",
  "/admin/settings": "Settings",
};

const REGIONS = [
  { code: "US", flag: "🇺🇸" },
  { code: "CA", flag: "🇨🇦" },
  { code: "EU", flag: "🇪🇺" },
  { code: "UK", flag: "🇬🇧" },
];

const NOTIFICATIONS = [
  { title: "New order #AP-28411", detail: "Carter Vineyards · Processing", tone: "#2F6FB0" },
  { title: "Low stock: Protect", detail: "18 units remaining", tone: "#C97A06" },
  { title: "New client added", detail: "Sunridge Orchards", tone: "#538B3C" },
  { title: "Lab production complete", detail: "Order #AP-28409", tone: "#356A26" },
];

function NavLink({ href, label, Icon, badge, active }: { href: string; label: string; Icon: typeof Users; badge: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-[11px] text-[14.5px] font-semibold transition-all ${
        active ? "bg-[rgba(111,174,82,.16)] text-white" : "text-[#9FC08A] hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-leaf px-2 py-0.5 font-mono text-[11px] font-bold text-forest-sidebar">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [region, setRegion] = useState(REGIONS[0]);
  const [regionOpen, setRegionOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Close the mobile sidebar whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/sign-in");
    router.refresh();
  };

  if (pathname === "/admin/sign-in") {
    return <div className="min-h-screen">{children}</div>;
  }

  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/admin/quotes") ? "Lab Formulation Sheet"
      : pathname.startsWith("/admin/clients") ? "Client"
      : "Dashboard");

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* mobile sidebar backdrop */}
      {navOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 bg-[rgba(0,23,6,.45)] lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`ap-sc fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-none flex-col overflow-y-auto bg-forest-sidebar p-[22px] px-4 transition-transform duration-200 lg:sticky lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-2 pb-5 pt-1.5">
          <Image src="/assets/logo-white.png" alt="AgriPure" width={552} height={149} className="h-[26px] w-auto" />
          <button onClick={() => setNavOpen(false)} aria-label="Close menu" className="text-[#7FA06C] hover:text-white lg:hidden">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="px-2 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5E7A4E]">
            Navigation
          </div>
          {NAVIGATION.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} />
          ))}
          <div className="px-2 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5E7A4E]">
            Super Admin
          </div>
          {SUPER_ADMIN.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} />
          ))}
        </div>

        <div className="mt-3.5 border-t border-white/10 pt-3.5">
          <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5E7A4E]">
            User Account
          </div>
          <div className="flex items-center gap-[11px] rounded-xl bg-white/[0.04] px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf font-display font-extrabold text-forest-sidebar">
              S
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-bold text-white">Super Admin</div>
              <div className="text-xs text-[#7FA06C]">Jun 20th, 2026</div>
            </div>
            <button onClick={signOut} title="Sign out" className="text-[#7FA06C] hover:text-white">
              <LogOut size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-[#D9D6C7] bg-[rgba(237,234,224,.86)] px-4 backdrop-blur-[12px] sm:gap-5 sm:px-[30px]">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-forest hover:bg-black/5 lg:hidden"
          >
            <Menu size={22} strokeWidth={2} />
          </button>
          <h1 className="m-0 min-w-0 truncate font-display text-[19px] font-extrabold tracking-[-0.01em] text-forest sm:text-[24px]">
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden w-[240px] items-center gap-2 rounded-full border border-[#D9D6C7] bg-white px-4 py-[9px] md:flex">
              <Search size={16} strokeWidth={1.8} className="text-fg3" />
              <input placeholder="Search…" className="w-full border-none bg-transparent text-sm outline-none" />
            </div>

            {/* notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setRegionOpen(false); }}
                className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#D9D6C7] bg-white text-fg2"
              >
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute right-[9px] top-2 h-2 w-2 rounded-full border-2 border-white bg-[#C0531C]" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-[52px] z-30 w-[300px] rounded-card border border-hair bg-white p-2 shadow-g-lg">
                  <div className="px-3 py-2 font-display text-sm font-extrabold text-forest">Notifications</div>
                  {NOTIFICATIONS.map((nt) => (
                    <div key={nt.title} className="flex gap-2.5 rounded-xl px-3 py-2.5 hover:bg-[#FAF8F2]">
                      <span className="mt-1.5 h-2 w-2 flex-none rounded-full" style={{ background: nt.tone }} />
                      <div>
                        <div className="text-[13px] font-semibold text-forest">{nt.title}</div>
                        <div className="text-xs text-fg3">{nt.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* region / currency */}
            <div className="relative">
              <button
                onClick={() => { setRegionOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-full border border-[#D9D6C7] bg-white px-3.5 py-2 text-sm font-semibold text-forest"
              >
                <span>{region.code}</span>
                <span>{region.flag}</span>
                <ChevronDown size={15} className="text-fg3" />
              </button>
              {regionOpen && (
                <div className="absolute right-0 top-[48px] z-30 w-[120px] rounded-card border border-hair bg-white p-1.5 shadow-g-lg">
                  {REGIONS.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => { setRegion(r); setRegionOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-forest hover:bg-[#FAF8F2]"
                    >
                      <span>{r.flag}</span> {r.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="ap-sc flex-1 overflow-y-auto p-4 sm:p-[30px]">{children}</main>
      </div>
    </div>
  );
}
