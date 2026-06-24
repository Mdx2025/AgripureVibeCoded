"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown, ClipboardList, Package, Microscope, FlaskConical, Droplets, Gauge, Waves, Share2 } from "lucide-react";
import { productVideoFor, productPosterFor, getSales, stepPhaseFor } from "@/lib/product-sales";
import type { ProductRow } from "@/lib/repo";
import StepVideo from "@/components/home/StepVideo";

const JOURNEY = [
  { n: "01", Icon: ClipboardList, t: "Place your custom order", d: "On the website, tell us the crops you grow, your acreage, and the problems you're fighting. That kicks off your custom program — no catalog browsing, no guesswork.", media: { type: "video" as const } },
  { n: "02", Icon: Package, t: "Get your soil-sample kit", d: "We mail you an AgriPure soil-sample tube kit with everything you need to pull a clean sample straight from your ground.", media: { type: "image" as const, src: "/assets/fertigation/fertigation-room.jpg" } },
  { n: "03", Icon: Microscope, t: "We read your ground", d: "Ship the sample back in the prepaid kit. Our lab analyzes your soil's chemistry and biology to see exactly what it's missing — and what your crop needs.", media: { type: "video" as const } },
  { n: "04", Icon: FlaskConical, t: "We formulate your program", d: "From your soil results and crops, our lab builds a custom, nano-potentized blend of all seven products — specific to every crop and tuned to each phase of its lifecycle.", media: { type: "video" as const } },
  { n: "05", Icon: Droplets, t: "Feed it through irrigation", d: "Back on your farm, a fertigation injector meters the exact dose of each product into your existing drip or spray lines — soil prep to harvest, no extra passes.", media: { type: "image" as const, src: "/assets/fertigation/fertigation-room.jpg" } },
];

export default function HowItWorksV2({ products }: { products: ProductRow[] }) {
  return (
    <div className="bg-white text-forest">
      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-74px)] flex-col items-center justify-center overflow-hidden bg-[#06160c] px-6 text-center text-white">
        <video src="/hero/hero.mp4" className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.55)_0%,rgba(6,16,8,.3)_40%,rgba(6,16,8,.75)_100%)]" />
        <div className="relative z-10 mx-auto max-w-[860px] py-20">
          <div className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#BFE89A]">How it works</div>
          <h1 className="mx-auto mt-5 max-w-[15ch] font-display text-[clamp(40px,7.5vw,84px)] font-black leading-[0.97] tracking-[-0.025em] [text-shadow:0_6px_40px_rgba(0,0,0,.6)]">
            From your soil to your harvest.
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[#EAF1E3]">
            Order online, test your soil, get a custom-formulated program, and feed it to your crops through your
            irrigation. Here&apos;s the entire process — start to finish.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order-now" className="btn-leaf px-8 py-[15px] text-[16px]">Start my program <ArrowRight size={17} strokeWidth={2.3} /></Link>
            <a href="#journey" className="btn-ghost-dark px-7 py-[15px] text-[16px]">See the steps</a>
          </div>
        </div>
        <a href="#journey" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/55"><ArrowDown size={24} className="animate-bounce" /></a>
      </section>

      {/* JOURNEY — alternating full-width rows */}
      <section id="journey" className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">The customer journey</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black tracking-[-0.02em] text-forest">Five steps to a custom program</h2>
        </div>
        <div className="mx-auto mt-14 flex max-w-container flex-col gap-16">
          {JOURNEY.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={s.n} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`relative aspect-video overflow-hidden rounded-[24px] border border-hair shadow-g-lg ${flip ? "lg:order-2" : ""}`}>
                  {s.media.type === "video" ? (
                    <StepVideo src="/hero/hero.mp4" poster="/videos/product-hero-poster.jpg" rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Image src={s.media.src} alt={s.t} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                  )}
                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-forest/85 font-display text-[18px] font-black text-white backdrop-blur-sm">{s.n}</span>
                </div>
                <div className={flip ? "lg:order-1" : ""}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#E9F0E0] text-leaf-700"><s.Icon size={24} /></div>
                  <h3 className="mt-4 font-display text-[clamp(26px,3.5vw,38px)] font-black tracking-[-0.02em] text-forest">{s.t}</h3>
                  <p className="mt-3 max-w-[520px] text-[17px] leading-[1.7] text-fg2">{s.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE SEVEN — across the season, on film */}
      <section className="border-y border-hair bg-paper-2 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-container text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Step 05 · the program</div>
          <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,46px)] font-black tracking-[-0.02em] text-forest">Seven products, across the season</h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-[1.6] text-fg2">Each product owns a stage of the crop&apos;s lifecycle, dosed in order through your fertigation.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-container gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const s = getSales(p.id);
            const phase = stepPhaseFor(p.id);
            return (
              <Link key={p.id} href={`/products/${p.id}`} className="ap-card group overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
                <div className="relative aspect-video overflow-hidden">
                  <StepVideo src={productVideoFor(p.id)} poster={productPosterFor(p.id)} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white" style={{ background: p.accent }}>Step {i + 1} · {phase.phase}</span>
                </div>
                <div className="p-5">
                  <div className="font-display text-[19px] font-extrabold text-forest">{p.name}</div>
                  <div className="text-[13px] font-semibold" style={{ color: p.accent }}>{p.category}</div>
                  <p className="mt-2 text-[14px] leading-[1.55] text-fg2">{s.hook}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FERTIGATION SYSTEM */}
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
                { Icon: Gauge, t: "Meter the exact dose", d: "Each product feeds its own injector, drawing a precise per-acre dose straight from the bottle — no hand-mixing." },
                { Icon: Waves, t: "Mix into the irrigation water", d: "The injectors blend the nano-potentized inputs into your pressurized irrigation main through the manifold." },
                { Icon: Share2, t: "Distribute to every plant", d: "That charged water flows through your existing drip and micro-spray lines to every plant in the block." },
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
