import Link from "next/link";
import { ArrowRight, ClipboardList, Package, Microscope, FlaskConical, Droplets } from "lucide-react";
import HeroDrone from "@/components/experience/HeroDrone";
import ComparisonTable from "@/components/ComparisonTable";
import ProductFlow from "@/components/home/ProductFlowB";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

// The customer journey, summarized — full detail lives on /how-it-works.
const JOURNEY = [
  { n: "01", Icon: ClipboardList, t: "Place your order", d: "Tell us your crops, acreage, and the problems you're fighting — right on the website." },
  { n: "02", Icon: Package, t: "Test your soil", d: "We mail you a soil-sample kit. Pull a sample and send it back in the prepaid box." },
  { n: "03", Icon: Microscope, t: "We read your ground", d: "Our lab analyzes your soil's chemistry and biology to see exactly what it needs." },
  { n: "04", Icon: FlaskConical, t: "We formulate", d: "A custom, all-natural program — nano-potentized and tuned to each crop you grow." },
  { n: "05", Icon: Droplets, t: "Feed through irrigation", d: "Dose all seven products straight through your fertigation, soil prep to harvest." },
];

export default function Home() {
  const products = listProducts();

  return (
    <>
      {/* HERO — single-screen drone shot (no scroll sequence) */}
      <HeroDrone />

      {/* HOW IT WORKS — brief, educational process overview */}
      <section className="border-b border-hair bg-paper px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">How it works</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              From your soil to your harvest, in five steps
            </h2>
            <p className="mx-auto mt-4 max-w-[660px] text-[17px] leading-[1.6] text-fg2">
              We custom-formulate a natural, nano-potentized program for your exact crop and soil — then you feed it
              straight through your irrigation. No guesswork, no chemicals, one supplier.
            </p>
          </div>

          <div className="relative mt-12">
            {/* connecting line behind the step markers (desktop) */}
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-[33px] hidden h-[2px] bg-gradient-to-r from-[#C9DFB6]/0 via-[#9FC08A] to-[#C9DFB6]/0 lg:block" />
            <ol className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {JOURNEY.map(({ n, Icon, t, d }) => (
                <li key={n} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-paper bg-forest text-white shadow-g-sm">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <div className="mt-3 font-mono text-[12px] font-bold tracking-[0.06em] text-leaf-700">{n}</div>
                  <h3 className="mt-1 font-display text-[17px] font-extrabold text-forest">{t}</h3>
                  <p className="mt-1.5 max-w-[230px] text-[14px] leading-[1.55] text-fg2">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-11 text-center">
            <Link href="/how-it-works" className="btn-primary px-7 py-[14px] text-[15px]">
              See the full process <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>

      {/* THE SEVEN — scroll-driven video step flow (selectable layout) */}
      <ProductFlow products={products} />

      {/* WHY CHOOSE US — comparison */}
      <section className="border-t border-hair bg-white px-8 py-20">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Why growers choose AgriPure</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">
              Conventional vs Organic vs AgriPure
            </h2>
          </div>
          <div className="mt-10">
            <ComparisonTable />
          </div>
          <div className="mt-6 text-center">
            <Link href="/why-choose-us" className="ap-link inline-flex items-center gap-1.5 !text-leaf-600 text-[15px] font-semibold">
              See all the reasons to switch <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-paper px-8 pb-24 pt-4">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="m-0 font-display text-[42px] font-black tracking-[-0.02em] text-forest">
            Seven inputs. One program.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-[17px] text-[#4A524B]">
            Build a custom formulation for your crop, soil, and pressure — priced by your acreage.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-primary px-7 py-[15px] text-[15px]">
              Order Now <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
            <Link href="/pricing" className="btn-ghost px-7 py-[15px] text-[15px]">See pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
