"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/account/logout", { method: "POST" });
        router.push("/sign-in");
        router.refresh();
      }}
      className="btn-ghost px-4 py-2 text-sm"
    >
      <LogOut size={15} /> Sign out
    </button>
  );
}
