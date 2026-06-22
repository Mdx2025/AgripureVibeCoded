import Image from "next/image";
import Link from "next/link";
import { Compass, BadgeCheck, ShieldCheck } from "lucide-react";

const STATS = [
  { value: "2014", label: "Founded" },
  { value: "1,400+", label: "Operations served" },
  { value: "−38%", label: "Avg. disease incidence" },
  { value: "100%", label: "Copper-free" },
];

const VALUES = [
  {
    Icon: Compass,
    title: "Grounded expertise",
    body: "We sound like a trusted agronomist standing in the field — confidence without hype, warmth with precision.",
  },
  {
    Icon: BadgeCheck,
    title: "Proof, not promises",
    body: "Rates, ratios, pH, and measured outcomes. Numbers are how we earn trust — we don’t invent stats.",
  },
  {
    Icon: ShieldCheck,
    title: "Soil-positive",
    body: "Copper-free, OMRI-style chemistry that solves problems calmly — no fear-mongering, no residue worries.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-8 pb-[60px] pt-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,#DCEFC8_0%,rgba(237,234,224,0)_60%)]" />
        <div className="relative mx-auto max-w-[760px]">
          <Image
            src="/assets/mark-forest.png"
            alt="AgriPure mark"
            width={48}
            height={48}
            className="mx-auto mb-[18px] h-12 w-auto"
          />
          <h1 className="m-0 font-display text-[54px] font-black leading-[1.04] tracking-[-0.02em] text-forest">
            We formulate for one operation at a time.
          </h1>
          <p className="mt-5 text-[19px] leading-[1.6] text-[#4A524B]">
            AgriPure makes natural pesticides, fungicides, and nutrients custom-matched to
            your crop, your soil, and the pressures you actually face. Not a catalog of
            off-the-shelf chemistry — a program built for your block.
          </p>
        </div>
      </section>

      <section className="px-8 pb-[60px] pt-[30px]">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-px overflow-hidden rounded-card border border-hair bg-hair md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white p-7 text-center">
              <div className="font-mono text-[32px] font-semibold text-forest">{s.value}</div>
              <div className="mt-1 text-[13px] text-[#7A8076]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 pb-[70px] pt-5">
        <div className="mx-auto grid max-w-[1100px] gap-[22px] md:grid-cols-3">
          {VALUES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-card border border-hair bg-white p-[30px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#E9F0E0] text-leaf-700">
                <Icon size={24} strokeWidth={1.7} />
              </div>
              <h3 className="mb-2 mt-4 font-display text-[20px] font-extrabold text-forest">
                {title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.6] text-fg2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 pb-[90px]">
        <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[24px] bg-forest p-[54px] text-center">
          <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_130%,rgba(111,174,82,.3)_0%,rgba(0,23,6,0)_65%)]" />
          <div className="relative">
            <h2 className="m-0 font-display text-[36px] font-black text-white">
              Naturally resistant crops.
            </h2>
            <p className="mx-auto mb-6 mt-3.5 max-w-[520px] text-[16px] text-[#C9DBC0]">
              Make plants resistant before problems start, restore the soil underneath them,
              and bring what&apos;s already struggling back to vigor.
            </p>
            <Link href="/shop" className="btn-leaf px-7 py-[15px] text-[15px]">
              Explore the line
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
