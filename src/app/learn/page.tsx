import Image from "next/image";
import { bottleSrc } from "@/lib/products";

const ARTICLES = [
  {
    id: "restore", tag: "Soil", read: "6 min", tint: "#E9F0E0",
    title: "Reading your soil before you plant",
    excerpt: "A field guide to structure, pH, and the microbial signals that tell you what to fix first.",
  },
  {
    id: "prevent", tag: "Disease", read: "8 min", tint: "#EAE4F2",
    title: "Building a preventative mildew program",
    excerpt: "Why timing beats spraying, and how to stay ahead of powdery mildew on grapes.",
  },
  {
    id: "protect", tag: "Pests", read: "5 min", tint: "#F4E2D6",
    title: "Botanical pest control that spares beneficials",
    excerpt: "Knocking back aphids and beetles without collateral damage to pollinators.",
  },
  {
    id: "grow", tag: "Growth", read: "4 min", tint: "#E8F2DE",
    title: "Canopy management for vegetable crops",
    excerpt: "Capture photosynthetic area early without forcing soft, disease-prone tissue.",
  },
  {
    id: "boost", tag: "Yield", read: "7 min", tint: "#F4ECD6",
    title: "Timing Boost for fruit set and fill",
    excerpt: "The bloom-to-fill window, and how to push marketable yield at the finish.",
  },
  {
    id: "strength", tag: "Roots", read: "5 min", tint: "#E2ECF5",
    title: "Why early root architecture sets the ceiling",
    excerpt: "Even germination and deep roots are the cheapest yield you’ll ever buy.",
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-container px-8 pb-[90px] pt-14">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">Field notes</div>
      <h1 className="mt-2 font-display text-[52px] font-black tracking-[-0.02em] text-forest">
        Learn
      </h1>
      <p className="mt-3 max-w-[560px] text-[17px] text-fg2">
        Practical, agronomist-written guides on building resistance, restoring soil, and
        timing your program.
      </p>
      <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((a) => (
          <article
            key={a.title}
            className="ap-card cursor-pointer overflow-hidden rounded-card border border-hair bg-white shadow-g-sm"
          >
            <div
              className="flex h-[150px] items-center justify-center"
              style={{
                background: `radial-gradient(circle at 50% 60%, ${a.tint} 0%, #FAF8F2 75%)`,
              }}
            >
              <Image
                src={bottleSrc(a.id)}
                alt=""
                width={80}
                height={120}
                className="h-[120px] w-auto drop-shadow-[0_8px_14px_rgba(0,40,8,.15)]"
              />
            </div>
            <div className="p-[22px]">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg3">
                {a.tag} · {a.read}
              </div>
              <h3 className="mb-2 mt-2 font-display text-[20px] font-extrabold leading-[1.25] text-forest">
                {a.title}
              </h3>
              <p className="m-0 text-sm leading-[1.55] text-fg2">{a.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
