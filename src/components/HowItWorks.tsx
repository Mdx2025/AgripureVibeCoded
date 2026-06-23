"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical, Gauge, Droplets, Sprout, ShieldCheck, Clock, Beaker, Atom, Sparkles, TrendingUp, Ban } from "lucide-react";
import { bottleSrc } from "@/lib/products";
import type { ProductRow } from "@/lib/repo";

type Phase = { id: string; phase: string; timing: string; role: string };

// The seven, in the order they're applied across the crop's lifecycle.
const LIFECYCLE: Phase[] = [
  { id: "restore", phase: "Soil preparation", timing: "Before planting", role: "Step one is the ground itself — we rebuild living soil so everything that follows has a healthy foundation." },
  { id: "cleanse", phase: "Weed control", timing: "Pre-emergent · before the crop comes up", role: "Next we clear the field, knocking back weed pressure during the window that matters most — before your crop emerges." },
  { id: "strength", phase: "Germination & rooting", timing: "At planting, through emergence", role: "As seeds go in, we wake them up and drive deep, even roots for a fast, uniform, vigorous stand." },
  { id: "grow", phase: "Vegetative growth", timing: "As the canopy builds", role: "Through the vegetative phase we fuel balanced growth and maximum leaf area — the engine for yield." },
  { id: "protect", phase: "Pest protection", timing: "Through the season, as pests appear", role: "Mid-season, we defend the crop from insect pressure with botanical actives that spare pollinators and beneficials." },
  { id: "prevent", phase: "Disease prevention", timing: "Ahead of fungal & viral pressure", role: "Alongside pest control, we get ahead of disease — priming the plant's defenses before fungal and viral pressure costs yield." },
  { id: "boost", phase: "Bloom, fruit & harvest", timing: "Flowering through fruit fill", role: "At the finish, we push flowering, fruit set, and fill for a bigger, cleaner, higher-value harvest." },
];

export default function HowItWorks({ products }: { products: ProductRow[] }) {
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
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

      {/* STEP 1 — NANO POTENTIZATION */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <StepHead n="01" title="Potentized with nano technology" />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* explanation */}
          <div>
            <p className="text-[18px] leading-[1.75] text-fg2">
              Every program starts with natural <strong className="text-forest">remedies</strong>. We run them through a
              <strong className="text-forest"> potentization machine</strong> that uses nano technology to reduce each
              remedy down to a nano scale — small enough for the plant to absorb it
              <strong className="text-forest"> directly through water</strong>.
            </p>
            <p className="mt-4 text-[18px] leading-[1.75] text-fg2">
              Carried in through irrigation, these nano-potentized inputs flood the crop with super nutrients and switch
              on the plant&apos;s own defenses — so it becomes naturally pest- and disease-resistant, soil health is
              rebuilt, and yields climb toward nature&apos;s natural crop-loss rate. All with
              <strong className="text-forest"> zero chemicals or pesticides</strong>.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {[
                { Icon: Beaker, t: "Start with natural remedies", d: "Proven, plant-derived inputs — nothing synthetic." },
                { Icon: Atom, t: "Potentize to nano scale", d: "The potentization machine shrinks them with nano technology." },
                { Icon: Droplets, t: "Absorbed through water", d: "Suspended in irrigation and taken up straight by the plant." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#E9F0E0] text-leaf-700"><Icon size={21} /></div>
                  <div>
                    <div className="font-display text-[16px] font-extrabold text-forest">{t}</div>
                    <div className="text-[14px] text-fg2">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* graphic */}
          <div className="relative overflow-hidden rounded-panel border border-[#16361d] bg-forest p-8 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_35%,rgba(111,174,82,.28)_0%,rgba(0,23,6,0)_62%)]" />
            <div className="relative">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#BFE89A]">The potentization machine</div>
              <PotentizationGraphic />
              <div className="mt-3 font-display text-[18px] font-extrabold">Remedy → potentized → into the water</div>
              <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] leading-[1.6] text-[#C9DBC0]">
                Nano-scale particles stay suspended in irrigation water — absorbed directly by roots and leaves to deliver the remedy where the plant can use it.
              </p>
            </div>
          </div>
        </div>

        {/* outcomes */}
        <div className="mt-12">
          <div className="text-center text-[13px] font-bold uppercase tracking-[0.12em] text-leaf">What nano-potentization delivers</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { Icon: Sparkles, t: "Super nutrients" },
              { Icon: ShieldCheck, t: "Naturally pest & disease resistant" },
              { Icon: Sprout, t: "Rebuilt soil health" },
              { Icon: TrendingUp, t: "Higher yields & output" },
              { Icon: Ban, t: "No chemicals or pesticides" },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-3 rounded-[16px] border border-hair bg-white p-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><Icon size={24} /></div>
                <div className="font-display text-[15px] font-extrabold leading-tight text-forest">{t}</div>
              </div>
            ))}
          </div>
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

      {/* STEP 3 — EVERY PRODUCT ACROSS THE LIFECYCLE (scroll-through) */}
      <section className="bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <StepHead n="03" title="Every product, across the crop's lifecycle" />
          <p className="mt-4 max-w-[700px] text-[18px] leading-[1.7] text-fg2">
            The seven aren&apos;t a one-time treatment — they&apos;re a season-long program, applied in order from soil
            prep to harvest. Here&apos;s exactly what each one does and when. Just scroll the season top to bottom.
          </p>

          <div className="relative mt-12">
            {/* the season spine */}
            <div className="pointer-events-none absolute bottom-0 left-[26px] top-2 w-[3px] rounded-full bg-gradient-to-b from-leaf via-[#9FC08A] to-[#C99A2E] sm:left-[31px]" />

            <div className="flex flex-col gap-7">
              {LIFECYCLE.map((item, i) => {
                const p = byId[item.id];
                if (!p) return null;
                return (
                  <div key={item.id} className="relative flex gap-5 sm:gap-8">
                    {/* numbered node on the spine */}
                    <div className="relative z-10 flex-none">
                      <div
                        className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-4 border-paper-2 font-display text-[19px] font-black text-white shadow-g-sm sm:h-16 sm:w-16 sm:text-[24px]"
                        style={{ background: p.accent }}
                      >
                        {i + 1}
                      </div>
                    </div>

                    {/* product card */}
                    <div className="flex-1 overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
                      <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-[170px_1fr] md:gap-8">
                        <div className="flex items-center justify-center rounded-[18px] py-5"
                          style={{ background: `radial-gradient(circle at 50% 70%, ${p.accentSoft} 0%, #FAF8F2 75%)` }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img(p)} alt={p.name} className="h-[160px] w-auto object-contain drop-shadow-[0_14px_24px_rgba(0,40,8,.2)]" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: p.accent, background: p.accentSoft }}>
                              {item.phase}
                            </span>
                            <span className="font-mono text-[11px] text-fg3">No. {p.num} · {p.type}</span>
                          </div>
                          <h3 className="mt-2.5 font-display text-[28px] font-extrabold tracking-[-0.02em] text-forest">{p.name}</h3>
                          <div className="text-[15px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                          <p className="mt-3 text-[15px] font-medium italic leading-[1.6] text-[#5A6152]">{item.role}</p>
                          <p className="mt-2.5 text-[15.5px] leading-[1.65] text-fg2">{p.long}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[13px]">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E0] px-3 py-1.5 font-semibold text-leaf-700"><Droplets size={14} /> Applied via fertigation</span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-fg2"><Clock size={14} /> {item.timing}</span>
                            <Link href={`/products/${p.id}`} className="ap-link inline-flex items-center gap-1 font-semibold !text-leaf-600">Full details <ArrowRight size={13} strokeWidth={2.4} /></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* harvest bookend */}
              <div className="relative flex items-center gap-5 sm:gap-8">
                <div className="relative z-10 flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full border-4 border-paper-2 bg-forest text-white shadow-g-sm sm:h-16 sm:w-16">
                  <Sprout size={26} />
                </div>
                <div className="font-display text-[clamp(18px,3vw,24px)] font-extrabold text-forest">
                  A cleaner, higher-value harvest — soil to harvest, all seven working as one.
                </div>
              </div>
            </div>
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

/** Animated nano-potentization graphic: a remedy core emitting nano waves into the water. */
function PotentizationGraphic() {
  const orbits = [0, 60, 120];
  const electrons = [
    [228, 120], [189, 187], [111, 53],
  ];
  return (
    <svg viewBox="0 0 300 240" className="mx-auto mt-5 h-[210px] w-full max-w-[360px]" role="img" aria-label="Remedies potentized to nano scale and carried in water">
      <defs>
        <radialGradient id="apCore" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E8FBD2" />
          <stop offset="100%" stopColor="#6FAE52" />
        </radialGradient>
      </defs>

      {/* nano waves emanating outward */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="150" cy="120" r="26" fill="none" stroke="#6FAE52" strokeWidth="2">
          <animate attributeName="r" values="26;96" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.75;0" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* electron orbits */}
      {orbits.map((a) => (
        <ellipse key={a} cx="150" cy="120" rx="80" ry="28" fill="none" stroke="#9FD27E" strokeWidth="1.5" opacity="0.5" transform={`rotate(${a} 150 120)`} />
      ))}

      {/* electrons (small nano particles) */}
      {electrons.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="#BFE89A">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* potentized remedy core */}
      <circle cx="150" cy="120" r="20" fill="url(#apCore)" />
      <circle cx="150" cy="120" r="20" fill="none" stroke="#EAF7DD" strokeWidth="1.5" opacity="0.7" />

      {/* a falling water droplet feeding in from the top */}
      <path d="M150 18 C158 30 164 38 164 46 a14 14 0 1 1 -28 0 c0 -8 6 -16 14 -28 z" fill="#BFE89A" opacity="0.85">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
