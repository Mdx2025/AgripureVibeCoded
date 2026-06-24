import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck, TrendingUp, Award, FlaskConical, CalendarCheck, Package, Droplets,
  Sprout, Ban, ArrowRight, Check, Sparkles,
} from "lucide-react";
import CountUpStats from "@/components/CountUpStats";
import ComparisonTable from "@/components/ComparisonTable";
import WhyChooseUsV2 from "@/components/whychooseus/WhyChooseUsV2";
import VariationSwitcher from "@/components/ui/VariationSwitcher";
import { resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/why-choose-us");
}

const OPTIONS = [
  { v: "1", name: "Detailed" },
  { v: "2", name: "Cinematic" },
];

export default function WhyChooseUsPage({ searchParams }: { searchParams?: { v?: string } }) {
  const v = searchParams?.v === "2" ? "2" : "1";
  return (
    <>
      {v === "2" ? <WhyChooseUsV2 /> : <V1 />}
      <VariationSwitcher current={v} options={OPTIONS} label="Why choose us" />
    </>
  );
}

const BENEFITS = [
  { Icon: ShieldCheck, title: "Resistance before it strikes", body: "AgriPure makes plants naturally resistant to pests and disease before they ever attack — you're not spraying to clean up damage, you're preventing it from starting." },
  { Icon: TrendingUp, title: "Drastically higher yields", body: "Every season, pests, weeds and disease quietly steal a share of your crop. Remove that preventable loss and that yield comes straight back to you." },
  { Icon: Sprout, title: "Back to nature's natural loss rate", body: "Up to 40% of the world's crops are lost to pests, weeds and disease every year. AgriPure claws that preventable loss back toward nature's natural minimum." },
  { Icon: Award, title: "Certify organic, charge more", body: "100% natural, copper-free and residue-conscious — so your crop can qualify as organic, and organic consistently commands a price premium over conventional." },
  { Icon: FlaskConical, title: "Custom to your crop & soil", body: "Every one of the seven formulas is built specifically for your crop and your soil profile. Never one-size-fits-all, never a generic jug off a shelf." },
  { Icon: CalendarCheck, title: "Prevent, don't react", body: "Conventional programs chase outbreaks after they appear. We treat the cause before the problem shows up — fewer surprises, fewer rescue sprays." },
  { Icon: Package, title: "One company, one program", body: "Replace a shed full of products from a dozen suppliers with a single seven-in-one system, custom-matched and shipped together." },
  { Icon: Droplets, title: "Dead-simple to run", body: "No new equipment and no extra passes. Dose all seven straight through your existing drip or spray irrigation with a fertigation injector." },
  { Icon: Ban, title: "Zero chemicals, living soil", body: "No synthetic chemicals or pesticides and no residue — and your soil gets healthier and more productive season over season." },
];

// Share of crop lost to pests/weeds/disease — lower is better. (FAO: up to 40% lost annually.)
const LOSS = [
  { label: "Left unmanaged", pct: 60, tone: "#B23A1E", note: "potential loss without protection" },
  { label: "Conventional / organic", pct: 35, tone: "#C97A06", note: "react after damage — FAO ~26–40%" },
  { label: "AgriPure program", pct: 10, tone: "#4E8A3A", note: "prevent before it strikes — toward nature's baseline" },
];

function V1() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-forest px-6 py-24 text-center text-white sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(191,232,154,.24)_0%,rgba(0,23,6,0)_60%)]" />
        <div className="relative mx-auto max-w-[860px]">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFE89A]">Why choose AgriPure</div>
          <h1 className="mt-4 font-display text-[clamp(40px,7vw,74px)] font-black leading-[1.02] tracking-[-0.02em]">
            Stop fighting crop loss. Prevent it.
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-[clamp(17px,2.2vw,22px)] leading-[1.6] text-[#D7E5CC]">
            One natural, custom-formulated program that makes your plants resistant before pests and disease ever
            strike — recovering the yield the world quietly loses every season, with zero chemicals.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/how-it-works" className="btn-ghost border-white/25 bg-white/[0.06] px-8 py-[15px] text-[16px] !text-white">See how it works</Link>
          </div>
        </div>
      </section>

      {/* STAT BAND (animated count-up) */}
      <section className="border-b border-hair bg-white px-6 py-12 sm:px-10">
        <CountUpStats />
      </section>

      {/* PREVENT vs REACT */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The difference</div>
            <h2 className="mt-3 font-display text-[clamp(30px,4.5vw,48px)] font-black tracking-[-0.02em] text-forest">
              Everyone else reacts. We prevent.
            </h2>
            <p className="mt-4 text-[18px] leading-[1.7] text-fg2">
              Conventional and even organic programs wait for a problem — then sell you a spray to chase it. By then the
              damage, and the yield, is already gone. AgriPure flips the model: we build the plant&apos;s own defenses and
              feed the soil <strong className="text-forest">before</strong> pests, weeds, disease or deficiency ever take
              hold. Healthier plants, fewer rescue sprays, and a crop that finishes the way it should.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Preventive, not reactive", "Builds plant resistance", "Feeds living soil", "Zero chemicals"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E0] px-3.5 py-2 text-[13px] font-semibold text-leaf-700"><Check size={14} /> {t}</span>
              ))}
            </div>
          </div>

          {/* loss bar graphic */}
          <div className="rounded-panel border border-hair bg-white p-7 shadow-g-sm">
            <div className="font-display text-[18px] font-extrabold text-forest">Share of crop lost to pests, weeds &amp; disease</div>
            <div className="mt-1 text-[13px] text-fg3">Lower is better.</div>
            <div className="mt-6 flex flex-col gap-5">
              {LOSS.map((b) => (
                <div key={b.label}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[14px] font-semibold text-forest">{b.label}</span>
                    <span className="font-mono text-[15px] font-bold" style={{ color: b.tone }}>~{b.pct}%</span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-[#F0EDE3]">
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.tone }} />
                  </div>
                  <div className="mt-1 text-[12px] text-fg3">{b.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The benefits</div>
            <h2 className="mt-3 font-display text-[clamp(30px,4.5vw,48px)] font-black tracking-[-0.02em] text-forest">
              Everything your crop needs. Nothing it doesn&apos;t.
            </h2>
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

      {/* ORGANIC PREMIUM / ROI */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="relative overflow-hidden rounded-panel bg-forest p-10 text-white sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(110%_120%_at_85%_-10%,rgba(191,232,154,.22)_0%,rgba(0,23,6,0)_60%)]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#BFE89A]"><Award size={16} /> The money side</div>
              <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.02em]">
                Grow more — and sell it for more.
              </h2>
              <p className="mt-4 max-w-[520px] text-[17px] leading-[1.7] text-[#D7E5CC]">
                AgriPure stacks two wins. First, you recover the yield that preventable pest, weed and disease loss
                takes every year. Second, because the whole program is natural and residue-conscious, your crop can be
                <strong className="text-white"> certified organic</strong> — and organic crops sell at a premium over
                conventional. More crop, at a higher price, from one program.
              </p>
              <Link href="/pricing" className="btn-leaf mt-7 px-7 py-3.5 text-[15px]">See the numbers <ArrowRight size={16} strokeWidth={2.2} /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { Icon: TrendingUp, k: "More yield", v: "Recover what loss steals" },
                { Icon: Award, k: "Higher price", v: "Qualify for organic premium" },
                { Icon: Package, k: "Lower complexity", v: "One supplier, not ten" },
                { Icon: Sparkles, k: "Healthier soil", v: "Compounds year over year" },
              ].map(({ Icon, k, v }) => (
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

      {/* COMPARISON TABLE */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Head to head</div>
            <h2 className="mt-3 font-display text-[clamp(30px,4.5vw,48px)] font-black tracking-[-0.02em] text-forest">
              Conventional vs Organic vs AgriPure
            </h2>
          </div>
          <div className="mt-10">
            <ComparisonTable />
          </div>
          <p className="mt-3 text-center text-[13px] text-fg3">
            AgriPure delivers all seven natural functions in one program at about organic cost — and drops below organic at volume.
          </p>
        </div>
      </section>

      {/* EASY START */}
      <section className="mx-auto max-w-container px-6 py-20 sm:px-10">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Getting started</div>
          <h2 className="mt-3 font-display text-[clamp(30px,4.5vw,48px)] font-black tracking-[-0.02em] text-forest">
            About as easy as it gets.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { n: "1", Icon: FlaskConical, t: "We formulate", d: "Tell us your crop, soil and pressures. We build your custom seven-product program and price it by your acreage." },
            { n: "2", Icon: Droplets, t: "You dose it in", d: "A fertigation injector meters the exact dose of each product into your existing drip or spray irrigation." },
            { n: "3", Icon: Sprout, t: "Your crop thrives", d: "The program runs across the whole lifecycle — soil to harvest — for a cleaner, bigger, higher-value crop." },
          ].map(({ n, Icon, t, d }) => (
            <div key={n} className="relative rounded-panel border border-hair bg-paper-2 p-7">
              <span className="absolute right-5 top-5 font-display text-[40px] font-black text-[#E2DFD2]">{n}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-forest text-white"><Icon size={24} /></div>
              <h3 className="mt-4 font-display text-[20px] font-extrabold text-forest">{t}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-black tracking-[-0.02em] text-forest">
            Healthier crops. Bigger yields. Zero chemicals.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] text-[#4A524B]">
            It&apos;s the natural program that pays for itself in recovered yield and a premium price. Build yours today.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/how-it-works" className="btn-ghost px-8 py-[15px] text-[16px]">See how it works</Link>
          </div>
        </div>
      </section>

      {/* footnote */}
      <div className="mx-auto max-w-container px-6 pb-14 sm:px-10">
        <p className="text-[12px] leading-[1.6] text-fg3">
          ¹ FAO: up to 40% of global crop production is lost to plant pests and diseases each year; FAO/OECD estimate
          26–40% of potential crop production is lost to weeds, pests and diseases. Plant diseases cost the global
          economy roughly $220 billion annually. Organic price premiums vary by crop and market. Figures are
          industry estimates for context, not a guarantee of results.
        </p>
      </div>
    </div>
  );
}
