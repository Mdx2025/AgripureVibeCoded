import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardList, Package, Microscope, FlaskConical, Droplets, Gauge, Waves, Share2 } from "lucide-react";
import type { ProductRow } from "@/lib/repo";
import VideoSplitHero from "@/components/ui/VideoSplitHero";
import { FaqList } from "@/components/product/sales-shared";
import ProductLifecycle from "./ProductLifecycle";

const ACCENT = "#4E8A3A";

const STEPS = [
  { n: "01", Icon: ClipboardList, t: "Place your custom order", d: "Tell us your crops, acreage, and the problems you're fighting — right on the website." },
  { n: "02", Icon: Package, t: "Get your soil-sample kit", d: "We mail you a soil-sample tube kit with everything you need to pull a clean sample." },
  { n: "03", Icon: Microscope, t: "We read your ground", d: "Ship it back in the prepaid kit. Our lab reads your soil's chemistry and biology." },
  { n: "04", Icon: FlaskConical, t: "We formulate your program", d: "A custom, nano-potentized blend of all six products, tuned to each crop and stage." },
  { n: "05", Icon: Droplets, t: "Feed it through irrigation", d: "A fertigation injector meters each product into your existing drip or spray lines." },
];

const FAQS = [
  { q: "How long does it take to get started?", a: "Place your order online in minutes. The soil-sample kit ships right away; once your sample reaches the lab, we formulate and ship your custom program." },
  { q: "Do I need new equipment?", a: "No. The program runs through your existing drip or spray irrigation with a standard fertigation injector — no extra passes, no new rig." },
  { q: "Is it really custom to my farm?", a: "Yes. Every one of the six products is formulated to your soil test and the specific crops you grow — never a generic jug off a shelf." },
];

export default function HowItWorksV3({ products }: { products: ProductRow[] }) {
  return (
    <div className="bg-white pb-4 text-forest">
      <VideoSplitHero
        eyebrow="Process"
        title="From your soil to your harvest."
        sub="Order online, test your soil, get a custom-formulated program, and feed it to your crops through your irrigation. Here's the entire process — start to finish."
        points={["Order online in minutes", "Soil-tested & custom-formulated", "Fed through your existing irrigation"]}
        primary={{ href: "/order-now", label: "Start my program" }}
        secondary={{ href: "#journey", label: "See the steps" }}
        trust="Trusted by 1,400+ operations"
      />

      {/* STAT BAND */}
      <section className="relative z-10 px-6 sm:px-10">
        <div className="mx-auto -mt-10 grid max-w-container gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-md sm:grid-cols-3">
          {[{ v: "5", l: "simple steps" }, { v: "7", l: "products · one program" }, { v: "100%", l: "natural, no chemicals" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-[clamp(26px,4vw,38px)] font-semibold" style={{ color: ACCENT }}>{s.v}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.06em] text-fg3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY — step cards */}
      <section id="journey" className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-container text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The customer journey</div>
          <h2 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Five steps to a custom program</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-container gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-panel border border-hair bg-white p-6 shadow-g-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[18px] font-black text-white" style={{ background: ACCENT }}>{s.n}</div>
              <h3 className="mt-4 font-display text-[17px] font-extrabold leading-tight text-forest">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-fg2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS — the liked lifecycle display */}
      <ProductLifecycle products={products} />

      {/* FERTIGATION showcase */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-panel border border-hair shadow-g-xl">
            <Image src="/assets/fertigation/fertigation-room.jpg" alt="The six AgriPure products connected into a fertigation skid" width={1200} height={896} className="w-full object-cover" />
          </figure>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>The fertigation system</div>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,38px)] font-black tracking-[-0.02em] text-forest">How the six reach every plant</h2>
            <div className="mt-7 flex flex-col gap-4">
              {[
                { Icon: Gauge, t: "Meter the exact dose", d: "Each product feeds its own injector, drawing a precise per-acre dose straight from the bottle." },
                { Icon: Waves, t: "Mix into the irrigation water", d: "The injectors blend the nano-potentized inputs into your pressurized irrigation main." },
                { Icon: Share2, t: "Distribute to every plant", d: "Charged water flows through your existing drip and micro-spray lines to every plant in the block." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-[#E9F0E0] text-leaf-700"><Icon size={22} /></div>
                  <div>
                    <div className="font-display text-[17px] font-extrabold text-forest">{t}</div>
                    <p className="mt-1 text-[14.5px] leading-[1.6] text-fg2">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <h2 className="mb-7 text-center font-display text-[clamp(24px,4vw,34px)] font-black tracking-[-0.02em] text-forest">Questions, answered</h2>
          <FaqList faqs={FAQS} accent={ACCENT} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-panel border border-hair p-10 text-center sm:p-16" style={{ background: "radial-gradient(120% 130% at 50% -20%, #E9F0E0 0%, #FFFFFF 60%)" }}>
          <h2 className="font-display text-[clamp(28px,5vw,46px)] font-black tracking-[-0.02em] text-forest">Ready to build your program?</h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-fg2">Tell us your crop, soil, and pressures — we&apos;ll formulate all six and price it by your acreage.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: ACCENT }}>Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/pricing" className="btn-ghost px-8 py-[15px] text-[16px]">See pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
