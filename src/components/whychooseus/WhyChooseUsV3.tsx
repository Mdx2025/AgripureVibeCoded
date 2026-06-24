import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, TrendingUp, Award, FlaskConical, Package, Droplets, Sparkles, ArrowRight, Check } from "lucide-react";
import CountUpStats from "@/components/CountUpStats";
import ComparisonTable from "@/components/ComparisonTable";
import SplitHero from "@/components/ui/SplitHero";

const BENEFITS = [
  { Icon: ShieldCheck, title: "Resistance before it strikes", body: "Plants become naturally resistant to pests and disease before they ever attack — preventing damage, not cleaning it up." },
  { Icon: TrendingUp, title: "Drastically higher yields", body: "Recover the share of your crop that pests, weeds and disease quietly steal every season." },
  { Icon: Award, title: "Certify organic, charge more", body: "100% natural and residue-conscious — so your crop can qualify as organic and command a premium." },
  { Icon: FlaskConical, title: "Custom to your crop & soil", body: "Every one of the seven formulas is built for your crop and soil profile. Never one-size-fits-all." },
  { Icon: Package, title: "One company, one program", body: "Replace a shed full of products from a dozen suppliers with a single seven-in-one system." },
  { Icon: Droplets, title: "Dead-simple to run", body: "No new equipment, no extra passes — dose all seven through your existing drip or spray irrigation." },
];

const LOSS = [
  { label: "Left unmanaged", pct: 60, tone: "#B23A1E", note: "potential loss without protection" },
  { label: "Conventional / organic", pct: 35, tone: "#C97A06", note: "react after damage — FAO ~26–40%" },
  { label: "AgriPure program", pct: 10, tone: "#4E8A3A", note: "prevent before it strikes" },
];

export default function WhyChooseUsV3() {
  return (
    <div className="bg-white text-forest">
      <SplitHero
        eyebrow="Why choose AgriPure"
        title="Stop fighting crop loss. Prevent it."
        sub="One natural, custom-formulated program that makes your plants resistant before pests and disease ever strike — recovering the yield the world quietly loses every season, with zero chemicals."
        photo="/assets/photos/mist.jpg"
        photoAlt="Vineyard hills in morning mist"
        points={["Prevent, don't react", "Recover lost yield", "Qualify for the organic premium"]}
        primary={{ href: "/order-now", label: "Order Now" }}
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />

      {/* STAT BAND */}
      <section className="border-b border-hair bg-white px-6 py-14 sm:px-10"><CountUpStats /></section>

      {/* PHOTO BAND — the stakes */}
      <section className="relative h-[clamp(320px,48vh,520px)] overflow-hidden">
        <Image src="/assets/photos/aerial.jpg" alt="Aerial view of farmland" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,8,.74)_0%,rgba(6,16,8,.4)_60%,rgba(6,16,8,.18)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-container items-center px-6 sm:px-10">
          <div className="max-w-[560px] text-white">
            <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#C0853C]">The cost of doing nothing</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black leading-[1.05] tracking-[-0.02em] [text-shadow:0_4px_24px_rgba(0,0,0,.5)]">
              Up to 40% of every harvest is at risk.
            </h2>
            <p className="mt-4 max-w-[460px] text-[17px] leading-[1.6] text-[#EAF1E3]">
              Pests, weeds and disease take a share of the world&apos;s crops every year. Conventional and organic
              programs react after the damage is done — AgriPure prevents it.
            </p>
          </div>
        </div>
      </section>

      {/* LOSS BARS */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-[780px] rounded-panel border border-hair bg-white p-8 shadow-g-sm sm:p-10">
          <div className="font-display text-[18px] font-extrabold text-forest">Share of crop lost to pests, weeds &amp; disease</div>
          <div className="mt-1 text-[13px] text-fg3">Lower is better.</div>
          <div className="mt-6 flex flex-col gap-5">
            {LOSS.map((b) => (
              <div key={b.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[14px] font-semibold text-forest">{b.label}</span>
                  <span className="font-mono text-[15px] font-bold" style={{ color: b.tone }}>~{b.pct}%</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full bg-[#F0EDE3]"><div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.tone }} /></div>
                <div className="mt-1 text-[12px] text-fg3">{b.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVENT vs REACT — photo split */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-hair shadow-g-lg">
            <Image src="/assets/photos/sun.jpg" alt="Sunlit healthy vineyard" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The difference</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.02em] text-forest">Everyone else reacts. We prevent.</h2>
            <p className="mt-4 text-[17px] leading-[1.7] text-fg2">Conventional and even organic programs wait for a problem, then sell you a spray to chase it — by then the yield is already gone. AgriPure builds the plant&apos;s own defenses and feeds the soil <strong className="text-forest">before</strong> anything takes hold.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Preventive, not reactive", "Builds plant resistance", "Feeds living soil", "Zero chemicals"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E0] px-3.5 py-2 text-[13px] font-semibold text-leaf-700"><Check size={14} /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The benefits</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black tracking-[-0.02em] text-forest">Everything your crop needs. Nothing it doesn&apos;t.</h2>
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

      {/* ROI panel */}
      <section className="mx-auto max-w-container px-6 pb-8 sm:px-10">
        <div className="relative overflow-hidden rounded-panel bg-forest p-10 text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(110%_120%_at_85%_-10%,rgba(191,232,154,.22)_0%,rgba(0,23,6,0)_60%)]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#BFE89A]"><Award size={16} /> The money side</div>
              <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.02em]">Grow more — and sell it for more.</h2>
              <p className="mt-4 max-w-[520px] text-[17px] leading-[1.7] text-[#D7E5CC]">Recover the yield preventable loss takes every year, and because the program is natural and residue-conscious, your crop can be certified <strong className="text-white">organic</strong> — and sell at a premium.</p>
              <Link href="/pricing" className="btn-leaf mt-7 px-7 py-3.5 text-[15px]">See the numbers <ArrowRight size={16} strokeWidth={2.2} /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ Icon: TrendingUp, k: "More yield", v: "Recover what loss steals" }, { Icon: Award, k: "Higher price", v: "Qualify for organic premium" }, { Icon: Package, k: "Lower complexity", v: "One supplier, not ten" }, { Icon: Sparkles, k: "Healthier soil", v: "Compounds year over year" }].map(({ Icon, k, v }) => (
                <div key={k} className="rounded-[16px] border border-white/15 bg-white/[0.06] p-5">
                  <Icon size={22} className="text-[#BFE89A]" />
                  <div className="mt-2.5 font-display text-[17px] font-extrabold">{k}</div>
                  <div className="text-[13px] text-[#C9DBC0]">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Head to head</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black tracking-[-0.02em] text-forest">Conventional vs Organic vs AgriPure</h2>
          </div>
          <div className="mt-10"><ComparisonTable /></div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="font-display text-[clamp(32px,5vw,48px)] font-black tracking-[-0.02em] text-forest">Healthier crops. Bigger yields. Zero chemicals.</h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] text-[#4A524B]">The natural program that pays for itself in recovered yield and a premium price.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/how-it-works" className="btn-ghost px-8 py-[15px] text-[16px]">See how it works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
