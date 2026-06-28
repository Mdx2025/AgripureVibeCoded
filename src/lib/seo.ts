import type { Metadata } from "next";

/**
 * SEO is editable from the admin dashboard (Marketing → SEO). Defaults below are
 * the fallback when nothing has been saved yet. Everything is stored as a single
 * JSON blob in the settings table under SEO_KEY and merged over these defaults.
 *
 * This module is intentionally DB-free so it can be imported by both server
 * pages (generateMetadata) and the client-side admin editor.
 */

export type SeoEntry = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string; // absolute URL or site-relative path; falls back to site default
  noindex?: boolean;
};

export type SeoSite = {
  siteName: string;
  baseUrl: string; // e.g. https://agripure.com — used for canonical + OG urls
  defaultOgImage: string;
  twitter: string; // @handle, optional
};

export type SeoConfig = {
  site: SeoSite;
  pages: Record<string, SeoEntry>;
};

/** The product-detail template path. Its entry supports {name}, {category}, {tagline} tokens. */
export const PRODUCT_TEMPLATE_PATH = "/products";

/** Pages exposed in the admin SEO editor, in display order. */
export const SEO_PAGES: { path: string; label: string; group: string; note?: string }[] = [
  { path: "/", label: "Home", group: "Marketing pages" },
  { path: "/shop", label: "Products (Shop)", group: "Marketing pages" },
  { path: "/how-it-works", label: "How It Works", group: "Marketing pages" },
  { path: "/why-choose-us", label: "Why Choose Us", group: "Marketing pages" },
  { path: "/nano-technology", label: "Nano Technology", group: "Marketing pages" },
  { path: "/pricing", label: "Pricing", group: "Marketing pages" },
  { path: "/about", label: "About", group: "Marketing pages" },
  { path: "/contact", label: "Contact", group: "Marketing pages" },
  { path: "/order-now", label: "Order Now", group: "Conversion" },
  {
    path: PRODUCT_TEMPLATE_PATH,
    label: "Product detail (template)",
    group: "Templates",
    note: "Applied to every /products/… page. Use {name}, {category}, {type} and {tagline} as placeholders.",
  },
];

export const DEFAULT_SITE: SeoSite = {
  siteName: "AgriPure",
  baseUrl: "https://agripure.com",
  defaultOgImage: "/assets/fertigation/fertigation-room.jpg",
  twitter: "",
};

export const DEFAULT_PAGES: Record<string, SeoEntry> = {
  "/": {
    title: "AgriPure — Natural pesticides, fungicides & nutrients",
    description:
      "Natural pesticides, fungicides, and nutrients — custom-formulated for your crop, soil, and pressures. One six-product program, fed through your irrigation, soil to harvest.",
    keywords: "natural pesticides, organic fungicide, crop nutrients, fertigation, custom crop formulation, biological farming",
  },
  "/shop": {
    title: "The Six Products — AgriPure",
    description:
      "Restore, Cleanse, Strength, Grow, Protect and Boost — the six natural AgriPure inputs that carry your crop from soil prep to harvest.",
    keywords: "AgriPure products, natural crop inputs, soil amendment, biological fungicide, yield booster",
  },
  "/how-it-works": {
    title: "How It Works — AgriPure",
    description:
      "From a custom, crop-specific formulation of all six products, to precise fertigation dosing, to season-long application across the crop lifecycle — see the full AgriPure process.",
    keywords: "how AgriPure works, soil testing, custom formulation, fertigation system, crop program",
  },
  "/why-choose-us": {
    title: "Why Choose AgriPure",
    description:
      "Build pest and disease resistance before it strikes, lift yields back toward nature's natural loss rate, qualify your crop as organic, and run one natural program instead of many.",
    keywords: "why AgriPure, organic certification, higher yields, natural pest resistance, reduce crop loss",
  },
  "/nano-technology": {
    title: "Nano Technology — AgriPure",
    description:
      "How potentized nano-particle inputs are shrunk to a scale plants absorb directly through water — switching on the crop's own defenses with zero chemicals.",
    keywords: "nano technology agriculture, potentized inputs, nano particles crops, natural plant defense",
  },
  "/pricing": {
    title: "Pricing — AgriPure",
    description:
      "Conventional vs organic vs AgriPure, priced per crop and per acre. One natural six-product system, custom-formulated to your crop and acreage.",
    keywords: "AgriPure pricing, cost per acre, organic vs conventional cost, crop program pricing",
  },
  "/about": {
    title: "About AgriPure",
    description:
      "AgriPure builds living-soil, all-natural crop programs custom-formulated to your ground and crop — grounded in agronomy, proven in the field, and kind to the soil.",
    keywords: "about AgriPure, sustainable agriculture company, natural farming inputs",
  },
  "/contact": {
    title: "Contact AgriPure",
    description:
      "Talk to the AgriPure team about a custom program for your crops, soil, and acreage. Get a soil-sample kit on the way and a per-acre quote.",
    keywords: "contact AgriPure, custom crop quote, soil sample kit, agronomy support",
  },
  "/order-now": {
    title: "Order Now — AgriPure",
    description:
      "Build a custom AgriPure program for your crops and get an instant per-acre quote. Tell us your crops, acreage, and pressures to get started.",
    keywords: "order AgriPure, custom crop quote, per-acre pricing, soil sample order",
  },
  [PRODUCT_TEMPLATE_PATH]: {
    title: "{name} — {type} · AgriPure",
    description: "{tagline}",
    keywords: "AgriPure {name}, natural {type}, {category}, crop input",
  },
};

export const DEFAULT_SEO: SeoConfig = { site: DEFAULT_SITE, pages: DEFAULT_PAGES };

/** Substitute {token} placeholders (used by the product-detail template). */
export function applyTokens(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => (tokens[k] ?? "").toString() || `{${k}}`);
}

function absoluteUrl(baseUrl: string, pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Build a Next.js Metadata object from a resolved SEO entry + site config.
 * `path` is the canonical site path for this page (e.g. "/pricing").
 */
export function buildMetadata(site: SeoSite, entry: SeoEntry, path: string): Metadata {
  const ogImage = (entry.ogImage && entry.ogImage.trim()) || site.defaultOgImage;
  const canonical = absoluteUrl(site.baseUrl, path === "/" ? "/" : path);
  const images = ogImage ? [{ url: absoluteUrl(site.baseUrl, ogImage) }] : undefined;

  return {
    metadataBase: site.baseUrl ? new URL(site.baseUrl) : undefined,
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords ? entry.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    alternates: { canonical },
    robots: entry.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: site.siteName,
      title: entry.title,
      description: entry.description,
      url: canonical,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      site: site.twitter || undefined,
      images: images?.map((i) => i.url),
    },
  };
}
