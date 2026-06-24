import {
  Sprout, Recycle, TrendingUp, ShieldCheck, Droplets, Leaf, Bug, Sun,
  Microscope, Beaker, CloudRain, Wind, Flower2, Ban, Gauge, Network,
  type LucideIcon,
} from "lucide-react";

/**
 * Sales-oriented enrichment for the individual product pages. Client-safe (no DB).
 * Keyed by product id. Variation components import this directly so we never have
 * to pass non-serializable icon components across the server/client boundary.
 */

export type Benefit = { Icon: LucideIcon; title: string; body: string };
export type Step = { title: string; body: string };
export type Stat = { value: string; label: string };
export type Chapter = { at: number; label: string; caption: string }; // at = fraction 0..1 of duration
export type Faq = { q: string; a: string };

export type SalesContent = {
  hook: string;
  sub: string;
  problem: { title: string; body: string };
  benefits: Benefit[];
  how: Step[];
  stats: Stat[];
  chapters: Chapter[];
  faqs: Faq[];
  videoSrc: string;
};

// No per-product explainer films yet — every product reuses the shared brand film
// as an interactive placeholder. Drop a file at /videos/<id>.mp4 and point here later.
const FALLBACK_VIDEO = "/hero/hero.mp4";

const baseChapters = (name: string, p: string, h: string, u: string): Chapter[] => [
  { at: 0, label: "Overview", caption: `Meet ${name} — ${u}` },
  { at: 0.25, label: "The problem", caption: p },
  { at: 0.55, label: "How it works", caption: h },
  { at: 0.8, label: "In your program", caption: `${name} is dosed straight through your fertigation as part of the seven-product program.` },
];

export const SALES: Record<string, SalesContent> = {
  restore: {
    hook: "Your yield is only as strong as the soil beneath it.",
    sub: "Restore rebuilds living, biologically active soil from the ground up — so every input that follows works harder.",
    problem: {
      title: "Depleted soil quietly caps every harvest.",
      body: "Years of tillage and synthetic inputs strip organic matter and starve the microbiome that cycles nutrients to your roots. The crop never reaches its ceiling — no matter what you feed it.",
    },
    benefits: [
      { Icon: Microscope, title: "Reactivates the microbiome", body: "Wakes up the soil biology that unlocks and delivers nutrients to your roots." },
      { Icon: Recycle, title: "Rebuilds organic matter", body: "Improves structure, water-holding, and nutrient cycling season over season." },
      { Icon: Sprout, title: "Faster establishment", body: "Roots set quicker into healthier ground for a more resilient stand." },
      { Icon: ShieldCheck, title: "Zero synthetic residue", body: "OMRI-style and copper-free — kind to soil, water, and beneficials." },
    ],
    how: [
      { title: "Custom-formulated", body: "Blended to your soil test and crop, then potentized to nano scale." },
      { title: "Applied at season start", body: "Carried in through irrigation before planting to prime the ground." },
      { title: "Compounds all season", body: "A living foundation that makes every later input more effective." },
    ],
    stats: [
      { value: "2–1–3", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "4.9★", label: "214 reviews" },
    ],
    chapters: baseChapters("Restore", "Depleted soil and a stalled microbiome cap your yield.", "Restore rebuilds organic matter and reactivates soil biology.", "regenerative soil restoration"),
    faqs: [
      { q: "When in the season do I apply Restore?", a: "At the very start — before planting — so the soil is alive and structured before your crop goes in. It’s step one of the seven-product program." },
      { q: "How is it applied?", a: "Straight through your existing irrigation/fertigation at 1–2 gallons per acre. No separate pass, no special equipment." },
      { q: "Is it organic-friendly?", a: "Yes. Restore is OMRI-style, copper-free, and leaves no synthetic residue." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  cleanse: {
    hook: "Stop weeds before they ever break the surface.",
    sub: "Cleanse is a botanical pre-emergent that interrupts weed-seed germination — clearing the field during the window that decides your season.",
    problem: {
      title: "Weeds steal water, light, and nutrients first.",
      body: "Every weed that germinates ahead of your crop is competition you pay for all season. Conventional pre-emergents fight back with persistence and runoff you don’t want in your soil.",
    },
    benefits: [
      { Icon: Ban, title: "Halts germination", body: "Disrupts weed-seed sprouting and early root growth in the top soil layer." },
      { Icon: Leaf, title: "No synthetic residue", body: "Botanical actives clear the field without lingering chemistry or runoff." },
      { Icon: Droplets, title: "Applied through irrigation", body: "Delivered evenly across the block — no boom, no extra pass." },
      { Icon: ShieldCheck, title: "Crop-safe & soil-safe", body: "Targets weed pressure during the pre-emergent window, kind to your ground." },
    ],
    how: [
      { title: "Custom-formulated", body: "Matched to your weed pressure and soil, potentized to nano scale." },
      { title: "Applied pre-emergent", body: "Timed to the window before your crop comes up." },
      { title: "Clears the field", body: "Knocks back competition so your crop owns the early season." },
    ],
    stats: [
      { value: "0–0–1", label: "N-P-K" },
      { value: "1.5 gal", label: "per acre" },
      { value: "4.7★", label: "158 reviews" },
    ],
    chapters: baseChapters("Cleanse", "Weeds germinate first and steal the season’s early advantage.", "Cleanse interrupts weed-seed germination in the top soil layer.", "a botanical pre-emergent"),
    faqs: [
      { q: "Will Cleanse harm my crop?", a: "Applied in the pre-emergent window as directed, it targets germinating weed seeds in the top soil layer while clearing the field for your crop." },
      { q: "How is it different from a conventional pre-emergent?", a: "It works from botanical actives — no synthetic persistence or runoff concerns — and goes out through your irrigation." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and residue-conscious." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  strength: {
    hook: "A stand is won in the first two weeks.",
    sub: "Strength pairs germination triggers with root-zone biostimulants so seeds wake up evenly and push roots deep, fast.",
    problem: {
      title: "Uneven, shallow rooting limits the whole season.",
      body: "Patchy germination and weak early roots mean uneven access to water and nutrients — a ceiling on uniformity and yield you can’t recover later.",
    },
    benefits: [
      { Icon: Sprout, title: "Fast, even germination", body: "Wakes seeds up together for a uniform, vigorous stand." },
      { Icon: Network, title: "Deep root architecture", body: "Drives roots down for better access to water and nutrients all season." },
      { Icon: TrendingUp, title: "Sets the yield ceiling", body: "A strong start early compounds into a stronger finish." },
      { Icon: ShieldCheck, title: "All-natural biostimulant", body: "OMRI-style, copper-free, and gentle on soil biology." },
    ],
    how: [
      { title: "Custom-formulated", body: "Tuned to your crop and soil, potentized to nano scale." },
      { title: "Applied at planting", body: "Delivered through irrigation as seeds go in." },
      { title: "Builds the root system", body: "Deep, even roots set up everything that follows." },
    ],
    stats: [
      { value: "3–4–2", label: "N-P-K" },
      { value: "1 gal", label: "per acre" },
      { value: "4.8★", label: "176 reviews" },
    ],
    chapters: baseChapters("Strength", "Patchy germination and shallow roots cap uniformity and yield.", "Strength triggers even germination and drives deep rooting.", "a germination & root stimulant"),
    faqs: [
      { q: "When do I apply Strength?", a: "At planting through emergence — it’s timed to wake seeds up and drive early root growth." },
      { q: "How is it applied?", a: "Through your irrigation at about 1 gallon per acre." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  grow: {
    hook: "Build the canopy that builds your yield.",
    sub: "Grow fuels the vegetative phase with balanced nutrition and biostimulants — maximum photosynthetic area without soft, disease-prone growth.",
    problem: {
      title: "Push growth wrong and you invite disease.",
      body: "Forcing the canopy with raw nitrogen makes soft, vulnerable tissue. Too little, and you leave photosynthetic area — and yield potential — on the table.",
    },
    benefits: [
      { Icon: Leaf, title: "Lush, balanced canopy", body: "Builds leaf area and structure without forcing weak tissue." },
      { Icon: Sun, title: "More photosynthesis", body: "Captures more energy early — the engine for everything after." },
      { Icon: Gauge, title: "Balanced nutrition", body: "A complete profile that feeds growth without imbalance." },
      { Icon: ShieldCheck, title: "Resilient tissue", body: "Stronger growth that stands up to pressure later in the season." },
    ],
    how: [
      { title: "Custom-formulated", body: "Matched to your crop’s vegetative needs, potentized to nano scale." },
      { title: "Applied as canopy builds", body: "Delivered through fertigation during vegetative growth." },
      { title: "Sets the ceiling", body: "Maximum leaf area early raises the yield ceiling." },
    ],
    stats: [
      { value: "4–3–6", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "4.9★", label: "263 reviews" },
    ],
    chapters: baseChapters("Grow", "Unbalanced growth means soft tissue or lost photosynthetic area.", "Grow builds balanced canopy and maximum leaf area.", "a vegetative growth stimulant"),
    faqs: [
      { q: "When do I use Grow?", a: "Through the vegetative phase, as the canopy builds — it’s the engine stage of the program." },
      { q: "Will it cause soft, disease-prone growth?", a: "No — Grow is balanced to build structure and leaf area without forcing weak tissue." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  protect: {
    hook: "Defend the crop without declaring war on your field.",
    sub: "Protect uses botanical actives to disrupt the pests that hit hardest — tough on aphids, beetles, and mites, soft on pollinators and beneficials.",
    problem: {
      title: "Broad-spectrum chemistry costs more than pests.",
      body: "Harsh insecticides take out the beneficials and pollinators along with the pests, leaving residue and resistance behind. The field gets more fragile, not less.",
    },
    benefits: [
      { Icon: Bug, title: "Hits the pests that matter", body: "Disrupts feeding and reproduction in aphids, beetles, mites, and more." },
      { Icon: Flower2, title: "Spares pollinators", body: "Botanical actives go easy on bees and beneficials when used as directed." },
      { Icon: Ban, title: "Copper-free & residue-conscious", body: "Defends the crop without the residue or runoff of conventional sprays." },
      { Icon: Droplets, title: "Delivered through irrigation", body: "Even coverage to the root zone and canopy — no separate spray crew." },
    ],
    how: [
      { title: "Custom-formulated", body: "Matched to your pest pressure and crop, potentized to nano scale." },
      { title: "Applied as pests appear", body: "Dosed through fertigation through the season." },
      { title: "Protects beneficials", body: "Keeps the field’s natural balance working for you." },
    ],
    stats: [
      { value: "Copper-free", label: "chemistry" },
      { value: "0.5–1 gal", label: "per acre" },
      { value: "4.8★", label: "191 reviews" },
    ],
    chapters: baseChapters("Protect", "Harsh insecticides kill beneficials and leave residue behind.", "Protect uses botanical actives that spare pollinators.", "a botanical biopesticide"),
    faqs: [
      { q: "Is Protect safe for pollinators?", a: "Applied as directed, its botanical actives target pest insects while sparing pollinators and beneficials." },
      { q: "Which pests does it cover?", a: "Aphids, beetles, mites, and other common feeders — it disrupts feeding and reproduction." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style, copper-free, and residue-conscious." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  prevent: {
    hook: "Beat disease to the punch.",
    sub: "Prevent builds a protective barrier and primes the plant’s own defenses against the fungal pressures that cost the most yield.",
    problem: {
      title: "By the time you see disease, you’ve lost yield.",
      body: "Powdery mildew, botrytis, downy mildew, and rusts move fast. Reacting after symptoms appear means you’re already paying for it in marketable crop.",
    },
    benefits: [
      { Icon: ShieldCheck, title: "Broad-spectrum defense", body: "Guards against powdery mildew, botrytis, downy mildew, and rusts." },
      { Icon: CloudRain, title: "Works ahead of pressure", body: "Builds a barrier and primes defenses before disease takes hold." },
      { Icon: Leaf, title: "Primes the plant", body: "Switches on the crop’s own immune response — not just a surface coat." },
      { Icon: Ban, title: "No synthetic residue", body: "OMRI-style and copper-free, ideal for rotation programs." },
    ],
    how: [
      { title: "Custom-formulated", body: "Matched to your disease pressure and crop, potentized to nano scale." },
      { title: "Applied ahead of pressure", body: "Dosed through fertigation before fungal pressure peaks." },
      { title: "Primes defenses", body: "The plant defends itself before disease can cost yield." },
    ],
    stats: [
      { value: "Broad", label: "spectrum" },
      { value: "0.75–1.5 gal", label: "per acre" },
      { value: "4.7★", label: "144 reviews" },
    ],
    chapters: baseChapters("Prevent", "Reacting after disease appears means yield is already lost.", "Prevent builds a barrier and primes the plant’s defenses early.", "a broad-spectrum biofungicide"),
    faqs: [
      { q: "Should I apply Prevent before or after I see disease?", a: "Before. It works best applied ahead of pressure, building a barrier and priming defenses as part of a rotation." },
      { q: "Which diseases does it target?", a: "Powdery mildew, botrytis, downy mildew, and rusts, among other common fungal pressures." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
  boost: {
    hook: "Finish heavy. Finish clean.",
    sub: "Boost shifts the plant into reproductive overdrive — driving flower initiation, fruit set, and sizing for a measurable lift in marketable yield.",
    problem: {
      title: "A great crop can still finish light.",
      body: "Without support through bloom and fill, flowers drop, fruit sizes unevenly, and marketable yield slips away in the final weeks — right where your margin lives.",
    },
    benefits: [
      { Icon: Flower2, title: "More flower & fruit set", body: "Supports flower initiation and set when it counts most." },
      { Icon: TrendingUp, title: "Heavier, even sizing", body: "Drives fill for more uniform, marketable fruit." },
      { Icon: Sun, title: "Stronger finish", body: "Carries the crop through bloom and fill for a bigger harvest." },
      { Icon: ShieldCheck, title: "All-natural", body: "OMRI-style and copper-free — clean right through harvest." },
    ],
    how: [
      { title: "Custom-formulated", body: "Tuned to your crop’s reproductive stage, potentized to nano scale." },
      { title: "Applied at bloom & fill", body: "Dosed through fertigation through flowering and fruit fill." },
      { title: "Lifts marketable yield", body: "Heavier, more uniform fruit at harvest." },
    ],
    stats: [
      { value: "2–4–8", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "5.0★", label: "308 reviews" },
    ],
    chapters: baseChapters("Boost", "Without support through fill, fruit drops and finishes uneven.", "Boost supports flower set and sizing through bloom and fill.", "a bloom & yield enhancer"),
    faqs: [
      { q: "When do I apply Boost?", a: "Through flowering and fruit fill — it’s the finishing input of the program." },
      { q: "What does it actually improve?", a: "Flower initiation, fruit set, and sizing — for heavier, more uniform, marketable yield." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
    videoSrc: FALLBACK_VIDEO,
  },
};

export function getSales(id: string): SalesContent {
  return SALES[id] ?? SALES.restore;
}

// Tinted background film behind the hero (the "in the field" overview).
// Shared placeholder for now — drop a per-product file at /videos/products/<id>.mp4
// and add it to HERO_VIDEOS to override per product.
const SHARED_HERO_VIDEO = "/videos/product-hero.mp4";
export const HERO_VIDEO_POSTER = "/videos/product-hero-poster.jpg";
export const HERO_VIDEOS: Record<string, string> = {};
export const heroVideoFor = (id: string) => HERO_VIDEOS[id] ?? SHARED_HERO_VIDEO;
