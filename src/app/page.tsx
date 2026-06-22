import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sprout, Mountain, SlidersHorizontal } from "lucide-react";
import Experience3D from "@/components/experience/Experience3D";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    Icon: Sprout,
    title: "Naturally resistant",
    body: "Inputs that make plants resistant before problems start — not just react to them once damage is done.",
  },
  {
    Icon: Mountain,
    title: "Living soil",
    body: "Restore the microbiome underneath the crop. Healthier soil means stronger roots and better yields, season over season.",
  },
  {
    Icon: SlidersHorizontal,
    title: "Custom-formulated",
    body: "Every formula is mixed for one crop, one soil, one set of pressures. Matched to your block, with rates and timing.",
  },
];

export default function Home() {
  const products = listProducts();
  const find = (id: string) => products.find((p) => p.id === id)!;
  const boost = find("boost");

  return (
    <>
      <Experience3D />

      {/* THE SEVEN */}
      <section className="px-8 pb-20 pt-[30px]">
        <div className="mx-auto max-w-container">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">
                The line
              </div>
              <h2 className="mt-2 font-display text-[38px] font-extrabold tracking-[-0.02em] text-forest">
                Seven inputs. One system.
              </h2>
            </div>
            <Link href="/shop" className="ap-link inline-flex items-center gap-1.5 !text-leaf-600">
              View all <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
          <div className="ap-sc grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-3.5 overflow-x-auto pb-2">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="ap-card rounded-[16px] border border-hair bg-white p-3.5 pb-[18px] text-center shadow-g-sm"
              >
                <div className="flex h-[150px] items-end justify-center rounded-xl bg-[radial-gradient(circle_at_50%_70%,#F2EFE6_0%,rgba(255,255,255,0)_70%)]">
                  <Image
                    src={`/assets/bottles/${p.id}.png`}
                    alt={p.name}
                    width={100}
                    height={148}
                    className="h-[148px] w-auto drop-shadow-[0_8px_14px_rgba(0,40,8,.2)]"
                  />
                </div>
                <div className="mt-3 font-mono text-[11px] text-fg3">No. {p.num}</div>
                <div className="mt-[3px] font-display text-[18px] font-extrabold text-forest">
                  {p.name}
                </div>
                <div className="mt-[3px] text-[11.5px] leading-[1.35] text-[#7A8076]">
                  {p.category}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 pb-[84px]">
        <div className="mx-auto grid max-w-container gap-[22px] md:grid-cols-3">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-card border border-hair bg-white p-[30px] shadow-g-sm">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700">
                <Icon size={26} strokeWidth={1.7} />
              </div>
              <h3 className="mb-2 mt-[18px] font-display text-[21px] font-extrabold text-forest">
                {title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.6] text-fg2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT — Boost */}
      <section className="px-8 pb-[84px]">
        <div className="relative mx-auto max-w-container overflow-hidden rounded-panel bg-forest">
          <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_130%,#BFE89A_0%,rgba(111,174,82,.25)_30%,rgba(0,23,6,0)_70%)]" />
          <div className="relative grid items-center gap-[30px] p-14 md:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#9FD27E]">
                Spotlight · No. 07
              </div>
              <h2 className="mt-3 font-display text-[48px] font-black tracking-[-0.02em] text-white">
                Boost
              </h2>
              <p className="mt-3.5 max-w-[430px] text-[17px] leading-[1.6] text-[#C9DBC0]">
                The finishing input. Drives flowering, fruit set, and fill for a bigger,
                cleaner harvest — measured in marketable yield.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {[`N-P-K ${boost.npk}`, `pH ${boost.ph}`, "OMRI-style"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/16 bg-white/[0.08] px-3.5 py-2 font-mono text-[13px] text-[#CFE3C2]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href="/products/boost"
                className="btn-leaf mt-[30px] px-7 py-[15px] text-[15px]"
              >
                View Boost <ArrowRight size={17} strokeWidth={2.2} />
              </Link>
            </div>
            <div className="relative flex justify-center">
              <Image
                src="/assets/bottles/boost.png"
                alt="Boost"
                width={280}
                height={420}
                className="h-[420px] w-auto drop-shadow-[0_24px_44px_rgba(0,0,0,.4)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FORMULATOR TEASER */}
      <section className="px-8 pb-[90px]">
        <div className="mx-auto grid max-w-container items-center gap-[30px] rounded-panel border border-hair bg-white p-[52px] shadow-g-md md:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">
              Custom-formulated
            </div>
            <h2 className="mt-2.5 font-display text-[36px] font-extrabold tracking-[-0.02em] text-forest">
              Tell us your crop. We&apos;ll build the program.
            </h2>
            <p className="mt-3.5 max-w-[440px] text-[16px] leading-[1.6] text-fg2">
              Answer three questions — crop, pressure, stage — and we&apos;ll match a custom
              program from the seven, tuned to your acreage with rates and an estimate.
            </p>
            <Link
              href="/find-your-formula"
              className="btn-primary mt-[26px] px-7 py-[15px] text-[15px]"
            >
              Build my formula <ArrowRight size={17} strokeWidth={2} />
            </Link>
          </div>
          <div className="rounded-card border border-hair bg-paper-2 p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg3">
              Example · Wine grapes · Napa, CA
            </div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {[
                { id: "prevent", note: "Powdery-mildew pressure", rate: "0.75 gal/ac" },
                { id: "restore", note: "Soil & root support", rate: "1 gal/ac" },
              ].map((row) => {
                const p = find(row.id);
                return (
                  <div
                    key={row.id}
                    className="flex items-center gap-3 rounded-xl border border-hair bg-white px-3.5 py-2.5"
                  >
                    <Image src={`/assets/bottles/${p.id}.png`} alt={p.name} width={28} height={40} className="h-10 w-auto" />
                    <div>
                      <div className="font-display font-extrabold text-forest">{p.name}</div>
                      <div className="text-xs text-[#7A8076]">{row.note}</div>
                    </div>
                    <span className="ml-auto font-mono text-xs" style={{ color: p.accent }}>
                      {row.rate}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3.5 text-center font-mono text-xs text-fg3">
              FORMULA AP-WG-PM-0518
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-24">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="m-0 font-display text-[42px] font-black tracking-[-0.02em] text-forest">
            Soil to harvest.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-[17px] text-[#4A524B]">
            Talk to an agronomist about what you&apos;re fighting this season. We&apos;ll
            formulate for your operation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/shop" className="btn-primary px-7 py-[15px] text-[15px]">
              Shop the line
            </Link>
            <Link href="/contact" className="btn-ghost px-7 py-[15px] text-[15px]">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
