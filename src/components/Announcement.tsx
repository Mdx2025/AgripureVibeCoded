"use client";

import { usePathname } from "next/navigation";

export default function Announcement() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="bg-forest-canvas px-4 py-[9px] text-center text-[13px] font-medium tracking-[0.04em] text-[#CFE3C2] print:hidden">
      Free freight on orders over $750 · Every formula custom-matched to your crop,
      soil &amp; pressure
    </div>
  );
}
