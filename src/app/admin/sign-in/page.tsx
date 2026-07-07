"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const inputCls =
  "rounded-[10px] border border-[#D9D6C7] px-4 py-3.5 text-[15px] outline-none focus:border-leaf";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk) { setError("Enter a valid email address"); return; }
    if (!password) { setError("Password is required"); return; }
    setBusy(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.ok && !res.error) {
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-[400px] rounded-panel border border-hair bg-white p-10 shadow-g-lg">
      <Image src="/assets/logo-forest.png" alt="AgriPure" width={140} height={28} className="h-7 w-auto" />
      <h1 className="mb-1 mt-6 font-display text-[26px] font-black text-forest">Dashboard sign-in</h1>
      <p className="mb-6 text-sm text-[#7A8076]">Manage orders, inventory, and customers.</p>
      <div className="flex flex-col gap-[13px]">
        <input type="email" placeholder="Email" autoComplete="username" maxLength={320} value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        <input type="password" placeholder="Password" autoComplete="current-password" maxLength={128} value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </div>
      {error && <div className="mt-3 text-sm font-semibold text-[#B23A1E]">{error}</div>}
      <button type="submit" disabled={busy} className="btn-primary mt-5 h-[50px] w-full text-[15px]">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#DCEFC8_0%,#EDEAE0_55%)] p-10">
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
