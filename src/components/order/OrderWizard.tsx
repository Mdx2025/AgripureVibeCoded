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

const field = "w-full rounded-[14px] border border-hair bg-white px-5 py-4 text-[18px] outline-none focus:border-leaf";

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
      body: <MultiCombobox size="lg" value={crops} onChange={setCrops} options={CROP_NAMES} placeholder="e.g. Almond, Wheat, Strawberry…" />,
    },
    {
      title: "How many acres of each crop?",
      sub: "Set the acreage for every crop — this drives your custom quote.",
      valid: crops.every((c) => (acres[c] || 0) >= 1),
      body: (
        <div className="grid gap-5 md:grid-cols-2">
          {crops.map((c) => (
            <div key={c} className="rounded-[16px] border border-hair bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-[20px] font-extrabold text-forest">{c}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={1} max={5000} value={acres[c] ?? 0}
                    onChange={(e) => setAcres((p) => ({ ...p, [c]: Math.max(0, parseInt(e.target.value || "0", 10)) }))}
                    className="w-[110px] rounded-[12px] border border-hair px-3 py-2.5 text-right font-mono text-[19px] outline-none focus:border-leaf"
                  />
                  <span className="text-[15px] text-fg3">acres</span>
                </div>
              </div>
              <input
                type="range" min={1} max={2000} step={5} value={Math.min(acres[c] ?? 0, 2000)}
                onChange={(e) => setAcres((p) => ({ ...p, [c]: parseInt(e.target.value, 10) }))}
                className="h-2 w-full accent-leaf"
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
      body: <MultiCombobox size="lg" value={soil} onChange={setSoil} options={SOIL_PROBLEMS} placeholder="e.g. Nitrogen deficiency, Low pH…" noneLabel={NONE.soil} />,
    },
    {
      title: "Any weed problems?",
      sub: "Tell us which weeds you fight — search, add custom, or mark none.",
      valid: weeds.length > 0,
      body: <MultiCombobox size="lg" value={weeds} onChange={setWeeds} options={WEEDS} placeholder="e.g. Pigweed, Nutsedge…" noneLabel={NONE.weeds} />,
    },
    {
      title: "Pest problems by crop",
      sub: "Select the pests affecting each crop, or mark none.",
      valid: crops.every((c) => (pests[c] || []).length > 0),
      body: (
        <div className="grid gap-7 md:grid-cols-2">
          {crops.map((c) => (
            <div key={c}>
              <div className="mb-2.5 font-display text-[18px] font-extrabold text-forest">{c}</div>
              <MultiCombobox size="lg" value={pests[c] || []} onChange={(v) => setPests((p) => ({ ...p, [c]: v }))} options={PESTS} placeholder="e.g. Aphids, Spider mites…" noneLabel={NONE.pests} />
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
        <div className="grid gap-7 md:grid-cols-2">
          {crops.map((c) => (
            <div key={c}>
              <div className="mb-2.5 font-display text-[18px] font-extrabold text-forest">{c}</div>
              <MultiCombobox size="lg" value={diseases[c] || []} onChange={(v) => setDiseases((p) => ({ ...p, [c]: v }))} options={DISEASES} placeholder="e.g. Powdery mildew, Mosaic virus…" noneLabel={NONE.diseases} />
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
        <div className="grid gap-4 md:grid-cols-2">
          {crops.map((c) => (
            <div key={c} className="flex items-center justify-between rounded-[16px] border border-hair bg-white px-5 py-4">
              <span className="font-display text-[19px] font-extrabold text-forest">{c}</span>
              <div className="flex rounded-full bg-[#EDEAE0] p-1 text-[15px] font-bold">
                <button onClick={() => setYieldP((p) => ({ ...p, [c]: true }))} className={`rounded-full px-5 py-2 ${yieldP[c] ? "bg-forest text-white" : "text-fg2"}`}>Yes</button>
                <button onClick={() => setYieldP((p) => ({ ...p, [c]: false }))} className={`rounded-full px-5 py-2 ${!yieldP[c] ? "bg-leaf text-[#04230B]" : "text-fg2"}`}>No</button>
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
        <div className="grid gap-5 md:grid-cols-2">
          <input className={field} placeholder="Full name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <input className={field} placeholder="Email address" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          <input className={field} placeholder="Phone number" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <input className={field} placeholder="Business name" value={customer.business} onChange={(e) => setCustomer({ ...customer, business: e.target.value })} />
          <input className={`md:col-span-2 ${field}`} placeholder="Farm address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
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
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-container flex-col px-6 pb-12 pt-9 sm:px-10">
      {/* header */}
      <div className="flex-none">
        <div className="flex items-baseline justify-between">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Order now · custom formulation</div>
          <div className="font-mono text-[13px] uppercase tracking-[0.1em] text-fg3">Step {step + 1} of {STEPS.length}</div>
        </div>
        <div className="mt-4 flex gap-2">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full transition-all ${i < step ? "bg-leaf-600" : i === step ? "bg-leaf" : "bg-hair"}`} />
          ))}
        </div>
      </div>

      {/* body — fills the screen */}
      <div className="flex flex-1 flex-col justify-center py-10">
        <h1 className="font-display text-[clamp(34px,5vw,56px)] font-black leading-[1.05] tracking-[-0.02em] text-forest">
          {cur.title}
        </h1>
        <p className="mt-3 max-w-[760px] text-[clamp(17px,2.2vw,21px)] leading-[1.5] text-fg2">{cur.sub}</p>

        <div className="mt-9">{cur.body}</div>

        {error && <div className="mt-5 text-[16px] font-semibold text-[#B23A1E]">{error}</div>}
      </div>

      {/* footer — full-width rail */}
      <div className="flex-none border-t border-hair pt-6">
        {totalAcres > 0 && step >= 1 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-hair bg-white px-6 py-4 text-[17px]">
            <span className="text-fg2">{totalAcres.toLocaleString()} acres · {q.bundles} × 6-gal bundles</span>
            <span className="font-mono text-[19px] font-semibold text-forest">est. {money(q.total)} <span className="text-[15px] font-normal text-fg3">· {money(q.effective)}/ac</span></span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => (step === 0 ? router.push("/products") : setStep(step - 1))}
            className="btn-ghost px-7 py-4 text-[16px]"
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step < last ? (
            <button onClick={() => cur.valid && setStep(step + 1)} disabled={!cur.valid} className="btn-primary px-9 py-4 text-[16px]">
              {step === last - 1 ? "Get custom quote" : "Continue"} <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={submit} disabled={!cur.valid || submitting} className="btn-leaf px-9 py-4 text-[16px]">
              {submitting ? "Creating your quote…" : "Get my quote"} <Check size={18} strokeWidth={2.6} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
