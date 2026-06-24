"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/** A table row that navigates to `href` when clicked anywhere (admin list → detail). */
export default function RowLink({
  href, className = "", children,
}: { href: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(href)}
      onMouseEnter={() => router.prefetch(href)}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </tr>
  );
}
