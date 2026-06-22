// Blend recipe parsing/serialization (client-safe).
// A component looks like:
//   "Silicea 6C — 55.6% (63.1 mL/3gal, 126.2 mL/6gal)"
// The mL charges scale linearly with the percentage; ~113.5 mL/3gal at 100%.

export const ML_PER_3GAL_AT_100 = 113.5;
export const ML_PER_6GAL_AT_100 = 227;

export interface BlendComponent {
  remedy: string;
  potency: string;
  percent: number;
}

const COMPONENT = /^(.+?)\s+(\d+\s*[CXMcxm]+)\s*[—–-]\s*([\d.]+)\s*%/;

export function parseBlend(blend: string): BlendComponent[] {
  return (blend || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(COMPONENT);
      if (m) return { remedy: m[1].trim(), potency: m[2].replace(/\s+/g, ""), percent: parseFloat(m[3]) || 0 };
      // Fallback: best-effort split on the em dash, else keep whole text as the remedy.
      const dash = part.split(/[—–-]/)[0].trim();
      return { remedy: dash || part, potency: "6C", percent: 0 };
    });
}

export function mlFor(percent: number, gal: 3 | 6): number {
  const base = gal === 3 ? ML_PER_3GAL_AT_100 : ML_PER_6GAL_AT_100;
  return Math.round((percent / 100) * base * 10) / 10;
}

export function serializeBlend(components: BlendComponent[]): string {
  return components
    .filter((c) => c.remedy.trim())
    .map((c) => {
      const pct = Number.isFinite(c.percent) ? c.percent : 0;
      const potency = c.potency.trim() || "6C";
      return `${c.remedy.trim()} ${potency} — ${pct.toFixed(1)}% (${mlFor(pct, 3).toFixed(1)} mL/3gal, ${mlFor(pct, 6).toFixed(1)} mL/6gal)`;
    })
    .join("; ");
}

export function totalPercent(components: BlendComponent[]): number {
  return Math.round(components.reduce((t, c) => t + (Number.isFinite(c.percent) ? c.percent : 0), 0) * 10) / 10;
}
