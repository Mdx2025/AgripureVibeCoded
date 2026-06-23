import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import type { Metadata } from "next";
import PricingCalculator from "@/components/PricingCalculator";
import { getPricingProgram } from "@/lib/repo";
import { bundleQuote, floorRate, money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — AgriPure",
  description:
    "Conventional vs organic vs AgriPure cost per acre. One natural 7-function system at roughly organic cost — dropping below organic at volume.",
};

type Mark = "yes" | "no" | "partial";

// Per-acre input cost by function (US 2024–25 representative), rounded.
const FUNCTIONS: { label: string; conv: string; org: string; ap: string }[] = [
  { label: "Restore — soil health", conv: "$30", org: "$60", ap: "$62" },
  { label: "Cleanse — weed control", conv: "$75", org: "$100", ap: "$104" },
  { label: "Strength — root & germination", conv: "$15", org: "$35", ap: "$36" },
  { label: "Grow — growth stimulant", conv: "$15", org: "$35", ap: "$36" },
  { label: "Protect — insecticide", conv: "$25", org: "$60", ap: "$62" },
  { label: "Prevent — fungicide", conv: "$25", org: "$60", ap: "$62" },
  { label: "Boost — yield enhancer", conv: "$20", org: "$35", ap: "$36" },
];

const BENEFITS: { label: string; conv: Mark; org: Mark; ap: Mark }[] = [
  { label: "100% natural · OMRI-style · copper-free", conv: "no", org: "yes", ap: "yes" },
  { label: "All 7 crop functions in one system", conv: "no", org: "no", ap: "yes" },
  { label: "Custom-formulated to your crop, soil & pressure", conv: "no", org: "no", ap: "yes" },
  { label: "No synthetic residue · runoff-conscious", conv: "no", org: "yes", ap: "yes" },
  { label: "Builds plant resistance — no repeat-spray spiral", conv: "no", org: "partial", ap: "yes" },
  { label: "Restores living soil season over season", conv: "no", org: "partial", ap: "yes" },
  { label: "Qualifies your crop for the organic price premium", conv: "no", org: "yes", ap: "yes" },
  { label: "One supplier · one season-long program", conv: "no", org: "no", ap: "yes" },
];

function MarkCell({ mark }: { mark: Mark }) {
  if (mark === "yes")
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#E9F0E0] text-leaf-700">
        <Check size={17} strokeWidth={2.6} />
      </span>
    );
  if (mark === "partial")
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#FBEFD9] text-[#C97A06]">
        <Minus size={17} strokeWidth={2.6} />
      </span>
    );
  return (
    <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#F1ECE6] text-[#B23A1E]">
      <X size={16} strokeWidth={2.6} />
    </span>
  );
}

const apCol = "bg-[#F2F7EC]"; // highlighted AgriPure column tint

export default function PricingPage() {
  const program = getPricingProgram();
  const sixGal = program.bundles.find((b) => b.id === "6g") ?? program.bundles.at(-1)!;
  const floor = floorRate(program);
  const apPerAcre = bundleQuote(sixGal, program).perAcre;

  const COLUMNS = [
    { key: "conv", name: "Conventional", tag: "Synthetic · single-purpose", perAcre: money(program.conventionalPerAc), note: "/ acre" },
    { key: "org", name: "Organic", tag: "Natural · multiple products", perAcre: money(program.organicPerAc), note: "/ acre" },
    { key: "ap", name: "AgriPure", tag: "Natural · all-in-one · custom", perAcre: `from ${money(floor)}`, note: "/ acre at volume", sub: `${money(apPerAcre)}/ac at standard volume`, best: true },
  ];

  const BUNDLES = [
    ...program.bundles.map((b) => {
      const q = bundleQuote(b, program);
      return { name: b.label, covers: `Covers ${b.acres} acres`, price: money(q.total), perAcre: `${money(q.perAcre)} / acre`, sub: b.note, href: "/order-now", cta: "Get a quote", best: !!b.best };
    }),
    { name: "Enterprise", covers: "500+ acres", price: "Custom", perAcre: `from ${money(floor)} / acre`, sub: "Volume-priced program", href: "/contact", cta: "Talk to us", best: false },
  ];

  return (
    <div className="mx-auto max-w-container px-8 pb-[96px] pt-14">
      {/* header */}
      <div className="mx-auto max-w-[680px] text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">
          Transparent pricing
        </div>
        <h1 className="mt-2 font-display text-[clamp(40px,6vw,56px)] font-black tracking-[-0.02em] text-forest">
          One natural system. About organic cost.
        </h1>
        <p className="mt-4 text-[17px] leading-[1.6] text-fg2">
          Conventional inputs are cheaper up front — but synthetic, single-purpose, and
          residue-heavy. AgriPure delivers all seven natural functions in one custom-matched
          program at roughly organic cost, and drops <strong className="text-forest">below
          organic</strong> at volume.
        </p>
      </div>

      {/* comparison table */}
      <div className="mt-12 overflow-hidden rounded-panel border border-hair bg-white shadow-g-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hair">
                <th className="w-[34%] px-6 py-6 align-bottom">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg3">
                    Cost per acre
                  </span>
                </th>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className={`relative px-5 pb-6 pt-10 text-center align-bottom ${c.best ? apCol : ""}`}
                  >
                    {c.best && (
                      <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-leaf px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#04230B]">
                        Best value
                      </span>
                    )}
                    <div className={`font-display text-[19px] font-extrabold ${c.best ? "text-forest" : "text-ink"}`}>
                      {c.name}
                    </div>
                    <div className="mt-1 text-[12px] text-fg3">{c.tag}</div>
                    <div className={`mt-3 font-mono text-[26px] font-semibold ${c.best ? "text-forest" : "text-ink"}`}>
                      {c.perAcre}
                    </div>
                    <div className="text-[11px] text-fg3">{c.note}</div>
                    {c.sub && <div className="mt-0.5 text-[10px] text-fg3">{c.sub}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#FAF8F2]">
                <td colSpan={4} className="px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg3">
                  What&apos;s included
                </td>
              </tr>
              {BENEFITS.map((b, i) => (
                <tr key={b.label} className={i % 2 ? "bg-[#FCFBF7]" : ""}>
                  <td className="px-6 py-3.5 text-[14.5px] font-medium text-[#3F463E]">{b.label}</td>
                  <td className="px-5 py-3.5 text-center"><MarkCell mark={b.conv} /></td>
                  <td className="px-5 py-3.5 text-center"><MarkCell mark={b.org} /></td>
                  <td className={`px-5 py-3.5 text-center ${apCol}`}><MarkCell mark={b.ap} /></td>
                </tr>
              ))}

              <tr className="bg-[#FAF8F2]">
                <td colSpan={4} className="px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg3">
                  Cost per acre, function by function
                </td>
              </tr>
              {FUNCTIONS.map((f, i) => (
                <tr key={f.label} className={i % 2 ? "bg-[#FCFBF7]" : ""}>
                  <td className="px-6 py-3 text-[14px] text-[#3F463E]">{f.label}</td>
                  <td className="px-5 py-3 text-center font-mono text-sm text-fg2">{f.conv}</td>
                  <td className="px-5 py-3 text-center font-mono text-sm text-fg2">{f.org}</td>
                  <td className={`px-5 py-3 text-center font-mono text-sm font-semibold text-forest ${apCol}`}>{f.ap}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-hair-strong">
                <td className="px-6 py-4 font-display text-[16px] font-extrabold text-forest">List total · per acre</td>
                <td className="px-5 py-4 text-center font-mono text-[17px] font-semibold text-ink">{money(program.conventionalPerAc)}</td>
                <td className="px-5 py-4 text-center font-mono text-[17px] font-semibold text-ink">{money(program.organicPerAc)}</td>
                <td className={`px-5 py-4 text-center ${apCol}`}>
                  <div className="font-mono text-[17px] font-bold text-forest">from {money(floor)}/ac</div>
                  <div className="text-[11px] text-leaf-700">at volume · {money(apPerAcre)}/ac at standard volume</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-[760px] text-center text-[12.5px] leading-[1.6] text-fg3">
        Per-acre input cost, US 2024–25 representative, like-for-like biological &amp;
        crop-protection inputs. Conventional bulk NPK fertilizer ($120–180/ac) is not counted.
        AgriPure shown at the Pro 6-gal list rate; graduated volume pricing drops to $319/ac at 500+ acres.
      </p>

      {/* bundles */}
      <div className="mt-16">
        <h2 className="text-center font-display text-[32px] font-extrabold tracking-[-0.02em] text-forest">
          Bundles
        </h2>
        <p className="mt-2 text-center text-[15px] text-fg2">All seven products, one program — priced by coverage.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BUNDLES.map((b) => (
            <div
              key={b.name}
              className={`relative flex flex-col rounded-panel border bg-white p-8 ${
                b.best ? "border-leaf shadow-g-lg" : "border-hair shadow-g-sm"
              }`}
            >
              {b.best && (
                <span className="absolute right-6 top-6 rounded-full bg-leaf px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#04230B]">
                  ★ Best value
                </span>
              )}
              <div className="font-display text-[22px] font-extrabold text-forest">{b.name}</div>
              <div className="mt-1 text-[13px] text-fg3">{b.covers}</div>
              <div className="mt-5 font-mono text-[32px] font-semibold text-forest">{b.price}</div>
              <div className="mt-1 text-[13px] text-leaf-700">{b.perAcre}</div>
              <div className="mt-4 flex-1 text-[14px] text-fg2">{b.sub}</div>
              <Link
                href={b.href}
                className={`mt-6 ${b.best ? "btn-primary" : "btn-ghost"} h-[48px] w-full text-[15px]`}
              >
                {b.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* acreage calculator */}
      <div className="mt-16">
        <h2 className="text-center font-display text-[32px] font-extrabold tracking-[-0.02em] text-forest">
          Price by acreage
        </h2>
        <p className="mt-2 text-center text-[15px] text-fg2">
          Volume pricing in 25-acre increments — your rate steps down the more you cover.
        </p>
        <div className="mt-8">
          <PricingCalculator program={program} />
        </div>
      </div>

      {/* closing CTA */}
      <div className="mt-16 rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-14 text-center">
        <h2 className="m-0 font-display text-[34px] font-black tracking-[-0.02em] text-forest">
          Natural shouldn&apos;t cost the earth.
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[16px] text-[#4A524B]">
          Get a custom program and an exact per-acre quote for your crop, soil, and pressure.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Link href="/find-your-formula" className="btn-primary px-7 py-[15px] text-[15px]">
            Build my formula
          </Link>
          <Link href="/shop" className="btn-ghost px-7 py-[15px] text-[15px]">
            Shop the line
          </Link>
        </div>
      </div>
    </div>
  );
}
