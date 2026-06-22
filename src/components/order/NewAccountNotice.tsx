"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NewAccountNotice({ quoteId, email }: { quoteId: string; email: string }) {
  const [pw, setPw] = useState<string | null>(null);
  useEffect(() => {
    try { setPw(sessionStorage.getItem(`ap_pw_${quoteId}`)); } catch { /* ignore */ }
  }, [quoteId]);

  return (
    <div className="mt-5 rounded-[14px] border border-leaf bg-[#F2F7EC] px-5 py-4 text-[14px] text-leaf-700">
      ✓ Account created for <span className="font-semibold">{email}</span> — we&apos;ve emailed your quote and login details.
      {pw && (
        <div className="mt-2 text-fg2">
          Temporary password <span className="font-mono font-semibold text-forest">{pw}</span> —{" "}
          <Link href="/sign-in" className="ap-link !text-leaf-600">sign in</Link> to view your quotes anytime.
        </div>
      )}
    </div>
  );
}
