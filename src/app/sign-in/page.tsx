"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const inputCls =
  "rounded-[10px] border border-[#D9D6C7] px-4 py-3.5 text-[15px] outline-none focus:border-leaf";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/account/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.ok) { router.push(next); router.refresh(); }
    else setError((await res.json()).error ?? "Sign-in failed");
  };

  return (
    <div className="mx-auto max-w-[1080px] px-8 pb-[90px] pt-12">
      <div className="grid min-h-[540px] overflow-hidden rounded-[24px] border border-hair shadow-g-lg md:grid-cols-2">
        <div className="relative flex flex-col justify-between overflow-hidden bg-forest p-12">
          <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_130%,rgba(111,174,82,.32)_0%,rgba(0,23,6,0)_65%)]" />
          <Image src="/assets/logo-white.png" alt="AgriPure" width={150} height={30} className="relative h-[30px] w-auto" />
          <div className="relative">
            <h2 className="m-0 font-display text-[34px] font-black leading-[1.1] text-white">
              Your operation&apos;s command center.
            </h2>
            <p className="mt-3.5 text-[15px] text-[#C9DBC0]">
              Sign in to view your custom quotes, track orders, and reorder by season.
            </p>
          </div>
          <Image src="/assets/bottles/restore.png" alt="" width={120} height={170} className="absolute -bottom-2.5 -right-5 h-[170px] w-auto opacity-90 drop-shadow-[0_20px_30px_rgba(0,0,0,.4)]" />
        </div>

        <form onSubmit={submit} className="flex flex-col justify-center bg-white p-12">
          <h1 className="m-0 font-display text-[32px] font-black text-forest">Welcome back</h1>
          <p className="mb-[26px] mt-2 text-[15px] text-[#7A8076]">Sign in to your AgriPure account.</p>
          <div className="flex flex-col gap-3.5">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </div>
          {error && <div className="mt-3 text-sm font-semibold text-[#B23A1E]">{error}</div>}
          <button type="submit" disabled={busy} className="btn-primary mt-5 h-[52px] text-base">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <div className="mt-[18px] text-center text-sm text-[#7A8076]">
            New to AgriPure?{" "}
            <Link href="/order-now" className="ap-link !text-leaf-600">Get a quote to create your account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
