"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ArrowRight } from "lucide-react";

const LINKS = [
  { href: "/shop", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  // Hide storefront chrome on the admin dashboard.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-[#D9D6C7] bg-[rgba(237,234,224,.86)] backdrop-blur-[14px] print:hidden">
      <div className="mx-auto flex h-[74px] max-w-container items-center gap-8 px-8">
        <Link href="/" aria-label="AgriPure home" className="shrink-0">
          <Image
            src="/assets/logo-forest.png"
            alt="AgriPure"
            width={150}
            height={30}
            className="h-[30px] w-auto"
            priority
          />
        </Link>
        <nav className="ml-3.5 hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="ap-link text-[15px]">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/account"
            title="Account"
            className="flex items-center gap-[7px] rounded-full px-2.5 py-2 text-sm font-semibold text-[#26302A]"
          >
            <User size={19} strokeWidth={1.8} />
            <span className="hidden sm:inline">Account</span>
          </Link>
          <Link
            href="/order-now"
            className="flex items-center gap-2 rounded-full bg-leaf px-[20px] py-2.5 text-sm font-bold text-[#04230B] shadow-[0_4px_14px_rgba(111,174,82,.4)] transition-colors hover:bg-leaf-hover"
          >
            Order Now <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}
