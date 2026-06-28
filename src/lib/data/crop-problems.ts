// Crop-specific problem profiles, generated from the formulation pipeline
// (pipeline/build_v3.py → data/crops.csv). Drives the Order Now wizard so the
// per-crop steps show the actual pests, diseases, and plant-health issues each
// crop faces — backed by the same data as the lab formulation database.
import data from "./crop-problems.json";
import { PLANT_HEALTH, PESTS, DISEASES } from "@/lib/order-options";

export interface CropProblems {
  plantHealth: string[];
  pests: string[];
  diseases: string[];
  soil: string[];
  weeds: string[];
}

const MAP = data as Record<string, CropProblems>;
const BY_LOWER = new Map<string, CropProblems>();
for (const [k, v] of Object.entries(MAP)) BY_LOWER.set(k.toLowerCase(), v);

const EMPTY: CropProblems = { plantHealth: [], pests: [], diseases: [], soil: [], weeds: [] };

export function cropProblemsFor(name: string): CropProblems {
  return BY_LOWER.get((name || "").trim().toLowerCase()) ?? EMPTY;
}

const dedupe = (xs: string[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(x); }
  }
  return out;
};

/** Crop-specific options first, then the generic fallback list (deduped). */
export const plantHealthOptions = (crop: string) => dedupe([...cropProblemsFor(crop).plantHealth, ...PLANT_HEALTH]);
export const pestOptions = (crop: string) => dedupe([...cropProblemsFor(crop).pests, ...PESTS]);
export const diseaseOptions = (crop: string) => dedupe([...cropProblemsFor(crop).diseases, ...DISEASES]);
