"use client";

import { useState } from "react";

const inputCls =
  "rounded-[10px] border border-[#D9D6C7] px-[15px] py-[13px] text-[15px] outline-none focus:border-leaf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [crop, setCrop] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !last.trim()) { setError("Name is required"); return; }
    if (!EMAIL_RE.test(email)) { setError("Enter a valid email address"); return; }
    if (!message.trim()) { setError("Please describe your situation"); return; }
    if (message.length > 5000) { setError("Message must be 5,000 characters or fewer"); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${first.trim()} ${last.trim()}`,
          email: email.trim(),
          subject: "general-question",
          message: `${crop.trim() ? `Crop & acreage: ${crop.trim()}\n\n` : ""}${message.trim()}`,
        }),
      });
      setBusy(false);
      if (res.ok) setSent(true);
      else setError((await res.json().catch(() => ({}))).error ?? "Could not send message");
    } catch {
      setBusy(false);
      setError("Something went wrong — please try again");
    }
  };

  if (sent) {
    return (
      <div className="rounded-[20px] border border-leaf bg-[#F2F7EC] p-[30px] text-center shadow-g-md">
        <div className="font-display text-[24px] font-extrabold text-forest">Message sent</div>
        <p className="mt-2 text-[15px] text-fg2">We&apos;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[20px] border border-hair bg-white p-[30px] shadow-g-md">
      <div className="grid grid-cols-2 gap-3.5">
        <input placeholder="First name" maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} className={inputCls} />
        <input placeholder="Last name" maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} className={inputCls} />
        <input type="email" placeholder="Email" maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} className={`col-span-2 ${inputCls}`} />
        <input placeholder="Crop & acreage" maxLength={200} value={crop} onChange={(e) => setCrop(e.target.value)} className={`col-span-2 ${inputCls}`} />
        <textarea
          placeholder="What are you fighting this season?"
          rows={4}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`col-span-2 resize-y ${inputCls}`}
        />
      </div>
      {error && <div className="mt-3 text-sm font-semibold text-[#B23A1E]">{error}</div>}
      <button type="submit" disabled={busy} className="btn-primary mt-4 h-[52px] w-full text-base">
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
