import Link from "next/link";
import { ShieldCheck, TrendingUp, Award, FlaskConical, Package, Droplets, Sprout, ArrowRight, Check } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import VideoSplitHero from "@/components/ui/VideoSplitHero";

const ACCENT = "#4E8A3A";

const BENEFITS = [
  { Icon: ShieldCheck, title: "Resistance before it strikes", body: "Plants become naturally resistant to pests and disease before they ever attack — preventing damage, not cleaning it up." },
  { Icon: TrendingUp, title: "Drastically higher yields", body: "Recover the share of your crop that pests, weeds and disease quietly steal every season." },
  { Icon: Award, title: "Certify organic, charge more", body: "100% natural and residue-conscious — so your crop can qualify as organic and command a premium." },
  { Icon: FlaskConical, title: "Custom to your crop & soil", body: "Every one of the six formulas is built for your crop and soil profile. Never one-size-fits-all." },
  { Icon: Package, title: "One company, one program", body: "Replace a shed full of products from a dozen suppliers with a single six-in-one system." },
  { Icon: Droplets, title: "Dead-simple to run", body: "No new equipment, no extra passes — dose all six through your existing drip or spray irrigation." },
];

const WITH = [
  "Builds resistance before pests & disease strike",
  "Recovers the yield loss steals every season",
  "Qualifies your crop for the organic premium",
  "One natural program, fed through your irrigation",
];

const STEPS = [
  { n: "1", Icon: FlaskConical, t: "We formulate", d: "Tell us your crop, soil and pressures. We build your custom six-product program and price it by your acreage." },
  { n: "2", Icon: Droplets, t: "You dose it in", d: "A fertigation injector meters the exact dose of each product into your existing drip or spray irrigation." },
  { n: "3", Icon: Sprout, t: "Your crop thrives", d: "The program runs across the whole lifecycle — soil to harvest — for a cleaner, bigger, higher-value crop." },
];

export default function WhyChooseUsV3() {
  return (
    <div className="bg-white text-forest">
      <VideoSplitHero
        eyebrow="Why AgriPure"
        title="Stop fighting crop loss. Prevent it."
        sub="One natural, custom-formulated program that makes your plants resistant before pests and disease ever strike — recovering the yield the world quietly loses every season, with zero chemicals."
        points={["Prevent, don't react", "Recover lost yield", "Qualify for the organic premium"]}
        primary={{ href: "/order-now", label: "Order Now" }}
        secondary={{ href: "/how-it-works", label: "How it works" }}
        trust="Trusted by 1,400+ operations"
      />

      {/* STAT BAND */}
      <section className="relative z-10 px-6 sm:px-10">
        <div className="mx-auto -mt-10 grid max-w-container gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-md sm:grid-cols-3">
          {[{ v: "Up to 40%", l: "crop loss recovered" }, { v: "7-in-1", l: "one complete program" }, { v: "100%", l: "natural · organic-eligible" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-[clamp(24px,3.6vw,34px)] font-semibold" style={{ color: ACCENT }}>{s.v}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-fg3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WITHOUT / WITH */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="mb-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The difference</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Everyone else reacts. We prevent.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-panel border border-hair bg-paper-2 p-8">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#C0853C]">Conventional &amp; organic</div>
              <h3 className="mt-3 font-display text-[22px] font-extrabold text-forest">React after the damage is done.</h3>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-fg2">They wait for a problem, then sell you a spray to chase it. By then the yield — and your margin — is already gone, and harsh chemistry leaves residue and weakens the soil.</p>
            </div>
            <div className="rounded-panel border p-8" style={{ borderColor: ACCENT, background: "#E9F0E0" }}>
              <div className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>With AgriPure</div>
              <ul className="mt-4 flex flex-col gap-3">
                {WITH.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15.5px] leading-[1.5] text-forest">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white" style={{ background: ACCENT }}><Check size={14} strokeWidth={3} /></span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 steps */}
      <section className="border-y border-hair bg-paper-2 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container">
          <h2 className="text-center font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">About as easy as it gets</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-panel border border-hair bg-white p-7 text-center shadow-g-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full font-display text-[22px] font-black text-white" style={{ background: ACCENT }}>{s.n}</div>
                <h3 className="mt-4 font-display text-[19px] font-extrabold text-forest">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The benefits</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Everything your crop needs. Nothing it doesn&apos;t.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-panel border border-hair bg-paper-2 p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#E9F0E0] text-leaf-700"><Icon size={26} /></div>
                <h3 className="mt-4 font-display text-[20px] font-extrabold text-forest">{title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="border-t border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>Head to head</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Conventional vs Organic vs AgriPure</h2>
          </div>
          <div className="mt-10"><ComparisonTable /></div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-hair p-10 text-center sm:p-16" style={{ background: "radial-gradient(120% 130% at 50% -20%, #E9F0E0 0%, #FFFFFF 60%)" }}>
          <h2 className="font-display text-[clamp(30px,5vw,48px)] font-black tracking-[-0.02em] text-forest">Healthier crops. Bigger yields. Zero chemicals.</h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] text-fg2">The natural program that pays for itself in recovered yield and a premium price.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: ACCENT }}>Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/how-it-works" className="btn-ghost px-8 py-[15px] text-[16px]">See how it works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
