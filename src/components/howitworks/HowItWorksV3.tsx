import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardList, Package, Microscope, FlaskConical, Droplets, Gauge, Waves, Share2 } from "lucide-react";
import type { ProductRow } from "@/lib/repo";
import SplitHero from "@/components/ui/SplitHero";
import ProductLifecycle from "./ProductLifecycle";

const STEPS = [
  { n: "01", Icon: ClipboardList, t: "Place your custom order", d: "Tell us your crops, acreage, and the problems you're fighting — right on the website." },
  { n: "02", Icon: Package, t: "Get your soil-sample kit", d: "We mail you an AgriPure soil-sample tube kit with everything you need to pull a clean sample." },
  { n: "03", Icon: Microscope, t: "We read your ground", d: "Ship it back in the prepaid kit. Our lab reads your soil's chemistry and biology." },
  { n: "04", Icon: FlaskConical, t: "We formulate your program", d: "A custom, nano-potentized blend of all seven products, tuned to each crop and stage." },
  { n: "05", Icon: Droplets, t: "Feed it through irrigation", d: "A fertigation injector meters each product into your existing drip or spray lines." },
];

export default function HowItWorksV3({ products }: { products: ProductRow[] }) {
  return (
    <div className="bg-white text-forest">
      <SplitHero
        eyebrow="How it works"
        title="From your soil to your harvest."
        sub="Order online, test your soil, get a custom-formulated program, and feed it to your crops through your irrigation. Here's the entire process — start to finish."
        photo="/assets/photos/rows.jpg"
        photoAlt="Healthy vineyard rows at golden hour"
        points={["Custom-formulated to your soil & crop", "Fed through your existing irrigation", "All natural — soil prep to harvest"]}
        primary={{ href: "/order-now", label: "Start my program" }}
        secondary={{ href: "#journey", label: "See the steps" }}
      />

      {/* JOURNEY */}
      <section id="journey" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The customer journey</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black tracking-[-0.02em] text-forest">Five steps to a custom program</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-container gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-panel border border-hair bg-paper-2 p-6">
              <span className="absolute right-4 top-3 font-display text-[34px] font-black text-[#E2DFD2]">{s.n}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-forest text-white"><s.Icon size={22} /></div>
              <h3 className="mt-4 font-display text-[17px] font-extrabold leading-tight text-forest">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-fg2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO BAND */}
      <section className="relative h-[clamp(340px,52vh,560px)] overflow-hidden">
        <Image src="/assets/photos/sunset.jpg" alt="Vineyard at sunset" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,8,.72)_0%,rgba(6,16,8,.35)_55%,rgba(6,16,8,.15)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-container items-center px-6 sm:px-10">
          <div className="max-w-[560px] text-white">
            <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#BFE89A]">One program, all season</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black leading-[1.05] tracking-[-0.02em] [text-shadow:0_4px_24px_rgba(0,0,0,.5)]">
              Seven natural inputs, working as one system.
            </h2>
            <p className="mt-4 max-w-[460px] text-[17px] leading-[1.6] text-[#EAF1E3]">
              From rebuilding the soil to finishing the fruit, every product is dosed in order — custom-formulated and
              fed straight through your fertigation.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS — the liked lifecycle display */}
      <ProductLifecycle products={products} />

      {/* FERTIGATION */}
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The fertigation system</div>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,44px)] font-black tracking-[-0.02em] text-forest">How the seven reach every plant</h2>
          </div>
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-panel border border-hair shadow-g-xl">
              <Image src="/assets/fertigation/fertigation-room.jpg" alt="The seven AgriPure products connected into a fertigation skid" width={1200} height={896} className="w-full object-cover" />
            </figure>
            <div className="flex flex-col gap-4">
              {[
                { Icon: Gauge, t: "Meter the exact dose", d: "Each product feeds its own injector, drawing a precise per-acre dose straight from the bottle." },
                { Icon: Waves, t: "Mix into the irrigation water", d: "The injectors blend the nano-potentized inputs into your pressurized irrigation main." },
                { Icon: Share2, t: "Distribute to every plant", d: "Charged water flows through your existing drip and micro-spray lines to every plant in the block." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex gap-4 rounded-[18px] border border-hair bg-paper-2 p-5">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><Icon size={24} /></div>
                  <div>
                    <div className="font-display text-[18px] font-extrabold text-forest">{t}</div>
                    <p className="mt-1 text-[14.5px] leading-[1.6] text-fg2">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-container rounded-panel border border-[#D9D6C7] bg-[radial-gradient(120%_130%_at_50%_-20%,#DCEFC8_0%,#EDEAE0_60%)] px-10 py-16 text-center">
          <h2 className="font-display text-[clamp(30px,5vw,46px)] font-black tracking-[-0.02em] text-forest">Ready to build your program?</h2>
          <p className="mx-auto mt-3.5 max-w-[540px] text-[17px] text-[#4A524B]">Tell us your crop, soil, and pressures — we&apos;ll formulate all seven and price it by your acreage.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/order-now" className="btn-primary px-8 py-[15px] text-[16px]">Order Now <ArrowRight size={17} strokeWidth={2.2} /></Link>
            <Link href="/pricing" className="btn-ghost px-8 py-[15px] text-[16px]">See pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
