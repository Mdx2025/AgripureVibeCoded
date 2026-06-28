// AgriPure product line — canonical typed data (storefront + dashboard).
// Ported from design-handoff/data/products.js + the storefront prototype.

export type ProductGroup = "Soil" | "Growth" | "Protection" | "Yield";

export interface Product {
  id: string;
  num: string;
  name: string;
  category: string;
  type: string;
  group: ProductGroup;
  accent: string;
  accentSoft: string;
  band: string;
  price: number;
  sku: string;
  rating: number;
  reviews: number;
  stock: number;
  tagline: string;
  blurb: string;
  long: string;
  npk: string;
  ph: string;
  omri: string;
  rate: string;
  crops: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "restore", num: "01", name: "Restore", category: "Soil Restoration & Health",
    type: "Soil Amendment", group: "Soil",
    accent: "#4E8A3A", accentSoft: "#E9F0E0", band: "#6E8B4A",
    price: 249, sku: "AP-01-RST-6G", rating: 4.9, reviews: 214, stock: 142,
    tagline: "Regenerative support for healthier soil, stronger roots, and better yields.",
    blurb: "Rebuilds living soil from the ground up — feeding the microbiome that feeds the plant.",
    long: "Restore is a regenerative soil input that rebuilds organic matter and reactivates the microbial life under your crop. Applied at the start of the season, it improves structure, water-holding, and nutrient cycling so roots establish faster and the whole system gets more resilient.",
    npk: "2–1–3", ph: "6.6", omri: "OMRI-style", rate: "1–2 gal / acre",
    crops: ["Row crops", "Vineyards", "Orchards", "Vegetables"],
  },
  {
    id: "cleanse", num: "02", name: "Cleanse", category: "Weed Seed Growth Inhibitor",
    type: "Pre-emergent", group: "Soil",
    accent: "#BE8A1E", accentSoft: "#F4ECD6", band: "#C99A2E",
    price: 219, sku: "AP-02-CLN-6G", rating: 4.7, reviews: 158, stock: 88,
    tagline: "Inhibits weed seed germination and disrupts early root development.",
    blurb: "A botanical pre-emergent that stops weed pressure before it starts — no synthetic residue.",
    long: "Cleanse interrupts weed-seed germination and early radicle growth in the top layer of soil, knocking back competition during the window that matters most. It clears the field for your crop without the persistence or runoff concerns of conventional pre-emergents.",
    npk: "0–0–1", ph: "6.2", omri: "OMRI-style", rate: "1.5 gal / acre",
    crops: ["Row crops", "Vegetables", "Turf", "Orchards"],
  },
  {
    id: "strength", num: "03", name: "Strength", category: "Seed Germination & Root Stimulant",
    type: "Root Stimulant", group: "Growth",
    accent: "#2F6FB0", accentSoft: "#E2ECF5", band: "#8A6A48",
    price: 239, sku: "AP-03-STR-6G", rating: 4.8, reviews: 176, stock: 121,
    tagline: "Encourages strong root development and enhances seed germination for vigor and yield.",
    blurb: "Drives fast, even germination and deep root architecture for a vigorous stand.",
    long: "Strength pairs germination triggers with root-zone biostimulants so seeds wake up evenly and push roots deep, fast. A stronger root system early means better access to water and nutrients all season — and a more uniform, higher-yielding stand.",
    npk: "3–4–2", ph: "6.5", omri: "OMRI-style", rate: "1 gal / acre",
    crops: ["Cereals", "Vegetables", "Legumes", "Cover crops"],
  },
  {
    id: "grow", num: "04", name: "Grow", category: "Growth & Plant Health",
    type: "Foliar Nutrient & Plant-Health Tonic", group: "Growth",
    accent: "#5BA03C", accentSoft: "#E8F2DE", band: "#6FAE52",
    price: 229, sku: "AP-04-GRW-6G", rating: 4.9, reviews: 263, stock: 167,
    tagline: "Drives vigorous growth while targeting the plant-health problems your specific crop faces.",
    blurb: "Vegetative driver and crop-specific health tonic — a lush, balanced canopy plus targeted support for the deficiencies and stresses your crop is prone to.",
    long: "Grow does two jobs at once. It fuels the vegetative phase with a balanced nutrient-and-biostimulant profile that builds canopy and leaf area without forcing soft, disease-prone tissue — and it's tuned to the plant-health problems your specific crop faces, from micronutrient deficiencies and abiotic stress to the physiological disorders common to your variety. The result is fast, resilient growth that's strong exactly where your crop is usually weakest.",
    npk: "4–3–6", ph: "6.5", omri: "OMRI-style", rate: "1–2 gal / acre",
    crops: ["Vegetables", "Cannabis", "Vineyards", "Greenhouse"],
  },
  {
    id: "protect", num: "05", name: "Protect", category: "Pesticide",
    type: "Insecticide & Fungicide", group: "Protection",
    accent: "#C0531C", accentSoft: "#F4E2D6", band: "#C0571F",
    price: 279, sku: "AP-05-PRT-6G", rating: 4.8, reviews: 335, stock: 73,
    tagline: "Botanical protection against the insects and diseases that hit your crop hardest.",
    blurb: "One natural pesticide for bugs and disease — botanical insect control plus broad-spectrum fungal defense, tough on pests, soft on beneficials.",
    long: "Protect is AgriPure's all-in-one natural pesticide, working as both an insecticide and a fungicide. Botanical actives disrupt feeding and reproduction in the pests that hit hardest — aphids, beetles, mites, and more — while a preventative, broad-spectrum defense primes the plant against powdery mildew, botrytis, downy mildew, and rusts. Copper-free and residue-conscious, it spares pollinators and beneficial insects when applied as directed.",
    npk: "0–0–0", ph: "6.0", omri: "OMRI-style", rate: "0.5–1.5 gal / acre",
    crops: ["Vegetables", "Orchards", "Vineyards", "Berries"],
  },
  {
    id: "boost", num: "06", name: "Boost", category: "Yield Enhancer",
    type: "Bloom & Fruit", group: "Yield",
    accent: "#B8860B", accentSoft: "#F4ECD6", band: "#C99A2E",
    price: 269, sku: "AP-06-BST-6G", rating: 5.0, reviews: 308, stock: 134,
    tagline: "Promotes abundant fruiting and crop performance for higher yields.",
    blurb: "The finishing input — drives flowering, fruit set, and fill for a bigger, cleaner harvest.",
    long: "Boost shifts the plant into reproductive overdrive, supporting flower initiation, fruit set, and sizing through the bloom and fill stages. The result is heavier, more uniform fruit and a measurable lift in marketable yield at harvest.",
    npk: "2–4–8", ph: "6.4", omri: "OMRI-style", rate: "1–2 gal / acre",
    crops: ["Orchards", "Berries", "Vineyards", "Row crops"],
  },
];

export interface Size {
  id: string;
  label: string;
  factor: number;
  note: string;
}

export const SIZES: Size[] = [
  { id: "1g", label: "1 Gallon", factor: 0.22, note: "Trial" },
  { id: "6g", label: "6 Gallon", factor: 1, note: "22.7 L" },
  { id: "55g", label: "55 Gallon Drum", factor: 8.4, note: "Operation" },
];

export const CATEGORIES = ["All", "Soil", "Growth", "Protection", "Yield"] as const;

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);
export const sizeById = (id: string) => SIZES.find((s) => s.id === id) ?? SIZES[1];

export const bottleSrc = (id: string) => `/assets/bottles/${id}.png`;
export const labelSrc = (id: string) => `/assets/labels/${id}.png`;
export const botanicalSrc = (id: string) => `/assets/botanical/${id}.png`;

/** Per-unit price for a product at a given size (rounded). */
export const unitPrice = (product: { price: number }, sizeId: string) =>
  Math.round(product.price * sizeById(sizeId).factor);

/** Related products from a given list: same group first, then fill from others. */
export const relatedFrom = <T extends { id: string; group: string }>(
  all: T[],
  product: T,
  limit = 3,
): T[] =>
  all
    .filter((x) => x.group === product.group && x.id !== product.id)
    .concat(all.filter((x) => x.group !== product.group))
    .slice(0, limit);
