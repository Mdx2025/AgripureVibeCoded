"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, FlaskConical, Gauge, Droplets, Sprout, ShieldCheck, Check } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import { CROP_NAMES } from "@/lib/data/crop-names";
import type { ProductRow } from "@/lib/repo";

type Stage = { key: string; label: string; timing: string; desc: string; productIds: string[] };

const STAGES: Stage[] = [
  { key: "soil", label: "Soil Prep", timing: "Before planting", desc: "We rebuild living soil and clear weed pressure before the crop ever goes in the ground — setting the foundation for the whole season.", productIds: ["restore", "cleanse"] },
  { key: "germ", label: "Germination", timing: "Planting → emergence", desc: "As seeds go down, we wake them up and drive deep, even rooting for a fast, uniform, vigorous stand.", productIds: ["strength"] },
  { key: "veg", label: "Vegetative Growth", timing: "Canopy building", desc: "We fuel balanced vegetative growth and maximum photosynthetic leaf area — the engine for everything that follows.", productIds: ["grow"] },
  { key: "protect", label: "Protection", timing: "Throughout the season", desc: "We stay ahead of pests and disease with preventive, residue-conscious defense — applied before pressure costs you yield.", productIds: ["protect", "prevent"] },
  { key: "yield", label: "Bloom & Harvest", timing: "Flowering → fruit fill", desc: "We push flowering, fruit set, and fill for a bigger, cleaner, higher-value harvest at the finish line.", productIds: ["boost"] },
];

export default function HowItWorks({ products }: { products: ProductRow[] }) {
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const ordered = useMemo(
    () => ["restore", "cleanse", "strength", "grow", "protect", "prevent", "boost"].map((id) => byId[id]).filter(Boolean),
    [byId],
  );

  // Step 1 — crop picker
  const [crop, setCrop] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const n = query.trim().toLowerCase();
    return (n ? CROP_NAMES.filter((c) => c.toLowerCase().includes(n)) : CROP_NAMES).slice(0, 8);
  }, [query]);

  // Step 3 — lifecycle timeline
  const [stage, setStage] = useState(0);
  const active = STAGES[stage];
  const img = (p: ProductRow) => p.image?.trim() || bottleSrc(p.id);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-forest px-6 py-24 text-center text-white sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(191,232,154,.22)_0%,rgba(0,23,6,0)_60%)]" />
        <div className="relative mx-auto max-w-[820px]">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFE89A]">How it works</div>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,72px)] font-black leading-[1.02] tracking-[-0.02em]">
            From custom formula to harvest.
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-[clamp(17px,2.2vw,21px)] leading-[1.6] text-[#D7E5CC]">
            Seven natural inputs, custom-built for your crop, injected straight into your irrigation, and applied
            across the whole lifecycle of the plant. Here&apos;s the entire process — start to finish.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {[["01", "Formulate"], ["02", "Deliver"], ["03", "Apply"]].map(([n, l]) => (
              <div key={n} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-sm font-semibold">
                <span className="font-mono text-[#BFE89A]">{n}</span> {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEP 1 — CUSTOM FORMULATION */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <StepHead n="01" title="We formulate all seven — for your exact crop" />
        <p className="mt-4 max-w-[680px] text-[18px] leading-[1.7] text-fg2">
          Every program starts in the lab. AgriPure creates a <strong className="text-forest">custom, proprietary
          formulation of all seven products</strong>, specific to the crop you&apos;re growing — and tuned to each
          phase of that crop&apos;s lifecycle. No two crops get the same blend.
        </p>

        {/* interactive crop picker */}
        <div className="mt-8 rounded-panel border border-hair bg-white p-6 sm:p-8">
          <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-leaf">Try it — pick your crop</div>
          <div className="relative mt-3 max-w-[460px]">
            <div className="flex items-center gap-2 rounded-[14px] border border-hair bg-paper-2 px-4 py-3.5 focus-within:border-leaf">
              <Search size={20} className="text-fg3" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="e.g. Almond, Wine grapes, Strawberry…"
                className="w-full bg-transparent text-[17px] outline-none"
              />
            </div>
            {open && matches.length > 0 && (
              <div className="absolute z-30 mt-1.5 max-h-[260px] w-full overflow-y-auto rounded-[14px] border border-hair bg-white p-1.5 shadow-g-lg">
                {matches.map((c) => (
                  <button key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => { setCrop(c); setQuery(c); setOpen(false); }}
                    className="block w-full rounded-lg px-3.5 py-2.5 text-left text-[15px] text-[#3F463E] hover:bg-[#FAF8F2]">
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {crop && (
            <div className="mt-7">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-forest">
                <Check size={18} className="text-leaf-700" /> Your custom 7-product program for <span className="text-leaf-700">{crop}</span>
              </div>
              <div key={crop} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {ordered.map((p, i) => (
                  <div key={p.id} className="ap-rise rounded-[14px] border border-hair bg-paper-2 p-3 text-center" style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="flex h-[84px] items-end justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img(p)} alt={p.name} className="h-[80px] w-auto object-contain" />
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-fg3">No. {p.num}</div>
                    <div className="font-display text-[14px] font-extrabold text-forest">{p.name}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-fg3">
                Each blend is proprietary and crop-specific — formulated to the phase of {crop}&apos;s lifecycle it&apos;s used in.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* STEP 2 — FERTIGATION */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <StepHead n="02" title="Delivered through your irrigation — precisely dosed" />
          <p className="mt-4 max-w-[680px] text-[18px] leading-[1.7] text-fg2">
            There&apos;s no separate spray crew or guesswork. Each of the seven products is metered into your existing
            irrigation through a <strong className="text-forest">fertigation system</strong> — the exact dose injected
            into the water and carried to the plant by <strong className="text-forest">drip and/or spray</strong> lines.
          </p>

          {/* flow diagram */}
          <div className="mt-9 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
            <FlowCard icon={<FlaskConical size={26} />} title="7 custom products" body="Your crop-specific program, ready to dose." />
            <Connector />
            <FlowCard icon={<Gauge size={26} />} title="Fertigation injector" body="Meters the precise dose of each product into the irrigation water." />
            <Connector />
            <FlowCard icon={<Droplets size={26} />} title="Drip & spray lines" body="Carries the dose to the root zone and canopy, evenly." />
            <Connector />
            <FlowCard icon={<Sprout size={26} />} title="Healthy crop" body="The right input, the right amount, at the right time." accent />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-[14px] text-fg2">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-leaf-600" /> No extra passes or equipment</span>
            <span className="inline-flex items-center gap-2"><Gauge size={17} className="text-leaf-600" /> Exact per-acre dosing</span>
            <span className="inline-flex items-center gap-2"><Droplets size={17} className="text-leaf-600" /> Works with existing drip / spray</span>
          </div>
        </div>
      </section>

      {/* STEP 3 — LIFECYCLE TIMELINE */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <StepHead n="03" title="Applied across the entire lifecycle" />
        <p className="mt-4 max-w-[680px] text-[18px] leading-[1.7] text-fg2">
          The seven aren&apos;t a one-time treatment — they&apos;re a season-long program. Tap each stage to see what we
          apply and why.
        </p>

        {/* timeline rail */}
        <div className="ap-sc mt-9 flex gap-2 overflow-x-auto pb-2">
          {STAGES.map((s, i) => {
            const on = i === stage;
            return (
              <button key={s.key} onClick={() => setStage(i)}
                className={`flex flex-1 min-w-[150px] flex-col items-start gap-1 rounded-[16px] border px-4 py-3.5 text-left transition-all ${
                  on ? "border-leaf bg-[#F2F7EC]" : "border-hair bg-white hover:border-leaf"
                }`}>
                <span className={`font-mono text-[11px] ${on ? "text-leaf-700" : "text-fg3"}`}>STAGE {i + 1}</span>
                <span className="font-display text-[16px] font-extrabold text-forest">{s.label}</span>
                <span className="text-[11.5px] text-fg3">{s.timing}</span>
              </button>
            );
          })}
        </div>

        {/* progress bar */}
        <div className="mt-3 flex gap-1.5">
          {STAGES.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= stage ? "bg-leaf" : "bg-hair"}`} />
          ))}
        </div>

        {/* active stage detail */}
        <div key={active.key} className="ap-rise mt-7 grid items-center gap-8 rounded-panel border border-hair bg-white p-7 sm:p-9 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-leaf-700">Stage {stage + 1} · {active.timing}</div>
            <h3 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-forest">{active.label}</h3>
            <p className="mt-4 text-[17px] leading-[1.7] text-fg2">{active.desc}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E9F0E0] px-4 py-2 text-[13px] font-semibold text-leaf-700">
              <Droplets size={15} /> Applied via fertigation
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.productIds.map((id) => {
              const p = byId[id];
              if (!p) return null;
              return (
                <Link key={id} href={`/products/${id}`} className="ap-card flex gap-4 rounded-[16px] border border-hair bg-paper-2 p-4">
                  <div className="flex h-[96px] w-[64px] flex-none items-end justify-center rounded-xl"
                    style={{ background: `radial-gradient(circle at 50% 75%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p)} alt={p.name} className="h-[88px] w-auto object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[11px]" style={{ color: p.accent }}>No. {p.num}</div>
                    <div className="font-display text-[19px] font-extrabold text-forest">{p.name}</div>
                    <div className="text-[12.5px] text-fg3">{p.category}</div>
                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-[1.5] text-fg2">{p.blurb}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="m-0 font-display text-[clamp(30px,5vw,44px)] font-black tracking-[-0.02em] text-forest">
            Ready to build your program?
          </h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-[#4A524B]">
            Tell us your crop, soil, and pressures — we&apos;ll formulate all seven and price it by your acreage.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/pricing" className="btn-ghost px-8 py-[15px] text-[16px]">See pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-forest font-display text-[20px] font-black text-white">{n}</span>
      <h2 className="font-display text-[clamp(26px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-forest">{title}</h2>
    </div>
  );
}

function FlowCard({ icon, title, body, accent }: { icon: React.ReactNode; title: string; body: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col rounded-[18px] border p-5 ${accent ? "border-leaf bg-[#F2F7EC]" : "border-hair bg-paper-2"}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${accent ? "bg-leaf text-white" : "bg-[#E9F0E0] text-leaf-700"}`}>{icon}</div>
      <div className="mt-3.5 font-display text-[17px] font-extrabold text-forest">{title}</div>
      <p className="mt-1.5 text-[13.5px] leading-[1.5] text-fg2">{body}</p>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center lg:px-1">
      <div className="ap-flow h-[3px] w-10 rounded-full lg:w-full lg:min-w-[24px]" />
    </div>
  );
}
