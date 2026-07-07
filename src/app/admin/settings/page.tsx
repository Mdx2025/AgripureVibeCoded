"use client";

import { useEffect, useState } from "react";

const inputCls =
  "w-full rounded-[10px] border border-[#D9D6C7] px-3.5 py-3 text-sm outline-none focus:border-leaf";

const TOGGLE_DEFS = [
  { key: "stock", label: "Low-stock alerts", desc: "Email when any SKU drops below 40 units" },
  { key: "ship", label: "Free freight over $750", desc: "Auto-apply free palletized freight" },
  { key: "net30", label: "Net-30 terms", desc: "Offer Net-30 to verified operations" },
  { key: "marketing", label: "Marketing emails", desc: "Seasonal program reminders to customers" },
] as const;

type Toggles = Record<string, boolean>;

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [fieldOffice, setFieldOffice] = useState("");
  const [toggles, setToggles] = useState<Toggles>({ stock: true, ship: true, net30: true, marketing: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d?.settings ?? {};
        setStoreName(s.storeName ?? "");
        setSupportEmail(s.supportEmail ?? "");
        setFieldOffice(s.fieldOffice ?? "");
        setToggles({
          stock: s.stock !== "false",
          ship: s.ship !== "false",
          net30: s.net30 !== "false",
          marketing: s.marketing === "true",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const emailOk = !supportEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail);

  const save = async () => {
    if (!emailOk) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName,
        supportEmail,
        fieldOffice,
        stock: String(toggles.stock),
        ship: String(toggles.ship),
        net30: String(toggles.net30),
        marketing: String(toggles.marketing),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="flex max-w-[760px] flex-col gap-[18px]">
      <div className="rounded-card border border-hair bg-white p-[26px]">
        <div className="mb-[18px] font-display text-[18px] font-extrabold text-forest">Store profile</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="mb-1.5 block text-[13px] text-[#7A8076]">Store name</label>
            <input value={storeName} maxLength={120} onChange={(e) => setStoreName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] text-[#7A8076]">Support email</label>
            <input type="email" value={supportEmail} maxLength={320} onChange={(e) => setSupportEmail(e.target.value)} className={`${inputCls} ${supportEmail && !emailOk ? "!border-[#B23A1E]" : ""}`} />
            {supportEmail && !emailOk && <div className="mt-1 text-xs text-[#B23A1E]">Enter a valid email</div>}
          </div>
          <div className="col-span-2">
            <label className="mb-1.5 block text-[13px] text-[#7A8076]">Field office</label>
            <input value={fieldOffice} maxLength={300} onChange={(e) => setFieldOffice(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="rounded-card border border-hair bg-white p-[26px]">
        <div className="mb-1.5 font-display text-[18px] font-extrabold text-forest">
          Shipping &amp; notifications
        </div>
        {TOGGLE_DEFS.map((t) => {
          const on = toggles[t.key];
          return (
            <div key={t.key} className="flex items-center justify-between border-b border-[#F2EFE6] py-3.5 last:border-0">
              <div>
                <div className="text-[14.5px] font-semibold text-forest">{t.label}</div>
                <div className="text-[13px] text-fg3">{t.desc}</div>
              </div>
              <button
                onClick={() => setToggles((s) => ({ ...s, [t.key]: !s[t.key] }))}
                className="h-[26px] w-[46px] rounded-full p-[3px] transition-colors"
                style={{ background: on ? "#6FAE52" : "#D2CFC1" }}
                aria-pressed={on}
                aria-label={t.label}
              >
                <div
                  className="h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition-transform"
                  style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={loading || saving || !emailOk} className="btn-primary px-[26px] py-[13px] text-sm">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm font-semibold text-leaf-700">Saved ✓</span>}
      </div>
    </div>
  );
}
