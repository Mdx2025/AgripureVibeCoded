import Link from "next/link";
import type { Metadata } from "next";
import {
  Atom, Droplets, Waves, Beaker, Sprout, Leaf, ShieldCheck, Ban,
  ArrowRight, Globe, History, Check,
} from "lucide-react";

import { resolveSeoMetadata } from "@/lib/repo";
import NanoTechV2 from "@/components/nanotech/NanoTechV2";
import VariationSwitcher from "@/components/ui/VariationSwitcher";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/nano-technology");
}

const OPTIONS = [
  { v: "1", name: "Detailed" },
  { v: "2", name: "Cinematic" },
];

export default function NanoTechnologyPage({ searchParams }: { searchParams?: { v?: string } }) {
  const v = searchParams?.v === "2" ? "2" : "1";
  return (
    <>
      {v === "2" ? <NanoTechV2 /> : <V1 />}
      <VariationSwitcher current={v} options={OPTIONS} label="Nano tech" />
    </>
  );
}

function V1() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-forest px-6 py-24 text-center text-white sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(191,232,154,.24)_0%,rgba(0,23,6,0)_60%)]" />
        <div className="relative mx-auto max-w-[820px]">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#BFE89A]"><Atom size={15} /> Nano Technology</div>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,72px)] font-black leading-[1.02] tracking-[-0.02em]">
            Potentized nano particles, explained.
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[clamp(17px,2.2vw,21px)] leading-[1.6] text-[#D7E5CC]">
            The natural science behind every AgriPure product — how we shrink proven natural remedies down to a nano
            scale so your plants can simply drink them in through water. No chemicals, no synthetics.
          </p>
        </div>
      </section>

      {/* 1 — WHAT ARE THEY */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The simple version</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              What is a potentized nano particle?
            </h2>
            <p className="mt-4 text-[18px] leading-[1.75] text-fg2">
              We start with <strong className="text-forest">natural source materials</strong> — minerals, plants, and
              other time-tested natural remedies. Each one is run through a <strong className="text-forest">potentization
              process</strong> that breaks it down again and again into smaller and smaller pieces — all the way to the
              <strong className="text-forest"> nano scale</strong> (billionths of a meter).
            </p>
            <p className="mt-4 text-[18px] leading-[1.75] text-fg2">
              At that size the active dissolves completely into water — small enough for a plant to absorb it
              <strong className="text-forest"> directly through its roots and leaves</strong>, the same way it drinks.
              That&apos;s the whole idea: take what nature already uses, make it nano, and let the plant take it in.
            </p>
          </div>

          {/* INFOGRAPHIC: how small is nano */}
          <div className="rounded-panel border border-hair bg-white p-7 shadow-g-sm">
            <div className="font-display text-[17px] font-extrabold text-forest">How small is &ldquo;nano&rdquo;?</div>
            <p className="mt-1 text-[13px] text-fg3">Each step is roughly 1,000× smaller than the last.</p>
            <svg viewBox="0 0 420 200" className="mt-4 w-full" role="img" aria-label="Size comparison from a grain of sand to a nano particle">
              <line x1="20" y1="150" x2="400" y2="150" stroke="#E2DFD2" strokeWidth="2" />
              {/* sand */}
              <circle cx="80" cy="120" r="34" fill="#E7Dcc4" stroke="#C9A86a" strokeWidth="1.5" />
              <text x="80" y="178" textAnchor="middle" className="fill-[#7A8076]" fontSize="11" fontFamily="monospace">grain of sand</text>
              <text x="80" y="192" textAnchor="middle" className="fill-[#A6A293]" fontSize="10" fontFamily="monospace">~1 mm</text>
              {/* hair */}
              <circle cx="220" cy="138" r="13" fill="#DDE7CF" stroke="#9FC08A" strokeWidth="1.5" />
              <text x="220" y="178" textAnchor="middle" className="fill-[#7A8076]" fontSize="11" fontFamily="monospace">human hair</text>
              <text x="220" y="192" textAnchor="middle" className="fill-[#A6A293]" fontSize="10" fontFamily="monospace">~75 µm</text>
              {/* nano */}
              <circle cx="360" cy="148" r="4" fill="#6FAE52" />
              <circle cx="360" cy="148" r="11" fill="none" stroke="#6FAE52" strokeWidth="1.5" opacity="0.5" />
              <text x="360" y="178" textAnchor="middle" className="fill-leaf-700" fontSize="11" fontFamily="monospace" fontWeight="bold">nano particle</text>
              <text x="360" y="192" textAnchor="middle" className="fill-[#A6A293]" fontSize="10" fontFamily="monospace">~50 nm</text>
              {/* arrow */}
              <text x="210" y="30" textAnchor="middle" className="fill-leaf" fontSize="12" fontFamily="monospace" fontWeight="bold">smaller → easier for the plant to absorb</text>
            </svg>
          </div>
        </div>
      </section>

      {/* 2 — HOW POTENTIZATION WORKS */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The process</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              How a remedy becomes a nano particle
            </h2>
            <p className="mx-auto mt-3 max-w-[640px] text-[17px] leading-[1.6] text-fg2">
              Potentization is a precise, repeatable process. Each round makes the particles smaller and the solution
              more thoroughly imprinted with the remedy.
            </p>
          </div>

          {/* INFOGRAPHIC: step flow */}
          <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
            <StepCard n="1" Icon={Beaker} title="Natural source" body="Start with a proven natural remedy — a mineral or plant extract. Nothing synthetic." />
            <Flow />
            <StepCard n="2" Icon={Droplets} title="Dilute in pure water" body="A measured amount is mixed into clean water, beginning to disperse the source." />
            <Flow />
            <StepCard n="3" Icon={Waves} title="Succuss (energize)" body="The solution is vigorously, rhythmically shaken — shattering the source into ever-finer nano particles and imprinting its pattern into the water." />
            <Flow />
            <StepCard n="4" Icon={Atom} title="Repeat to nano scale" body="Dilute-and-succuss is repeated to the target potency, until particles reach the nano scale." accent />
          </div>

          <div className="mt-6 rounded-[16px] border border-hair bg-paper-2 p-6 text-center">
            <div className="font-display text-[17px] font-extrabold text-forest">The result: a potentized nano-particle solution</div>
            <p className="mx-auto mt-1.5 max-w-[640px] text-[14.5px] leading-[1.6] text-fg2">
              A clear, water-soluble solution carrying the remedy at nano scale — ready to be metered into your
              irrigation and absorbed straight by the plant.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — POTENCY SCALE */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* INFOGRAPHIC: potency ladder */}
          <div className="rounded-panel border border-hair bg-white p-7 shadow-g-sm">
            <div className="font-display text-[17px] font-extrabold text-forest">The potency scale</div>
            <p className="mt-1 text-[13px] text-fg3">More rounds = smaller particles, a more deeply imprinted solution.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {[
                { label: "Source material", w: 22, note: "raw, full size" },
                { label: "Low potency", w: 45, note: "few rounds" },
                { label: "Six times potentized — our standard", w: 78, note: "field-proven for crops", on: true },
                { label: "High potency", w: 100, note: "most rounds, smallest particles" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1 flex items-baseline justify-between text-[13px]">
                    <span className={`font-semibold ${r.on ? "text-leaf-700" : "text-forest"}`}>{r.label}</span>
                    <span className="text-fg3">{r.note}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#F0EDE3]">
                    <div className="h-full rounded-full" style={{ width: `${r.w}%`, background: r.on ? "#4E8A3A" : "#9FC08A" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Reading the label</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              What &ldquo;six times potentized&rdquo; means
            </h2>
            <p className="mt-4 text-[18px] leading-[1.75] text-fg2">
              Each AgriPure remedy lists a <strong className="text-forest">potency</strong> — for example,
              <strong className="text-forest"> six times potentized</strong>. It simply tells you how many rounds of
              potentization the remedy went through. The more rounds, the smaller and more uniform the nano particles
              become.
            </p>
            <p className="mt-4 text-[18px] leading-[1.75] text-fg2">
              <strong className="text-forest">Six rounds is our workhorse potency for crops</strong> — refined over
              years of field use to be gentle on the plant and effective at the root and leaf. Different crops and
              stages call for different potencies, which is why every formula is custom-built.
            </p>
          </div>
        </div>
      </section>

      {/* 4 — HOW THEY WORK WITH PLANT & SOIL */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">In the field</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              How nano particles work with your plants &amp; soil
            </h2>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* INFOGRAPHIC: plant + soil cross-section */}
            <div className="rounded-panel border border-hair bg-[radial-gradient(circle_at_50%_20%,#EaF4DE_0%,#FAF8F2_70%)] p-6">
              <svg viewBox="0 0 320 300" className="mx-auto w-full max-w-[320px]" role="img" aria-label="Nano particles entering a plant through leaves and roots and feeding the soil">
                {/* soil */}
                <rect x="0" y="180" width="320" height="120" fill="#E7DCC6" />
                <rect x="0" y="180" width="320" height="10" fill="#D8C7A8" />
                {/* water droplets */}
                {[60, 150, 250].map((x, i) => (
                  <g key={x}>
                    <path d={`M${x} ${20 + i * 6} c5 8 9 12 9 17 a9 9 0 1 1 -18 0 c0 -5 4 -9 9 -17 z`} fill="#9FD27E" opacity="0.85">
                      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                    </path>
                  </g>
                ))}
                {/* stem */}
                <path d="M160 180 C160 150 158 120 160 92" stroke="#4E8A3A" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* leaves */}
                <path d="M160 120 C130 112 112 122 104 140 C134 144 154 136 160 120 Z" fill="#5BA03C" />
                <path d="M160 108 C190 100 208 110 216 128 C186 132 166 124 160 108 Z" fill="#6FAE52" />
                <path d="M160 92 C146 78 148 62 160 50 C172 62 174 78 160 92 Z" fill="#79B85E" />
                {/* roots */}
                <path d="M160 180 C150 210 138 224 120 250 M160 180 C168 212 178 228 196 252 M160 180 C160 214 160 234 160 264" stroke="#8a6a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* nano particles around roots + leaves */}
                {[[120, 232], [196, 236], [160, 250], [108, 150], [212, 124], [160, 60]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#4E8A3A">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                ))}
                {/* soil microbe dots */}
                {[[40, 220], [80, 260], [240, 215], [280, 255], [210, 270]].map(([x, y], i) => (
                  <circle key={`m${i}`} cx={x} cy={y} r="2.5" fill="#B98A4A" opacity="0.7" />
                ))}
              </svg>
            </div>

            {/* uptake explanation */}
            <div className="grid gap-4 sm:grid-cols-1">
              {[
                { Icon: Droplets, t: "Carried in the water", d: "Nano particles stay suspended in your irrigation water — no mixing tanks, no spray rig, no residue." },
                { Icon: Leaf, t: "Absorbed by leaves & roots", d: "Because they're nano-scale, particles pass straight into the plant through the leaf surface and root zone." },
                { Icon: ShieldCheck, t: "Switch on the plant's own systems", d: "Inside the plant they prompt its natural responses — nutrient uptake, pest & disease resistance, and stress tolerance." },
                { Icon: Sprout, t: "Feed the living soil", d: "What reaches the root zone also feeds the soil microbiome, rebuilding soil health season over season." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-4 rounded-[16px] border border-hair bg-paper-2 p-5">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><Icon size={24} /></div>
                  <div>
                    <div className="font-display text-[17px] font-extrabold text-forest">{t}</div>
                    <div className="mt-1 text-[14.5px] leading-[1.55] text-fg2">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 — HERITAGE */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="relative overflow-hidden rounded-panel bg-forest p-10 text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(110%_120%_at_15%_-10%,rgba(191,232,154,.2)_0%,rgba(0,23,6,0)_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#BFE89A]"><History size={16} /> Centuries in the making</div>
            <h2 className="mt-3 max-w-[720px] font-display text-[clamp(26px,4vw,42px)] font-black tracking-[-0.02em]">
              Not new — refined.
            </h2>
            <p className="mt-4 max-w-[680px] text-[17px] leading-[1.75] text-[#D7E5CC]">
              Potentized natural remedies have been used in farming for <strong className="text-white">hundreds of
              years</strong> — across Europe and around the world. Generations of growers have relied on them to build
              healthier, more resilient crops without chemicals. AgriPure modernizes that tradition as
              <strong className="text-white"> potentized nano particles</strong> — measured, consistent, and
              custom-formulated to your crop and soil.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                { Icon: History, t: "Used for centuries" },
                { Icon: Globe, t: "Proven worldwide" },
                { Icon: Leaf, t: "100% natural" },
                { Icon: Ban, t: "No chemical residue" },
              ].map(({ Icon, t }) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold"><Icon size={15} className="text-[#BFE89A]" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — VS CHEMICALS */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The difference</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              Nano particles vs. chemicals
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-panel border border-hair bg-paper-2 p-7">
              <div className="font-display text-[18px] font-extrabold text-[#8a5a2a]">Conventional chemicals</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Synthetic actives, applied heavily", "Sit on or in the crop as residue", "Force a result, often harming soil life", "React to problems after they appear"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5"><Ban size={17} className="mt-0.5 flex-none text-[#B23A1E]" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-panel border border-leaf bg-[#F2F7EC] p-7">
              <div className="font-display text-[18px] font-extrabold text-leaf-700">Potentized nano particles</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Natural source, at nano scale", "Absorbed by the plant — no residue", "Work with the plant and feed the soil", "Build resistance before problems strike"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5"><Check size={17} className="mt-0.5 flex-none text-leaf-700" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — FAQ */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Good questions</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
            Quick answers
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-[920px] gap-4 md:grid-cols-2">
          {[
            { q: "Is this a chemical or pesticide?", a: "No. Every product is built from natural source materials, potentized to nano scale. There are no synthetic chemicals and no residue." },
            { q: "Why nano scale?", a: "At nano size the remedy dissolves in water and is absorbed directly by the plant's roots and leaves — so it can act where the plant needs it, in tiny amounts." },
            { q: "Is it safe for soil and pollinators?", a: "Yes. It's natural, residue-conscious, and designed to feed soil life and spare beneficial insects when used as directed." },
            { q: "Does it really have a track record?", a: "Potentized natural remedies have been used in agriculture for centuries across Europe and worldwide. AgriPure standardizes and custom-formulates that approach." },
            { q: "How is it applied?", a: "It's metered into your existing drip or spray irrigation with a fertigation injector — no new equipment and no extra passes." },
            { q: "Why is every formula different?", a: "Each crop, soil, and growth stage needs a different blend and potency, so we formulate all seven products specifically for you." },
          ].map((f) => (
            <div key={f.q} className="rounded-[16px] border border-hair bg-white p-6">
              <div className="font-display text-[17px] font-extrabold text-forest">{f.q}</div>
              <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="m-0 font-display text-[clamp(30px,5vw,44px)] font-black tracking-[-0.02em] text-forest">
            Natural science, working for your crop.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-[#4A524B]">
            See how the seven products are applied across the season — or build your custom program.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/how-it-works" className="btn-leaf px-8 py-[15px] text-[16px]">See how it works <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/order-now" className="btn-ghost px-8 py-[15px] text-[16px]">Order Now</Link>
          </div>
        </div>
      </section>

      {/* footnote */}
      <div className="mx-auto max-w-container px-6 pb-14 sm:px-10">
        <p className="text-[12px] leading-[1.6] text-fg3">
          &ldquo;Potentized nano particles&rdquo; is AgriPure&apos;s plain-language name for our potentized natural
          remedies. This page is educational; it describes a natural, traditional approach to crop care and is not a
          medical or guaranteed-yield claim.
        </p>
      </div>
    </div>
  );
}

function StepCard({ n, Icon, title, body, accent }: { n: string; Icon: typeof Atom; title: string; body: string; accent?: boolean }) {
  return (
    <div className={`relative flex flex-col rounded-[18px] border p-5 ${accent ? "border-leaf bg-[#F2F7EC]" : "border-hair bg-paper-2"}`}>
      <span className="absolute right-4 top-3 font-display text-[26px] font-black text-[#E2DFD2]">{n}</span>
      <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${accent ? "bg-leaf text-white" : "bg-[#E9F0E0] text-leaf-700"}`}><Icon size={24} /></div>
      <div className="mt-3.5 font-display text-[16px] font-extrabold text-forest">{title}</div>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-fg2">{body}</p>
    </div>
  );
}

function Flow() {
  return (
    <div className="flex items-center justify-center lg:px-1">
      <div className="ap-flow h-[3px] w-10 rounded-full lg:w-full lg:min-w-[20px]" />
    </div>
  );
}
