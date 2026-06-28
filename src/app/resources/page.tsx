import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Scale, PiggyBank, TrendingUp, Wheat, Droplets, Microscope } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources — AgriPure",
  description:
    "Tools and guides for growers: subsidy programs, cost, savings, profit and yield calculators, application methods, and the research behind AgriPure.",
};

const RESOURCES = [
  {
    href: "/resources/subsidies",
    Icon: Landmark,
    title: "Subsidies",
    desc: "Find federal, state, and local programs that help fund a switch to natural inputs.",
  },
  {
    href: "/resources/cost-comparison-calculator",
    Icon: Scale,
    title: "Cost Comparison Calculator",
    desc: "Compare AgriPure against conventional and organic input costs, per crop and per acre.",
  },
  {
    href: "/resources/savings-calculator",
    Icon: PiggyBank,
    title: "Savings Calculator",
    desc: "See how much you save versus a comparable organic program across a full season.",
  },
  {
    href: "/resources/profit-calculator",
    Icon: TrendingUp,
    title: "Profit Calculator",
    desc: "Model net profit from your inputs, yield, and market price — crop by crop.",
  },
  {
    href: "/resources/yield-calculator",
    Icon: Wheat,
    title: "Yield Calculator",
    desc: "Estimate yield potential from your acreage, crop, and the AgriPure program.",
  },
  {
    href: "/resources/application-methods",
    Icon: Droplets,
    title: "Application Methods",
    desc: "How to dose all six products through your fertigation, soil prep to harvest.",
  },
  {
    href: "/resources/research-studies",
    Icon: Microscope,
    title: "Research Studies",
    desc: "Peer-reviewed trials and field data behind AgriPure's natural chemistry.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-container px-6 pb-[96px] pt-16 sm:px-8">
      {/* header */}
      <div className="mx-auto max-w-[720px] text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Grower resources</div>
        <h1 className="mt-2 font-display text-[clamp(38px,6vw,56px)] font-black tracking-[-0.02em] text-forest">
          Tools to plan, fund &amp; prove your program
        </h1>
        <p className="mx-auto mt-4 text-[17px] leading-[1.6] text-fg2">
          Calculators, guides, and research to help you compare costs, find funding, dial in application, and back every
          decision with data.
        </p>
      </div>

      {/* cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map(({ href, Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-panel border border-hair bg-white p-7 shadow-g-sm transition-all hover:-translate-y-0.5 hover:border-leaf hover:shadow-g-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0E0] text-leaf-700 transition-colors group-hover:bg-leaf group-hover:text-white">
              <Icon size={24} strokeWidth={1.9} />
            </span>
            <h2 className="mt-5 font-display text-[21px] font-extrabold tracking-[-0.01em] text-forest">{title}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-fg2">{desc}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-leaf-700">
              Explore <ArrowRight size={15} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
