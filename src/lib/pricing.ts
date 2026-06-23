// Shared graduated volume pricing (AgriPure_Pricing_Model.xlsx · Acreage Pricing).
// This module is CLIENT-SAFE — pure types + math + defaults, no DB import. Server code
// loads the editable program from the DB (repo.getPricingProgram) and passes it in here.

export interface PriceTier {
  from: number;
  to: number | null; // null = no upper bound (Infinity); kept null so it JSON-serializes
  rate: number; // $ per acre within this band
}

export interface PricingBundle {
  id: string;
  label: string;
  gallons: number; // bottle size per product (3 or 6)
  acres: number; // acreage this bundle covers
  note: string;
  best?: boolean;
}

export interface PricingProgram {
  tiers: PriceTier[];
  organicPerAc: number;
  conventionalPerAc: number;
  bundles: PricingBundle[];
  /** One-time soil-sample fee charged per crop (kit + lab analysis + shipping). */
  soilSamplePrice: number;
}

export const DEFAULT_PROGRAM: PricingProgram = {
  tiers: [
    { from: 0, to: 50, rate: 399 },
    { from: 50, to: 150, rate: 379 },
    { from: 150, to: 300, rate: 359 },
    { from: 300, to: 500, rate: 339 },
    { from: 500, to: null, rate: 319 },
  ],
  organicPerAc: 385,
  conventionalPerAc: 205,
  bundles: [
    { id: "3g", label: "3-Gallon Set", gallons: 3, acres: 25, note: "3-gallon set of all 7 products" },
    { id: "6g", label: "6-Gallon Set", gallons: 6, acres: 50, note: "6-gallon set of all 7 products", best: true },
  ],
  soilSamplePrice: 40,
};

// Back-compat scalar exports (the comparison page references these defaults).
export const TIERS = DEFAULT_PROGRAM.tiers;
export const ORGANIC_PER_AC = DEFAULT_PROGRAM.organicPerAc;
export const CONVENTIONAL_PER_AC = DEFAULT_PROGRAM.conventionalPerAc;
export const ACRES_PER_BUNDLE = 50;

const cap = (to: number | null) => (to == null ? Infinity : to);

export function priceBands(acres: number, program: PricingProgram = DEFAULT_PROGRAM) {
  return program.tiers
    .map((t) => {
      const a = Math.max(0, Math.min(acres, cap(t.to)) - t.from);
      return { from: t.from, to: t.to, rate: t.rate, acres: a, cost: a * t.rate };
    })
    .filter((b) => b.acres > 0);
}

export function quoteForAcres(acres: number, program: PricingProgram = DEFAULT_PROGRAM) {
  const bands = priceBands(acres, program);
  const total = bands.reduce((t, b) => t + b.cost, 0);
  const sixGal = program.bundles.find((b) => b.id === "6g")?.acres || ACRES_PER_BUNDLE;
  return {
    acres,
    bands,
    total,
    effective: acres > 0 ? Math.round(total / acres) : 0,
    bundles: Math.ceil(acres / sixGal),
    organicTotal: acres * program.organicPerAc,
    conventionalTotal: acres * program.conventionalPerAc,
    saveVsOrganic: acres * program.organicPerAc - total,
  };
}

/** A bundle's total + effective per-acre price, derived from the program tiers. */
export function bundleQuote(bundle: PricingBundle, program: PricingProgram = DEFAULT_PROGRAM) {
  const q = quoteForAcres(bundle.acres, program);
  return { ...bundle, total: q.total, perAcre: bundle.acres > 0 ? Math.round(q.total / bundle.acres) : 0 };
}

/** The lowest per-acre rate in the program (the volume floor). */
export function floorRate(program: PricingProgram = DEFAULT_PROGRAM) {
  return Math.min(...program.tiers.map((t) => t.rate));
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
