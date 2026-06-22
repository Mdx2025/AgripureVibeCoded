"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import MultiCombobox from "./MultiCombobox";
import { SOIL_PROBLEMS, WEEDS, PESTS, DISEASES, NONE } from "@/lib/order-options";
import { CROP_NAMES } from "@/lib/data/crop-names";
import { quoteForAcres, money } from "@/lib/pricing";

type Rec<T> = Record<string, T>;
const sync = <T,>(crops: string[], prev: Rec<T>, init: T): Rec<T> =>
  Object.fromEntries(crops.map((c) => [c, prev[c] ?? init]));

const field = "w-full rounded-[12px] border border-hair bg-white px-3.5 py-3 text-[15px] outline-none focus:border-leaf";

export default function OrderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [crops, setCropsRaw] = useState<string[]>([]);
  const [acres, setAcres] = useState<Rec<number>>({});
  const [soil, setSoil] = useState<string[]>([]);
  const [weeds, setWeeds] = useState<string[]>([]);
  const [pests, setPests] = useState<Rec<string[]>>({});
  const [diseases, setDiseases] = useState<Rec<string[]>>({});
  const [yieldP, setYieldP] = useState<Rec<boolean>>({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", business: "", address: "" });

  const setCrops = (next: string[]) => {
    setCropsRaw(next);
    setAcres((p) => sync(next, p, 50));
    setPests((p) => sync(next, p, []));
    setDiseases((p) => sync(next, p, []));
    setYieldP((p) => sync(next, p, false));
  };

  const totalAcres = crops.reduce((t, c) => t + (acres[c] || 0), 0);
  const q = quoteForAcres(totalAcres);

  const STEPS = [
    {
      title: "What are you growing?",
      sub: "Select every crop in your operation. Type to search or add your own.",
      valid: crops.length > 0,
      body: <MultiCombobox value={crops} onChange={setCrops} options={CROP_NAMES} placeholder="e.g. Almond, Wheat, Strawberry…" />,
    },
    {
      title: "How many acres of each crop?",
      sub: "Set the acreage for every crop — this drives your custom quote.",
      valid: crops.every((c) => (acres[c] || 0) >= 1),
      body: (
        <div className="flex flex-col gap-5">
          {crops.map((c) => (
            <div key={c} className="rounded-[14px] border border-hair bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-[16px] font-extrabold text-forest">{c}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={1} max={5000} value={acres[c] ?? 0}
                    onChange={(e) => setAcres((p) => ({ ...p, [c]: Math.max(0, parseInt(e.target.value || "0", 10)) }))}
                    className="w-[90px] rounded-[10px] border border-hair px-2.5 py-1.5 text-right font-mono text-[15px] outline-none focus:border-leaf"
                  />
                  <span className="text-[13px] text-fg3">acres</span>
                </div>
              </div>
              <input
                type="range" min={1} max={2000} step={5} value={Math.min(acres[c] ?? 0, 2000)}
                onChange={(e) => setAcres((p) => ({ ...p, [c]: parseInt(e.target.value, 10) }))}
                className="w-full accent-leaf"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Any soil problems or deficiencies?",
      sub: "Search and select all that apply, add your own, or mark none.",
      valid: soil.length > 0,
      body: <MultiCombobox value={soil} onChange={setSoil} options={SOIL_PROBLEMS} placeholder="e.g. Nitrogen deficiency, Low pH…" noneLabel={NONE.soil} />,
    },
    {
      title: "Any weed problems?",
      sub: "Tell us which weeds you fight — search, add custom, or mark none.",
      valid: weeds.length > 0,
      body: <MultiCombobox value={weeds} onChange={setWeeds} options={WEEDS} placeholder="e.g. Pigweed, Nutsedge…" noneLabel={NONE.weeds} />,
    },
    {
      title: "Pest problems by crop",
      sub: "Select the pests affecting each crop, or mark none.",
      valid: crops.every((c) => (pests[c] || []).length > 0),
      body: (
        <div className="flex flex-col gap-6">
          {crops.map((c) => (
            <div key={c}>
              <div className="mb-2 font-display text-[15px] font-extrabold text-forest">{c}</div>
              <MultiCombobox value={pests[c] || []} onChange={(v) => setPests((p) => ({ ...p, [c]: v }))} options={PESTS} placeholder="e.g. Aphids, Spider mites…" noneLabel={NONE.pests} />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Viral & fungal problems by crop",
      sub: "Select the diseases affecting each crop, or mark none.",
      valid: crops.every((c) => (diseases[c] || []).length > 0),
      body: (
        <div className="flex flex-col gap-6">
          {crops.map((c) => (
            <div key={c}>
              <div className="mb-2 font-display text-[15px] font-extrabold text-forest">{c}</div>
              <MultiCombobox value={diseases[c] || []} onChange={(v) => setDiseases((p) => ({ ...p, [c]: v }))} options={DISEASES} placeholder="e.g. Powdery mildew, Mosaic virus…" noneLabel={NONE.diseases} />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Crop yield problems?",
      sub: "Are you seeing yield or quality loss in any of these crops?",
      valid: true,
      body: (
        <div className="flex flex-col gap-3">
          {crops.map((c) => (
            <div key={c} className="flex items-center justify-between rounded-[14px] border border-hair bg-white px-4 py-3">
              <span className="font-display text-[15px] font-extrabold text-forest">{c}</span>
              <div className="flex rounded-full bg-[#EDEAE0] p-1 text-[13px] font-bold">
                <button onClick={() => setYieldP((p) => ({ ...p, [c]: true }))} className={`rounded-full px-4 py-1.5 ${yieldP[c] ? "bg-forest text-white" : "text-fg2"}`}>Yes</button>
                <button onClick={() => setYieldP((p) => ({ ...p, [c]: false }))} className={`rounded-full px-4 py-1.5 ${!yieldP[c] ? "bg-leaf text-[#04230B]" : "text-fg2"}`}>No</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Get your custom quote",
      sub: "Where should we send your quote? This creates your AgriPure account.",
      valid:
        customer.name.trim() !== "" && /\S+@\S+\.\S+/.test(customer.email) &&
        customer.phone.trim() !== "" && customer.business.trim() !== "" && customer.address.trim() !== "",
      body: (
        <div className="grid grid-cols-2 gap-3.5">
          <input className={field} placeholder="Full name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <input className={field} placeholder="Email address" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          <input className={field} placeholder="Phone number" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <input className={field} placeholder="Business name" value={customer.business} onChange={(e) => setCustomer({ ...customer, business: e.target.value })} />
          <input className={`col-span-2 ${field}`} placeholder="Farm address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
        </div>
      ),
    },
  ];

  const last = STEPS.length - 1;
  const cur = STEPS[step];

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          crops, acres, soil, weeds,
          pestsByCrop: pests, diseasesByCrop: diseases, yieldByCrop: yieldP,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not create quote");
      const data = await res.json();
      try { if (data.tempPassword) sessionStorage.setItem(`ap_pw_${data.id}`, data.tempPassword); } catch { /* ignore */ }
      router.push(`/order-now/quote/${data.id}?new=${data.isNewAccount ? 1 : 0}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[760px] px-6 pb-24 pt-12">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Order now · custom formulation</div>
        <h1 className="mt-2 font-display text-[clamp(32px,5vw,44px)] font-black tracking-[-0.02em] text-forest">
          Build your program
        </h1>
      </div>

      {/* progress */}
      <div className="mt-7 flex items-center justify-center gap-1.5">
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-leaf" : i < step ? "w-5 bg-leaf-600" : "w-5 bg-hair"}`} />
        ))}
      </div>
      <div className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg3">
        Step {step + 1} of {STEPS.length}
      </div>

      {/* card */}
      <div className="mt-6 rounded-panel border border-hair bg-paper-2 p-7 shadow-g-sm">
        <h2 className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-forest">{cur.title}</h2>
        <p className="mt-1.5 text-[15px] text-fg2">{cur.sub}</p>
        <div className="mt-6">{cur.body}</div>
        {error && <div className="mt-4 text-sm font-semibold text-[#B23A1E]">{error}</div>}
      </div>

      {/* running estimate */}
      {totalAcres > 0 && step >= 1 && (
        <div className="mt-4 flex items-center justify-between rounded-[14px] border border-hair bg-white px-5 py-3 text-[14px]">
          <span className="text-fg2">{totalAcres.toLocaleString()} acres · {q.bundles} × 6-gal bundles</span>
          <span className="font-mono font-semibold text-forest">est. {money(q.total)} · {money(q.effective)}/ac</span>
        </div>
      )}

      {/* nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => (step === 0 ? router.push("/products") : setStep(step - 1))}
          className="btn-ghost px-6 py-3 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {step < last ? (
          <button onClick={() => cur.valid && setStep(step + 1)} disabled={!cur.valid} className="btn-primary px-7 py-3 text-sm">
            {step === last - 1 ? "Get custom quote" : "Continue"} <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={submit} disabled={!cur.valid || submitting} className="btn-leaf px-7 py-3 text-sm">
            {submitting ? "Creating your quote…" : "Get my quote"} <Check size={16} strokeWidth={2.6} />
          </button>
        )}
      </div>
    </div>
  );
}
