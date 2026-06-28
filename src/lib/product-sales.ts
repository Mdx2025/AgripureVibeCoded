import {
  Sprout, Recycle, TrendingUp, ShieldCheck, Droplets, Leaf, Bug, Sun,
  Microscope, Flower2, Ban, Network,
  type LucideIcon,
} from "lucide-react";

/**
 * Sales-oriented marketing content for each product page — written custom per
 * product. Client-safe (no DB). Variation components import this directly so we
 * never pass non-serializable icon components across the server/client boundary.
 */

export type Benefit = { Icon: LucideIcon; title: string; body: string };
export type Step = { title: string; body: string };
export type Stat = { value: string; label: string };
export type Faq = { q: string; a: string };

export type SalesContent = {
  hook: string;        // hero headline
  sub: string;         // hero supporting line
  labelNote: string;   // copy beside the label showcase
  problem: { title: string; body: string };
  benefits: Benefit[]; // 4
  how: Step[];         // 3 — tailored to where the product sits in the season
  stats: Stat[];       // 3
  faqs: Faq[];
};

export const SALES: Record<string, SalesContent> = {
  /* 01 — RESTORE · Soil Amendment · before planting */
  restore: {
    hook: "Your yield is only as strong as the soil beneath it.",
    sub: "Restore rebuilds living, biologically active soil from the ground up — so every input that follows works harder.",
    labelNote: "Custom-blended to your soil test: a regenerative charge of organic matter and microbial fuel, potentized to nano scale for direct uptake through irrigation.",
    problem: {
      title: "Depleted soil quietly caps every harvest.",
      body: "Years of tillage and synthetic inputs strip organic matter and starve the microbiome that cycles nutrients to your roots. The crop never reaches its ceiling — no matter what you feed it later in the season.",
    },
    benefits: [
      { Icon: Microscope, title: "Reactivates the microbiome", body: "Wakes up the soil biology that unlocks and delivers nutrients straight to your roots." },
      { Icon: Recycle, title: "Rebuilds organic matter", body: "Improves structure, water-holding, and nutrient cycling season over season." },
      { Icon: Sprout, title: "Roots establish faster", body: "A living seedbed means quicker, deeper establishment and a more resilient stand." },
      { Icon: ShieldCheck, title: "Zero synthetic residue", body: "OMRI-style and copper-free — you're building soil, not chemical load." },
    ],
    how: [
      { title: "Test, then formulate", body: "We read your soil's chemistry and biology and blend Restore to exactly what your ground is missing." },
      { title: "Charge the soil pre-plant", body: "Run it through irrigation before planting to prime structure and biology." },
      { title: "Compounds all season", body: "A living foundation that makes Cleanse, Strength, Grow and the rest measurably more effective." },
    ],
    stats: [
      { value: "2–1–3", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "4.9★", label: "214 reviews" },
    ],
    faqs: [
      { q: "When do I apply Restore?", a: "At the very start of the season — before planting — so the soil is alive and well-structured before your crop goes in. It's step one of the six-product program." },
      { q: "How is it applied?", a: "Straight through your existing irrigation/fertigation at 1–2 gallons per acre. No separate pass, no special equipment." },
      { q: "Is it organic-friendly?", a: "Yes — Restore is OMRI-style, copper-free, and free of synthetic residue." },
    ],
  },

  /* 02 — CLEANSE · Pre-emergent · before the crop emerges */
  cleanse: {
    hook: "Win the field before your crop even emerges.",
    sub: "Cleanse is a botanical pre-emergent that interrupts weed-seed germination — clearing the ground during the window that decides your season.",
    labelNote: "A botanical germination inhibitor matched to your field's weed pressure, potentized to act in the top soil layer where weed seeds wake.",
    problem: {
      title: "Weeds germinate first — and never give it back.",
      body: "Every weed that sprouts ahead of your crop is water, light, and nutrients you've already lost. Conventional pre-emergents fight back with synthetic persistence and runoff you don't want in your soil.",
    },
    benefits: [
      { Icon: Ban, title: "Halts weed germination", body: "Disrupts weed-seed sprouting and early radicle growth in the top soil layer." },
      { Icon: Leaf, title: "No synthetic residue", body: "Botanical actives clear the field without lingering chemistry or runoff." },
      { Icon: Droplets, title: "Even, hands-off coverage", body: "Delivered through irrigation across the whole block — no boom, no extra pass." },
      { Icon: ShieldCheck, title: "Crop-safe, soil-safe", body: "Targets the pre-emergent window while keeping your ground and crop clean." },
    ],
    how: [
      { title: "Match to your pressure", body: "We formulate Cleanse to the weed species and seedbank revealed in your soil test." },
      { title: "Apply pre-emergent", body: "Timed to the window just before your crop breaks the surface." },
      { title: "Own the early season", body: "A clean start lets your crop — not weeds — capture the first light and nutrients." },
    ],
    stats: [
      { value: "0–0–1", label: "N-P-K" },
      { value: "1.5 gal", label: "per acre" },
      { value: "4.7★", label: "158 reviews" },
    ],
    faqs: [
      { q: "Will Cleanse hurt my crop?", a: "Applied in the pre-emergent window as directed, it targets germinating weed seeds in the top soil layer while clearing the field for your crop." },
      { q: "How is it different from a conventional pre-emergent?", a: "It works from botanical actives — no synthetic persistence or runoff concerns — and goes out through your irrigation." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and residue-conscious." },
    ],
  },

  /* 03 — STRENGTH · Root Stimulant · at planting */
  strength: {
    hook: "A stand is won in the first two weeks.",
    sub: "Strength pairs germination triggers with root-zone biostimulants so seeds wake evenly and push roots deep, fast.",
    labelNote: "Germination triggers plus root-zone biostimulants, tuned to your crop and potentized so seedlings take them up the moment they need them.",
    problem: {
      title: "Uneven, shallow rooting caps the whole season.",
      body: "Patchy germination and weak early roots mean uneven access to water and nutrients — a ceiling on uniformity and yield you can't recover once the crop is up.",
    },
    benefits: [
      { Icon: Sprout, title: "Fast, even germination", body: "Wakes seeds up together for a uniform, vigorous stand." },
      { Icon: Network, title: "Deep root architecture", body: "Drives roots down for better access to water and nutrients all season." },
      { Icon: TrendingUp, title: "Sets the yield ceiling", body: "A strong, even start compounds into a stronger, more uniform finish." },
      { Icon: ShieldCheck, title: "All-natural biostimulant", body: "OMRI-style and copper-free — gentle on young roots and soil biology." },
    ],
    how: [
      { title: "Tuned to your seed", body: "We match Strength to your crop and soil so germination and rooting fire together." },
      { title: "Apply at planting", body: "Delivered through irrigation as seed goes in and through emergence." },
      { title: "Build the engine", body: "Deep, even roots set up Grow, Protect and Boost to perform." },
    ],
    stats: [
      { value: "3–4–2", label: "N-P-K" },
      { value: "1 gal", label: "per acre" },
      { value: "4.8★", label: "176 reviews" },
    ],
    faqs: [
      { q: "When do I apply Strength?", a: "At planting through emergence — it's timed to wake seeds up and drive early root growth." },
      { q: "How is it applied?", a: "Through your irrigation at about 1 gallon per acre." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
  },

  /* 04 — GROW · Foliar Nutrient · vegetative phase (flagship) */
  grow: {
    hook: "Grow strong — and fix what holds your crop back.",
    sub: "Grow fuels the vegetative phase with balanced nutrition and biostimulants, and targets the specific health problems your crop is prone to — deficiencies, stress, and disorders — for fast, resilient growth.",
    labelNote: "A balanced nutrient-and-biostimulant driver, crop-matched from your soil test and tuned to the plant-health problems your specific crop faces — potentized for clean uptake through the canopy.",
    problem: {
      title: "Generic growth boosters ignore what's actually wrong with your crop.",
      body: "Forcing the canopy with raw nitrogen makes soft, vulnerable tissue — and does nothing for the deficiencies, stresses, and disorders that quietly cap your yield. Every crop has its own weak points; a one-size growth product leaves them unaddressed.",
    },
    benefits: [
      { Icon: Leaf, title: "Lush, balanced canopy", body: "Builds leaf area and structure without forcing weak, watery tissue." },
      { Icon: Microscope, title: "Crop-specific plant health", body: "Tuned to the deficiencies, stresses, and disorders your particular crop is prone to." },
      { Icon: Sun, title: "More photosynthesis", body: "Captures more energy early — the engine for everything that follows." },
      { Icon: ShieldCheck, title: "Resilient tissue", body: "Healthy growth that stands up to pest and disease pressure later in the season." },
    ],
    how: [
      { title: "Crop-matched blend", body: "We formulate Grow to your crop's vegetative demand and its known health problems, from your soil test." },
      { title: "Feed as the canopy builds", body: "Dosed through fertigation right through the vegetative phase." },
      { title: "Grow healthy where it counts", body: "Balanced leaf area early — plus support for your crop's weak points — sets a healthier yield ceiling for bloom and fill." },
    ],
    stats: [
      { value: "4–3–6", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "4.9★", label: "263 reviews" },
    ],
    faqs: [
      { q: "When do I use Grow?", a: "Through the vegetative phase, as the canopy builds — it's the engine stage of the program." },
      { q: "How does it address my crop's specific problems?", a: "We tune Grow from your soil test and crop profile to target the deficiencies, stresses, and disorders your crop is prone to — so growth is healthy exactly where your crop is usually weakest." },
      { q: "Will it cause soft, disease-prone growth?", a: "No — Grow is balanced to build structure and leaf area without forcing weak tissue." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
  },

  /* 05 — PROTECT · Insecticide & Fungicide · through the season, ahead of pressure */
  protect: {
    hook: "One defense for the bugs and the diseases.",
    sub: "Protect is a natural insecticide and fungicide in one — botanical actives knock back the pests that hit hardest while a broad-spectrum defense gets ahead of fungal disease, all while sparing pollinators and beneficials.",
    labelNote: "Botanical insect actives plus broad-spectrum disease defense, matched to your pest and disease history and potentized to move with irrigation water to the root zone and canopy.",
    problem: {
      title: "Spraying twice — once for bugs, once for disease — costs more than the pests do.",
      body: "Running separate harsh insecticides and fungicides takes out beneficials and pollinators, stacks residue and resistance, and means extra passes. The field gets more fragile every season, not less.",
    },
    benefits: [
      { Icon: Bug, title: "Hits the pests that matter", body: "Disrupts feeding and reproduction in aphids, beetles, mites and more." },
      { Icon: ShieldCheck, title: "Broad-spectrum disease defense", body: "Gets ahead of powdery mildew, botrytis, downy mildew and rusts — one product, both jobs." },
      { Icon: Flower2, title: "Spares pollinators", body: "Botanical actives go easy on bees and beneficials when applied as directed." },
      { Icon: Ban, title: "Copper-free & residue-conscious", body: "Defends the crop without the residue or runoff of conventional sprays." },
    ],
    how: [
      { title: "Scout and formulate", body: "We match Protect to the insect and disease pressure in your crop and region." },
      { title: "Dose as pressure appears", body: "Run it through fertigation through the season — and ahead of fungal pressure on a rotation." },
      { title: "Keep the balance", body: "Knock back pests and disease while preserving the beneficials that work for you." },
    ],
    stats: [
      { value: "Insect + disease", label: "one product" },
      { value: "0.5–1.5 gal", label: "per acre" },
      { value: "4.8★", label: "335 reviews" },
    ],
    faqs: [
      { q: "Does Protect handle both insects and disease?", a: "Yes — it works as a natural insecticide and fungicide in one, so a single product covers pest control and broad-spectrum disease defense." },
      { q: "Which pests and diseases does it cover?", a: "Insects like aphids, beetles and mites, plus fungal pressures including powdery mildew, botrytis, downy mildew and rusts." },
      { q: "Is it safe for pollinators?", a: "Applied as directed, its botanical actives target pests while sparing pollinators and beneficials." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style, copper-free and residue-conscious." },
    ],
  },

  /* 06 — BOOST · Bloom & Fruit · flowering through fill */
  boost: {
    hook: "Finish heavy. Finish clean.",
    sub: "Boost shifts the plant into reproductive overdrive — driving flower set, fruit fill and sizing for a measurable lift in marketable yield.",
    labelNote: "A bloom-and-fill driver rich in potassium and phosphorus, crop-matched and potentized to support flowering and sizing right when it counts.",
    problem: {
      title: "A great crop can still finish light.",
      body: "Without support through bloom and fill, flowers drop, fruit sizes unevenly, and marketable yield slips away in the final weeks — right where your margin lives.",
    },
    benefits: [
      { Icon: Flower2, title: "More flower & fruit set", body: "Supports flower initiation and set when the plant needs it most." },
      { Icon: TrendingUp, title: "Heavier, even sizing", body: "Drives fill for more uniform, marketable fruit." },
      { Icon: Sun, title: "A stronger finish", body: "Carries the crop through bloom and fill for a bigger harvest." },
      { Icon: ShieldCheck, title: "Clean to harvest", body: "OMRI-style and copper-free — no residue worries at the finish line." },
    ],
    how: [
      { title: "Tune to the crop", body: "We match Boost's bloom-and-fill profile to your crop and growth stage." },
      { title: "Apply at flowering & fill", body: "Dosed through fertigation through flowering and fruit fill." },
      { title: "Cash the yield", body: "Heavier, more uniform, marketable fruit at harvest." },
    ],
    stats: [
      { value: "2–4–8", label: "N-P-K" },
      { value: "1–2 gal", label: "per acre" },
      { value: "5.0★", label: "308 reviews" },
    ],
    faqs: [
      { q: "When do I apply Boost?", a: "Through flowering and fruit fill — it's the finishing input of the program." },
      { q: "What does it actually improve?", a: "Flower initiation, fruit set and sizing — for heavier, more uniform, marketable yield." },
      { q: "Is it organic-friendly?", a: "Yes — OMRI-style and copper-free." },
    ],
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

// Per-product explainer films for the homepage step flow. Real videos drop in
// here as they're produced; everything else falls back to the shared placeholder.
export const PRODUCT_VIDEOS: Record<string, string> = {
  protect: "/videos/products/protect.mp4",
};
export const PRODUCT_POSTERS: Record<string, string> = {
  protect: "/videos/products/protect-poster.jpg",
};
export const productVideoFor = (id: string) => PRODUCT_VIDEOS[id] ?? SHARED_HERO_VIDEO;
export const productPosterFor = (id: string) => PRODUCT_POSTERS[id] ?? HERO_VIDEO_POSTER;
/** Whether a product has its real explainer film yet (vs. the shared placeholder). */
export const hasRealVideo = (id: string) => id in PRODUCT_VIDEOS;

// Where each product sits in the crop's lifecycle — drives the step flow labels.
export const STEP_PHASE: Record<string, { phase: string; when: string }> = {
  restore: { phase: "Soil preparation", when: "Before planting" },
  cleanse: { phase: "Weed control", when: "Pre-emergent" },
  strength: { phase: "Germination & rooting", when: "At planting" },
  grow: { phase: "Growth & plant health", when: "As the canopy builds" },
  protect: { phase: "Pest & disease protection", when: "Through the season" },
  boost: { phase: "Bloom, fruit & harvest", when: "Flowering to fill" },
};
export const stepPhaseFor = (id: string) => STEP_PHASE[id] ?? { phase: "", when: "" };
