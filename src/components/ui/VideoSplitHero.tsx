import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

/**
 * Split hero matching the individual product pages: a light accent-wash copy
 * panel on one side, a tinted field video on the other. Copy stays fully
 * readable; the video adds life without a full-bleed wash over the text.
 */
export default function VideoSplitHero({
  eyebrow,
  title,
  sub,
  points = [],
  primary = { href: "/order-now", label: "Build my program" },
  secondary,
  trust,
  accent = "#4E8A3A",
  soft = "#E9F0E0",
  video = "/hero/hero.mp4",
  poster,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  points?: string[];
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  trust?: string;
  accent?: string;
  soft?: string;
  video?: string;
  poster?: string;
}) {
  return (
    <section className="grid min-h-[calc(100vh-74px)] overflow-hidden lg:grid-cols-2">
      {/* copy panel */}
      <div className="order-2 flex items-center px-6 py-14 sm:px-10 lg:order-1" style={{ background: `linear-gradient(180deg, ${soft} 0%, #FFFFFF 92%)` }}>
        <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-10">
          <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{eyebrow}</div>
          <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] font-black leading-[0.96] tracking-[-0.025em] text-forest">{title}</h1>
          <p className="mt-5 max-w-[480px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-fg2">{sub}</p>

          {points.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2.5">
              {points.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-forest">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white" style={{ background: accent }}><Check size={12} strokeWidth={3} /></span>{t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={primary.href} className="btn-leaf px-8 py-[15px] text-[16px]" style={{ background: accent }}>{primary.label} <ArrowRight size={17} strokeWidth={2.3} /></Link>
            {secondary && <Link href={secondary.href} className="btn-ghost px-7 py-[15px] text-[16px]">{secondary.label}</Link>}
          </div>

          {trust && <div className="mt-5 text-[13px] text-fg3">{trust}</div>}
        </div>
      </div>

      {/* video panel */}
      <div className="relative order-1 min-h-[44vh] lg:order-2 lg:min-h-0">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className="absolute inset-0 h-full w-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline preload="auto" />
        <div className="pointer-events-none absolute inset-0" style={{ background: accent, opacity: 0.14 }} />
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#BFE89A]" /> In the field
        </div>
      </div>
    </section>
  );
}
