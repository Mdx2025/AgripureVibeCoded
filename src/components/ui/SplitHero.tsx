import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

/** Split-screen hero: deep-forest copy panel on one side, a full-bleed photo on the other. */
export default function SplitHero({
  eyebrow,
  title,
  sub,
  photo,
  photoAlt,
  points = [],
  primary = { href: "/order-now", label: "Order Now" },
  secondary,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  photo: string;
  photoAlt: string;
  points?: string[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="grid min-h-[calc(100vh-74px)] overflow-hidden lg:grid-cols-2">
      {/* copy */}
      <div className="relative order-2 flex items-center overflow-hidden bg-[linear-gradient(160deg,#0c1c10_0%,#1f3318_100%)] px-6 py-16 text-white sm:px-10 lg:order-1">
        <div className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-leaf/25 blur-3xl" />
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#BFE89A]">{eyebrow}</div>
          <h1 className="mt-4 font-display text-[clamp(38px,5.5vw,68px)] font-black leading-[0.98] tracking-[-0.025em]">{title}</h1>
          <p className="mt-5 max-w-[480px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-[#D7E5CC]">{sub}</p>

          {points.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2.5">
              {points.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-[#EAF1E3]">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-leaf text-white"><Check size={12} strokeWidth={3} /></span>{t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={primary.href} className="btn-leaf px-8 py-[15px] text-[16px]">{primary.label} <ArrowRight size={17} strokeWidth={2.3} /></Link>
            {secondary && <Link href={secondary.href} className="btn-ghost-dark px-7 py-[15px] text-[16px]">{secondary.label}</Link>}
          </div>
        </div>
      </div>

      {/* photo */}
      <div className="relative order-1 min-h-[42vh] lg:order-2 lg:min-h-0">
        <Image src={photo} alt={photoAlt} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,8,.12),rgba(6,16,8,.06))]" />
      </div>
    </section>
  );
}
