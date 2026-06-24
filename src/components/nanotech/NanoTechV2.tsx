import Link from "next/link";
import { Atom, Droplets, Waves, Beaker, Leaf, ShieldCheck, Ban, ArrowRight, Check, Sprout } from "lucide-react";
import StepVideo from "@/components/home/StepVideo";

export default function NanoTechV2() {
  return (
    <div className="bg-white text-forest">
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-74px)] flex-col items-center justify-center overflow-hidden bg-[#06160c] px-6 text-center text-white">
        <video src="/videos/products/prevent.mp4" className="absolute inset-0 h-full w-full object-cover opacity-70" autoPlay muted loop playsInline preload="auto" poster="/videos/products/prevent-poster.jpg" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.6)_0%,rgba(6,16,8,.45)_40%,rgba(6,16,8,.8)_100%)]" />
        <div className="relative z-10 mx-auto max-w-[820px] py-20">
          <div className="flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.28em] text-[#BFE89A]"><Atom size={14} /> Nano Technology</div>
          <h1 className="mx-auto mt-5 max-w-[15ch] font-display text-[clamp(40px,7.5vw,80px)] font-black leading-[0.97] tracking-[-0.025em] [text-shadow:0_6px_40px_rgba(0,0,0,.6)]">
            Potentized nano particles, explained.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#EAF1E3]">
            The natural science behind every AgriPure product — how we shrink proven natural remedies down to a nano
            scale so your plants simply drink them in through water. No chemicals, no synthetics.
          </p>
          <div className="mt-9"><a href="#explainer" className="btn-ghost-dark px-7 py-[15px] text-[16px]">Watch how it works</a></div>
        </div>
      </section>

      {/* EXPLAINER VIDEO + what is nano */}
      <section id="explainer" className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-panel border border-hair shadow-g-xl">
            <StepVideo src="/videos/products/prevent.mp4" poster="/videos/products/prevent-poster.jpg" rounded={false} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The simple version</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.02em] text-forest">What is a potentized nano particle?</h2>
            <p className="mt-4 text-[17px] leading-[1.75] text-fg2">We start with <strong className="text-forest">natural source materials</strong> — minerals, plants, and time-tested natural remedies — and run each through a <strong className="text-forest">potentization process</strong> that breaks it down, again and again, all the way to the <strong className="text-forest">nano scale</strong> (billionths of a meter).</p>
            <p className="mt-4 text-[17px] leading-[1.75] text-fg2">At that size the active dissolves completely into water — small enough for the plant to absorb <strong className="text-forest">directly through its roots and leaves</strong>, the same way it drinks.</p>
            {/* size infographic */}
            <div className="mt-6 rounded-panel border border-hair bg-paper-2 p-5">
              <div className="text-[13px] font-bold text-forest">How small is &ldquo;nano&rdquo;? <span className="font-normal text-fg3">— each step ~1,000× smaller.</span></div>
              <div className="mt-4 flex items-end justify-between gap-2">
                {[{ t: "grain of sand", s: "~1 mm", r: 30, c: "#E7Dcc4" }, { t: "human hair", s: "~75 µm", r: 14, c: "#DDE7CF" }, { t: "nano particle", s: "~50 nm", r: 5, c: "#6FAE52" }].map((x) => (
                  <div key={x.t} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-[68px] items-center justify-center">
                      <span className="rounded-full" style={{ width: x.r * 2, height: x.r * 2, background: x.c, border: "1.5px solid rgba(0,0,0,.12)" }} />
                    </div>
                    <div className="text-center font-mono text-[11px] text-fg3">{x.t}<br /><span className="text-[#A6A293]">{x.s}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POTENTIZATION STEPS */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The process</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">How a remedy becomes a nano particle</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", Icon: Beaker, t: "Natural source", d: "Start with a proven natural remedy — a mineral or plant extract. Nothing synthetic." },
              { n: "2", Icon: Droplets, t: "Dilute in pure water", d: "A measured amount is mixed into clean water, beginning to disperse the source." },
              { n: "3", Icon: Waves, t: "Succuss (energize)", d: "Rhythmic shaking shatters the source into ever-finer nano particles and imprints its pattern." },
              { n: "4", Icon: Atom, t: "Repeat to nano scale", d: "Dilute-and-succuss repeats to the target potency, until particles reach the nano scale.", accent: true },
            ].map(({ n, Icon, t, d, accent }) => (
              <div key={n} className={`relative rounded-panel border p-6 ${accent ? "border-leaf bg-[#F2F7EC]" : "border-hair bg-white"}`}>
                <span className="absolute right-4 top-3 font-display text-[28px] font-black text-[#E2DFD2]">{n}</span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${accent ? "bg-leaf text-white" : "bg-[#E9F0E0] text-leaf-700"}`}><Icon size={24} /></div>
                <div className="mt-3.5 font-display text-[17px] font-extrabold text-forest">{t}</div>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-fg2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WITH PLANT & SOIL */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">In the field</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">How nano particles work with your crop</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Droplets, t: "Carried in the water", d: "Suspended in your irrigation water — no mixing tanks, no spray rig, no residue." },
              { Icon: Leaf, t: "Absorbed by leaves & roots", d: "Nano-scale particles pass straight into the plant through leaf surface and root zone." },
              { Icon: ShieldCheck, t: "Switch on plant defenses", d: "They prompt the plant's own responses — nutrient uptake, pest & disease resistance, stress tolerance." },
              { Icon: Sprout, t: "Feed the living soil", d: "What reaches the root zone feeds the soil microbiome, rebuilding soil health season over season." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-panel border border-hair bg-paper-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><Icon size={24} /></div>
                <div className="mt-3.5 font-display text-[17px] font-extrabold text-forest">{t}</div>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-fg2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VS CHEMICALS */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The difference</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">Nano particles vs. chemicals</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-panel border border-hair bg-white p-7">
              <div className="font-display text-[18px] font-extrabold text-[#8a5a2a]">Conventional chemicals</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Synthetic actives, applied heavily", "Sit on or in the crop as residue", "Force a result, often harming soil life", "React to problems after they appear"].map((t) => (<li key={t} className="flex items-start gap-2.5"><Ban size={17} className="mt-0.5 flex-none text-[#B23A1E]" /> {t}</li>))}
              </ul>
            </div>
            <div className="rounded-panel border border-leaf bg-[#F2F7EC] p-7">
              <div className="font-display text-[18px] font-extrabold text-leaf-700">Potentized nano particles</div>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-fg2">
                {["Natural source, at nano scale", "Absorbed by the plant — no residue", "Work with the plant and feed the soil", "Build resistance before problems strike"].map((t) => (<li key={t} className="flex items-start gap-2.5"><Check size={17} className="mt-0.5 flex-none text-leaf-700" /> {t}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Good questions</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">Quick answers</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-[920px] gap-4 md:grid-cols-2">
          {[
            { q: "Is this a chemical or pesticide?", a: "No. Every product is built from natural source materials, potentized to nano scale. No synthetic chemicals and no residue." },
            { q: "Why nano scale?", a: "At nano size the remedy dissolves in water and is absorbed directly by the plant's roots and leaves — acting where the plant needs it, in tiny amounts." },
            { q: "Is it safe for soil and pollinators?", a: "Yes. It's natural, residue-conscious, and designed to feed soil life and spare beneficial insects when used as directed." },
            { q: "Does it have a track record?", a: "Potentized natural remedies have been used in agriculture for centuries worldwide. AgriPure standardizes and custom-formulates that approach." },
            { q: "How is it applied?", a: "Metered into your existing drip or spray irrigation with a fertigation injector — no new equipment, no extra passes." },
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
          <h2 className="font-display text-[clamp(30px,5vw,44px)] font-black tracking-[-0.02em] text-forest">Natural science, working for your crop.</h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-[#4A524B]">See how the seven products are applied across the season — or build your custom program.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/how-it-works" className="btn-leaf px-8 py-[15px] text-[16px]">See how it works <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/order-now" className="btn-ghost px-8 py-[15px] text-[16px]">Order Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
