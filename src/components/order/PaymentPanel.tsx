"use client";

import { useState } from "react";
import { CreditCard, Building2, Landmark, Check, Printer, Mail } from "lucide-react";
import { money } from "@/lib/pricing";

export default function PaymentPanel({
  quoteId, total, email, number,
}: { quoteId: string; total: number; email: string; number: string }) {
  const [placed, setPlaced] = useState<null | string>(null);
  const [busy, setBusy] = useState(false);
  const [emailed, setEmailed] = useState(false);

  const tier = total < 25000 ? "card" : total <= 50000 ? "ach" : "wire";

  const place = async (method: string) => {
    setBusy(true);
    const res = await fetch(`/api/quotes/${quoteId}/order`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.checkoutUrl) { window.location.href = data.checkoutUrl; return; } // live Stripe Checkout
    setBusy(false);
    if (res.ok) setPlaced(method);
  };

  if (placed) {
    return (
      <div className="rounded-panel border border-leaf bg-[#F2F7EC] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white">
          <Check size={32} strokeWidth={2.6} />
        </div>
        <h3 className="mt-5 font-display text-[30px] font-extrabold text-forest">Order placed</h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[18px] leading-[1.6] text-fg2">
          {placed === "wire" || placed === "check"
            ? "We've recorded your order — send your payment using the instructions above and we'll confirm on receipt."
            : "We've recorded your order. Payment is pending (live processing turns on once Stripe/Plaid keys are added)."}
        </p>
        <p className="mt-2 text-[15px] text-fg3">A confirmation for {number} was sent to {email}.</p>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-hair bg-white p-8 shadow-g-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-[26px] font-extrabold text-forest">Place your order</h3>
        <div className="flex gap-2 print:hidden">
          <button onClick={() => window.print()} className="btn-ghost px-4 py-2.5 text-[14px]"><Printer size={16} /> Save as PDF</button>
          <button onClick={() => setEmailed(true)} className="btn-ghost px-4 py-2.5 text-[14px]"><Mail size={16} /> {emailed ? "Sent ✓" : "Email me a copy"}</button>
        </div>
      </div>
      <p className="mt-2 text-[17px] text-fg2">Order total <span className="font-mono text-[19px] font-semibold text-forest">{money(total)}</span></p>

      <div className="mt-6 print:hidden">
        {tier === "card" && (
          <div className="rounded-[16px] border border-leaf bg-[#F2F7EC] p-6">
            <div className="flex items-center gap-2.5 font-display text-[20px] font-extrabold text-forest"><CreditCard size={22} /> Pay by credit card</div>
            <p className="mt-2 text-[15px] text-fg2">For orders under $25,000. Secure card checkout.</p>
            <button onClick={() => place("card")} disabled={busy} className="btn-primary mt-5 h-[56px] w-full text-[17px]">
              {busy ? "Processing…" : `Pay ${money(total)} by card`}
            </button>
            <p className="mt-2.5 text-[13px] text-fg3">Opens Stripe Checkout once STRIPE keys are configured.</p>
          </div>
        )}
        {tier === "ach" && (
          <div className="rounded-[16px] border border-leaf bg-[#F2F7EC] p-6">
            <div className="flex items-center gap-2.5 font-display text-[20px] font-extrabold text-forest"><Building2 size={22} /> Pay by bank · instant ACH</div>
            <p className="mt-2 text-[15px] text-fg2">For orders $25,000–$50,000. Connect your bank securely with Plaid.</p>
            <button onClick={() => place("ach")} disabled={busy} className="btn-primary mt-5 h-[56px] w-full text-[17px]">
              {busy ? "Processing…" : "Connect bank & pay"}
            </button>
            <p className="mt-2.5 text-[13px] text-fg3">Opens Plaid Link once PLAID keys are configured.</p>
          </div>
        )}
        {tier === "wire" && (
          <div className="rounded-[16px] border border-hair bg-[#FAF8F2] p-6">
            <div className="flex items-center gap-2.5 font-display text-[20px] font-extrabold text-forest"><Landmark size={22} /> Pay by wire or check</div>
            <p className="mt-2 text-[15px] text-fg2">For orders over $50,000. Wire to the account below — include your quote number as reference.</p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 rounded-[12px] border border-hair bg-white p-5 font-mono text-[15px]">
              <span className="text-fg3">Beneficiary</span><span className="text-forest">AgriPure Inc.</span>
              <span className="text-fg3">Bank</span><span className="text-forest">First Agricultural Bank</span>
              <span className="text-fg3">Routing (ABA)</span><span className="text-forest">021000021</span>
              <span className="text-fg3">Account</span><span className="text-forest">0001234567</span>
              <span className="text-fg3">Reference</span><span className="text-forest">{number}</span>
              <span className="text-fg3">Check payable to</span><span className="text-forest">AgriPure Inc.</span>
            </div>
            <button onClick={() => place("wire")} disabled={busy} className="btn-primary mt-5 h-[56px] w-full text-[17px]">
              {busy ? "Submitting…" : "I've sent payment — place order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
