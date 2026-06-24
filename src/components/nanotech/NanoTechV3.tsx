import Link from "next/link";
import Image from "next/image";
import { Atom, Droplets, Waves, Beaker, Leaf, ShieldCheck, Ban, ArrowRight, Check, Sprout, History, Globe } from "lucide-react";
import SplitHero from "@/components/ui/SplitHero";

export default function NanoTechV3() {
  return (
    <div className="bg-white text-forest">
      <SplitHero
        eyebrow="Nano Technology"
        title="Potentized nano particles, explained."
        sub="The natural science behind every AgriPure product — how we shrink proven natural remedies down to a nano scale so your plants simply drink them in through water. No chemicals, no synthetics."
        photo="/assets/photos/rows.jpg"
        photoAlt="Healthy vineyard rows"
        points={["100% natural source materials", "Absorbed through roots & leaves", "Centuries-proven, modernized"]}
        primary={{ href: "/order-now", label: "Order Now" }}
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />

      {/* WHAT IS NANO + size infographic */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The simple version</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.02em] text-forest">What is a potentized nano particle?</h2>
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

      {/* PHOTO BAND — heritage */}
      <section className="relative h-[clamp(320px,46vh,500px)] overflow-hidden">
        <Image src="/assets/photos/mist.jpg" alt="Vineyard hills" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,8,.74)_0%,rgba(6,16,8,.4)_60%,rgba(6,16,8,.18)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-container items-center px-6 sm:px-10">
          <div className="max-w-[560px] text-white">
            <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-[#BFE89A]"><History size={14} /> Centuries in the making</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black leading-[1.05] tracking-[-0.02em] [text-shadow:0_4px_24px_rgba(0,0,0,.5)]">Not new — refined.</h2>
            <p className="mt-4 max-w-[460px] text-[17px] leading-[1.6] text-[#EAF1E3]">Potentized natural remedies have been used in farming for hundreds of years. AgriPure modernizes that tradition — measured, consistent, and custom-formulated to your crop and soil.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[{ Icon: Globe, t: "Proven worldwide" }, { Icon: Leaf, t: "100% natural" }, { Icon: Ban, t: "No residue" }].map(({ Icon, t }) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1.5 text-[13px] font-semibold text-white"><Icon size={13} className="text-[#BFE89A]" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VS CHEMICALS */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The difference</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">Nano particles vs. chemicals</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-panel border border-hair bg-paper-2 p-7">
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
