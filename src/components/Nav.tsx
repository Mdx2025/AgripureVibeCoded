"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/shop", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "Process" },
  { href: "/why-choose-us", label: "Why AgriPure" },
  { href: "/nano-technology", label: "Technology" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hide storefront chrome on the admin dashboard.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-[#D9D6C7] bg-[rgba(237,234,224,.86)] backdrop-blur-[14px] print:hidden">
      <div className="mx-auto flex h-[74px] max-w-container items-center gap-4 px-5 sm:px-8 lg:gap-7">
        <Link href="/" aria-label="AgriPure home" className="shrink-0">
          <Image
            src="/assets/logo-forest.png"
            alt="AgriPure"
            width={552}
            height={149}
            className="h-[30px] w-auto"
            priority
          />
        </Link>

        {/* desktop nav — only when it comfortably fits */}
        <nav className="ml-2 hidden items-center gap-x-5 lg:flex xl:gap-x-7">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="ap-link whitespace-nowrap text-[14px] xl:text-[15px]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/account"
            title="Account"
            aria-label="Account"
            className="hidden items-center rounded-full px-2.5 py-2 text-sm font-semibold text-[#26302A] lg:flex"
          >
            <User size={19} strokeWidth={1.8} />
          </Link>
          <Link
            href="/order-now"
            className="flex items-center gap-2 rounded-full bg-leaf px-[18px] py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(111,174,82,.4)] transition-colors hover:bg-leaf-hover sm:px-[20px]"
          >
            Order Now <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
          {/* hamburger — shown until the desktop nav fits */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-black/5 lg:hidden"
          >
            {open ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* mobile menu drawer */}
      {open && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[74px] z-30 bg-[rgba(0,23,6,.35)]"
          />
          <nav className="relative z-40 max-h-[calc(100vh-74px)] overflow-y-auto border-b border-[#D9D6C7] bg-paper px-5 pb-6 pt-2 shadow-g-lg sm:px-8">
            <div className="flex flex-col">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`border-b border-[#E4E1D5] py-3.5 text-[17px] font-semibold ${active ? "text-leaf-700" : "text-forest"}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                href="/account"
                className="mt-4 flex items-center justify-center gap-2 rounded-full border border-hair bg-white py-3 text-[15px] font-bold text-forest"
              >
                <User size={18} strokeWidth={1.9} /> Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
