import Link from "next/link";
import { ArrowRight, ClipboardList, Package, Microscope, FlaskConical, Droplets } from "lucide-react";
import HeroDrone from "@/components/experience/HeroDrone";
import ComparisonTable from "@/components/ComparisonTable";
import { listProducts } from "@/lib/repo";
import { bottleSrc } from "@/lib/products";

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

      {/* INTRO to the seven products */}
      <section className="border-b border-hair bg-white px-8 py-16 text-center">
        <div className="mx-auto max-w-[680px]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The seven products</div>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-black tracking-[-0.02em] text-forest">
            Seven inputs, soil to harvest.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-fg2">
            Your custom program runs the same seven natural inputs in sequence — restoring the soil,
            clearing the field, building the plant, and finishing the harvest. Here&apos;s what each one does.
          </p>
        </div>
      </section>

      {/* SEVEN FULL-HEIGHT PRODUCT SECTIONS */}
      {products.map((p, i) => {
        const flip = i % 2 === 1;
        const img = p.image?.trim() || bottleSrc(p.id);
        const specs = [
          p.npk && p.npk !== "—" ? `N-P-K ${p.npk}` : null,
          p.ph && p.ph !== "—" ? `pH ${p.ph}` : null,
          p.rate && p.rate !== "—" ? p.rate : null,
          p.omri || null,
        ].filter(Boolean) as string[];

        return (
          <section
            key={p.id}
            className={`px-8 py-16 sm:py-20 ${flip ? "bg-white" : "bg-paper"}`}
          >
            <div className="mx-auto grid w-full max-w-container items-center gap-12 md:grid-cols-2 lg:gap-20">
              {/* visual */}
              <div className={`flex justify-center ${flip ? "md:order-2" : ""}`}>
                <div
                  className="relative flex aspect-[4/5] w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[32px] border border-hair"
                  style={{ background: `radial-gradient(circle at 50% 62%, ${p.accentSoft} 0%, #FAF8F2 72%)` }}
                >
                  <span
                    className="absolute left-7 top-6 font-mono text-[13px] font-semibold"
                    style={{ color: p.accent }}
                  >
                    No. {p.num}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={p.name}
                    className="max-h-[78%] w-auto max-w-[70%] object-contain drop-shadow-[0_28px_50px_rgba(0,40,8,.26)]"
                  />
                </div>
              </div>

              {/* copy */}
              <div className={flip ? "md:order-1" : ""}>
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: p.accent, background: p.accentSoft }}
                  >
                    Step {i + 1} of 7
                  </span>
                  <span className="rounded-full border border-hair bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-fg2">
                    {p.type}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-[clamp(44px,6vw,68px)] font-black leading-[0.95] tracking-[-0.02em] text-forest">
                  {p.name}
                </h2>
                <div className="mt-2 text-[18px] font-semibold" style={{ color: p.accent }}>
                  {p.category}
                </div>

                <p className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-[#3F463E]">{p.long}</p>

                {specs.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {specs.map((s) => (
                      <span key={s} className="rounded-full border border-hair bg-white px-3.5 py-2 font-mono text-[13px] text-fg2">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {p.crops.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-fg3">Formulated for</div>
                    <div className="flex flex-wrap gap-2">
                      {p.crops.map((c) => (
                        <span key={c} className="rounded-full bg-[#F0EDE3] px-3 py-1.5 text-[13px] text-[#3F463E]">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/products/${p.id}`} className="btn-primary px-7 py-[14px] text-[15px]">
                    Explore {p.name} <ArrowRight size={16} strokeWidth={2.2} />
                  </Link>
                  <Link href="/order-now" className="btn-ghost px-7 py-[14px] text-[15px]">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* WHY CHOOSE US — comparison */}
      <section className="bg-white px-8 py-20">
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
