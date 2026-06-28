"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "Products" },
      { href: "/order-now", label: "Order Now" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/nano-technology", label: "Technology" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/order-now", label: "Get a quote" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-forest-canvas px-8 pb-8 pt-[60px] text-[#A9C4A0] print:hidden">
      <div className="mx-auto grid max-w-container grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/assets/logo-white.png"
            alt="AgriPure"
            width={150}
            height={30}
            className="h-[30px] w-auto"
          />
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-[#8FB97A]">
            Natural pesticides, fungicides, and nutrients — custom-formulated for your
            crop, soil, and pressures.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[0.12em] text-leaf">
              {col.heading}
            </div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="ap-link text-sm font-medium !text-[#C9DBC0] hover:!text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-container flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-[#6E8B6A]">
        <span>© 2026 AgriPure. All rights reserved.</span>
        <span>Privacy · Terms · OMRI-style inputs</span>
      </div>
    </footer>
  );
}
