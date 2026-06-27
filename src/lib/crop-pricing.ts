// Per-crop pricing model (AgriPure_Pricing_Model_SPEC.md).
//
// AgriPure prices its 7-product bundle PER CROP, by crop type, anchored at the
// midpoint between conventional and organic input costs for that crop. Each crop
// carries its own volume-discount cap (by tier), applied to that crop's acreage.
//
// This module is CLIENT-SAFE — pure types + math + data, no DB/server imports.
// The Order Now wizard (live estimate), the quote page, and createQuote all use
// these helpers so the storefront and backend always agree.

import { CROP_PRICING, type CropPricing } from "./data/crop-pricing";

export type { CropPricing };
export { CROP_PRICING };

/** Global model constants (AgriPure_Global_Parameters.csv). */
export const PRICING_PARAMS = {
  gapPosition: 0.5, // list = conventional + gap*(organic-conventional)
  priceFloor: 349, // never price below this, $/acre
  listRound: 25, // list price rounds to nearest $25
  volumeRound: 5, // volume-discounted price rounds to nearest $5
  volumeMinAcres: 25, // no discount at or below this acreage
  volumeHalfK: 175, // saturation constant in the discount curve
  cogsAtScale: 14, // approx production cost/acre (margin calc)
  tierCap: { S: 0.12, A: 0.1, B: 0.08, C: 0.06, D: 0 } as Record<string, number>,
  tierThreshold: { S: 2200, A: 1500, B: 900, C: 500 } as Record<string, number>,
  bundle3galAcres: 25, // 3-gal 7-product bundle coverage
  bundle6galAcres: 50, // 6-gal 7-product bundle coverage (largest producible)
} as const;

const round5 = (n: number) => Math.round(n / 5) * 5;

/** Fast lookup by crop name (case-insensitive) or slug id. */
const BY_NAME = new Map<string, CropPricing>();
const BY_ID = new Map<string, CropPricing>();
for (const c of CROP_PRICING) {
  BY_NAME.set(c.crop.toLowerCase(), c);
  BY_ID.set(c.id, c);
}

/** Resolve a crop by display name (what the wizard stores) or slug id. */
export function findCrop(nameOrId: string): CropPricing | undefined {
  if (!nameOrId) return undefined;
  return BY_NAME.get(nameOrId.trim().toLowerCase()) ?? BY_ID.get(nameOrId.trim());
}

/**
 * Formula 3 — the volume discount fraction for a crop at acreage `A`.
 * Shallow, saturating curve; the ceiling is that crop's tier cap.
 */
export function volumeDiscount(crop: CropPricing, acres: number): number {
  const cap = crop.capPct / 100; // capPct is stored as a percent (e.g. 12)
  if (acres <= PRICING_PARAMS.volumeMinAcres) return 0;
  const a = acres - PRICING_PARAMS.volumeMinAcres;
  return cap * (a / (a + PRICING_PARAMS.volumeHalfK));
}

/** Volume-discounted AgriPure price per acre for a crop at acreage `A`. */
export function priceAtAcreage(crop: CropPricing, acres: number): number {
  const discounted = crop.list * (1 - volumeDiscount(crop, acres));
  return Math.max(PRICING_PARAMS.priceFloor, round5(discounted));
}

export interface CropLineItem {
  id: string;
  crop: string;
  cropType: string;
  tier: string;
  acres: number;
  /** list (undiscounted) AgriPure price, $/acre */
  list: number;
  /** discounted AgriPure price at this acreage, $/acre */
  perAcre: number;
  /** discount applied, fraction */
  discount: number;
  /** AgriPure line total */
  total: number;
  /** comparison totals at this acreage */
  conventional: number;
  conventionalTotal: number;
  organic: number;
  organicTotal: number;
  /** AgriPure premium over conventional / saving vs organic for this line, $ */
  premiumVsConventional: number;
  savingVsOrganic: number;
  /** true when the crop wasn't found in the model (priced at the floor) */
  unknown: boolean;
}

/** Build a priced line item for one crop + acreage. */
export function cropLineItem(name: string, acres: number): CropLineItem {
  const c = findCrop(name);
  const a = Math.max(0, Math.round(acres) || 0);
  if (!c) {
    // Unlisted crop: floor pricing, conventional/organic unknown (mirror floor).
    const perAcre = PRICING_PARAMS.priceFloor;
    return {
      id: name, crop: name, cropType: "—", tier: "D", acres: a,
      list: perAcre, perAcre, discount: 0, total: perAcre * a,
      conventional: 0, conventionalTotal: 0, organic: 0, organicTotal: 0,
      premiumVsConventional: 0, savingVsOrganic: 0, unknown: true,
    };
  }
  const perAcre = priceAtAcreage(c, a);
  const discount = volumeDiscount(c, a);
  return {
    id: c.id, crop: c.crop, cropType: c.cropType, tier: c.tier, acres: a,
    list: c.list, perAcre, discount, total: perAcre * a,
    conventional: c.conventional, conventionalTotal: c.conventional * a,
    organic: c.organic, organicTotal: c.organic * a,
    premiumVsConventional: perAcre * a - c.conventional * a,
    savingVsOrganic: c.organic * a - perAcre * a,
    unknown: false,
  };
}

export interface CropQuote {
  lines: CropLineItem[];
  acres: number;
  /** AgriPure program subtotal (sum of crop line totals), before soil samples */
  total: number;
  /** blended effective $/acre */
  effective: number;
  conventionalTotal: number;
  organicTotal: number;
  saveVsOrganic: number;
  premiumVsConventional: number;
  /** Formula 5 — production / bundle counts for the whole order */
  bundles: { sixGal: number; threeGal: number; carboys: number; laborHours: number };
}

/** Price a whole operation: map of crop name -> acres. */
export function quoteForCrops(acresByCrop: Record<string, number>): CropQuote {
  const lines = Object.entries(acresByCrop)
    .filter(([, a]) => (Number(a) || 0) > 0)
    .map(([name, a]) => cropLineItem(name, Number(a)));

  const acres = lines.reduce((t, l) => t + l.acres, 0);
  const total = lines.reduce((t, l) => t + l.total, 0);
  const conventionalTotal = lines.reduce((t, l) => t + l.conventionalTotal, 0);
  const organicTotal = lines.reduce((t, l) => t + l.organicTotal, 0);

  // Formula 5 — bundle quantities across the whole acreage.
  const sixGal = Math.floor(acres / PRICING_PARAMS.bundle6galAcres);
  const remainder = acres - sixGal * PRICING_PARAMS.bundle6galAcres;
  const threeGal = remainder > 0 ? Math.ceil(remainder / PRICING_PARAMS.bundle3galAcres) : 0;
  const carboys = (sixGal + threeGal) * 7;

  return {
    lines,
    acres,
    total,
    effective: acres > 0 ? Math.round(total / acres) : 0,
    conventionalTotal,
    organicTotal,
    saveVsOrganic: organicTotal - total,
    premiumVsConventional: total - conventionalTotal,
    bundles: { sixGal, threeGal, carboys, laborHours: Math.round(carboys * 0.75 * 10) / 10 },
  };
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
