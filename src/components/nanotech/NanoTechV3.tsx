import Link from "next/link";
import { Atom, Droplets, Waves, Beaker, Leaf, ShieldCheck, Ban, ArrowRight, Sprout } from "lucide-react";
import VideoSplitHero from "@/components/ui/VideoSplitHero";
import { FaqList } from "@/components/product/sales-shared";

const ACCENT = "#4E8A3A";

const STEPS = [
  { n: "1", Icon: Beaker, t: "Natural source", d: "Start with a proven natural remedy — a mineral or plant extract. Nothing synthetic." },
  { n: "2", Icon: Droplets, t: "Dilute in pure water", d: "A measured amount is mixed into clean water, beginning to disperse the source." },
  { n: "3", Icon: Waves, t: "Succuss (energize)", d: "Rhythmic shaking shatters the source into ever-finer nano particles and imprints its pattern." },
  { n: "4", Icon: Atom, t: "Repeat to nano scale", d: "Dilute-and-succuss repeats to the target potency, until particles reach the nano scale." },
];

const WORK = [
  { Icon: Droplets, t: "Carried in the water", d: "Suspended in your irrigation — no mixing tanks, no spray rig, no residue." },
  { Icon: Leaf, t: "Absorbed by leaves & roots", d: "Nano-scale particles pass straight into the plant through leaf and root." },
  { Icon: ShieldCheck, t: "Switch on plant defenses", d: "They prompt the plant's own nutrient uptake and pest & disease resistance." },
  { Icon: Sprout, t: "Feed the living soil", d: "What reaches the root zone rebuilds the soil microbiome season over season." },
];

const FAQS = [
  { q: "Is this a chemical or pesticide?", a: "No. Every product is built from natural source materials, potentized to nano scale. No synthetic chemicals and no residue." },
  { q: "Why nano scale?", a: "At nano size the remedy dissolves in water and is absorbed directly by the plant's roots and leaves — acting where the plant needs it, in tiny amounts." },
  { q: "Is it safe for soil and pollinators?", a: "Yes. It's natural, residue-conscious, and designed to feed soil life and spare beneficial insects when used as directed." },
  { q: "Does it have a track record?", a: "Potentized natural remedies have been used in agriculture for centuries worldwide. AgriPure standardizes and custom-formulates that approach." },
];

export default function NanoTechV3() {
  return (
    <div className="bg-white text-forest">
      <VideoSplitHero
        eyebrow="Nano Technology"
        title="Potentized nano particles, explained."
        sub="The natural science behind every AgriPure product — how we shrink proven natural remedies down to a nano scale so your plants simply drink them in through water. No chemicals, no synthetics."
        points={["100% natural source materials", "Absorbed through roots & leaves", "Centuries-proven, modernized"]}
        primary={{ href: "/order-now", label: "Order Now" }}
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />

      {/* STAT BAND */}
      <section className="relative z-10 px-6 sm:px-10">
        <div className="mx-auto -mt-10 grid max-w-container gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-md sm:grid-cols-3">
          {[{ v: "~50 nm", l: "particle scale" }, { v: "100%", l: "natural source" }, { v: "Centuries", l: "field-proven" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-[clamp(24px,3.6vw,34px)] font-semibold" style={{ color: ACCENT }}>{s.v}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-fg3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IS NANO + size infographic */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The simple version</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">What is a potentized nano particle?</h2>
            <p className="mt-4 text-[17px] leading-[1.75] text-fg2">We start with <strong className="text-forest">natural source materials</strong> — minerals, plants, and time-tested natural remedies — and run each through a <strong className="text-forest">potentization process</strong> that breaks it down, again and again, all the way to the <strong className="text-forest">nano scale</strong> (billionths of a meter).</p>
            <p className="mt-4 text-[17px] leading-[1.75] text-fg2">At that size the active dissolves completely into water — small enough for the plant to absorb <strong className="text-forest">directly through its roots and leaves</strong>, the same way it drinks.</p>
          </div>
          <div className="rounded-panel border border-hair bg-paper-2 p-7">
            <div className="text-[13px] font-bold text-forest">How small is &ldquo;nano&rdquo;? <span className="font-normal text-fg3">— each step ~1,000× smaller.</span></div>
            <div className="mt-5 flex items-end justify-between gap-3">
              {[{ t: "grain of sand", s: "~1 mm", r: 34, c: "#E7Dcc4" }, { t: "human hair", s: "~75 µm", r: 15, c: "#DDE7CF" }, { t: "nano particle", s: "~50 nm", r: 5, c: "#6FAE52" }].map((x) => (
                <div key={x.t} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-[76px] items-center justify-center"><span className="rounded-full" style={{ width: x.r * 2, height: x.r * 2, background: x.c, border: "1.5px solid rgba(0,0,0,.12)" }} /></div>
                  <div className="text-center font-mono text-[11px] text-fg3">{x.t}<br /><span className="text-[#A6A293]">{x.s}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POTENTIZATION STEPS */}
      <section className="border-y border-hair bg-paper-2 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The process</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">How a remedy becomes a nano particle</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, Icon, t, d }) => (
              <div key={n} className="rounded-panel border border-hair bg-white p-6 shadow-g-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[18px] font-black text-white" style={{ background: ACCENT }}>{n}</div>
                <div className="mt-3.5 flex items-center gap-2"><Icon size={18} className="text-leaf-700" /><div className="font-display text-[17px] font-extrabold text-forest">{t}</div></div>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-fg2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WITH PLANT & SOIL */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>In the field</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">How nano particles work with your crop</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WORK.map(({ Icon, t, d }) => (
              <div key={t} className="rounded-panel border border-hair bg-paper-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><Icon size={24} /></div>
                <div className="mt-3.5 font-display text-[17px] font-extrabold text-forest">{t}</div>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-fg2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NANO vs CHEMICALS — Without/With style */}
      <section className="border-y border-hair bg-paper-2 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The difference</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Nano particles vs. chemicals</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-panel border border-hair bg-white p-8">
              <div className="font-display text-[18px] font-extrabold text-[#8a5a2a]">Conventional chemicals</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Synthetic actives, applied heavily", "Sit on or in the crop as residue", "Force a result, often harming soil life", "React to problems after they appear"].map((t) => (<li key={t} className="flex items-start gap-2.5"><Ban size={17} className="mt-0.5 flex-none text-[#B23A1E]" /> {t}</li>))}
              </ul>
            </div>
            <div className="rounded-panel border p-8" style={{ borderColor: ACCENT, background: "#E9F0E0" }}>
              <div className="font-display text-[18px] font-extrabold text-leaf-700">Potentized nano particles</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Natural source, at nano scale", "Absorbed by the plant — no residue", "Work with the plant and feed the soil", "Build resistance before problems strike"].map((t) => (<li key={t} className="flex items-start gap-2.5"><ShieldCheck size={17} className="mt-0.5 flex-none text-leaf-700" /> {t}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-7 text-center font-display text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em] text-forest">Quick answers</h2>
          <FaqList faqs={FAQS} accent={ACCENT} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-hair p-10 text-center sm:p-16" style={{ background: "radial-gradient(120% 130% at 50% -20%, #E9F0E0 0%, #FFFFFF 60%)" }}>
          <h2 className="font-display text-[clamp(28px,5vw,44px)] font-black tracking-[-0.02em] text-forest">Natural science, working for your crop.</h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-fg2">See how the seven products are applied across the season — or build your custom program.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/how-it-works" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: ACCENT }}>See how it works <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/order-now" className="btn-ghost px-8 py-[15px] text-[16px]">Order Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
