"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputCls =
  "rounded-[10px] border border-[#D9D6C7] px-4 py-3.5 text-[15px] outline-none focus:border-leaf";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@agripure.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#DCEFC8_0%,#EDEAE0_55%)] p-10">
      <form onSubmit={signIn} className="w-[400px] rounded-panel border border-hair bg-white p-10 shadow-g-lg">
        <Image src="/assets/logo-forest.png" alt="AgriPure" width={140} height={28} className="h-7 w-auto" />
        <h1 className="mb-1 mt-6 font-display text-[26px] font-black text-forest">Dashboard sign-in</h1>
        <p className="mb-6 text-sm text-[#7A8076]">Manage orders, inventory, and customers.</p>
        <div className="flex flex-col gap-[13px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>
        {error && <div className="mt-3 text-sm font-semibold text-[#B23A1E]">{error}</div>}
        <button type="submit" disabled={busy} className="btn-primary mt-5 h-[50px] w-full text-[15px]">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <div className="mt-4 text-center font-mono text-[13px] text-[#A6A293]">
          superadmin@agripure.com · agripure
        </div>
      </form>
    </div>
  );
}
