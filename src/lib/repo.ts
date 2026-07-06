import type { Metadata } from "next";
import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb, query } from "./db";
import {
  products, customers, orders, settings, accounts, quotes,
  cropFormulas, cropPricingOverrides,
} from "./schema";
import { SIZES } from "./products";
import type { OrderStatus } from "./admin-data";
import {
  type SeoConfig, type SeoSite, type SeoEntry,
  DEFAULT_SEO, DEFAULT_SITE, DEFAULT_PAGES, SEO_PAGES, PRODUCT_TEMPLATE_PATH,
  buildMetadata, applyTokens,
} from "./seo";

export interface ProductRow {
  id: string; num: string; name: string; category: string; type: string; group: string;
  accent: string; accentSoft: string; band: string; price: number; sku: string;
  rating: number; reviews: number; stock: number; cap: number;
  tagline: string; blurb: string; long: string; npk: string; ph: string; omri: string; rate: string;
  crops: string[]; image: string;
}

const mapProduct = (r: typeof products.$inferSelect): ProductRow => {
  const { grp, crops, image, ...rest } = r;
  return { ...(rest as Omit<ProductRow, "group" | "crops" | "image">), group: grp ?? "", crops: JSON.parse(crops || "[]") as string[], image: image || "" };
};

export async function listProducts(): Promise<ProductRow[]> {
  try {
    return (await getDb().select().from(products)).map(mapProduct);
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductRow | null> {
  try {
    const r = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
    return r[0] ? mapProduct(r[0]) : null;
  } catch {
    return null;
  }
}

export interface CustomerRow {
  id: string; name: string; op: string; location: string; crop: string;
  orders: number; ltv: string; avColor: string;
}
export async function listCustomers(): Promise<CustomerRow[]> {
  return (await getDb().select().from(customers).orderBy(desc(customers.orders))) as CustomerRow[];
}

export interface OrderRow {
  id: string; customer: string; op: string; product: string; date: string;
  total: string; status: OrderStatus; created_at: string;
  payment: string; lab_production: string; recurring: number; items: number;
}
export async function listOrders(status?: string): Promise<OrderRow[]> {
  const db = getDb();
  const rows = status && status !== "All"
    ? await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.created_at))
    : await db.select().from(orders).orderBy(desc(orders.created_at));
  return rows as OrderRow[];
}

export interface NewOrderItem { id: string; size: string; qty: number; }
export interface CreateOrderInput { items: NewOrderItem[]; customer?: string; op?: string; }

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
  const items = input.items?.filter((i) => i && i.id && i.qty > 0) ?? [];
  if (!items.length) throw new Error("Order has no items");

  return getDb().transaction(async (tx) => {
    let total = 0;
    const parts: string[] = [];
    for (const it of items) {
      const p = (await tx.select({ name: products.name, price: products.price }).from(products).where(eq(products.id, it.id)).limit(1))[0];
      if (!p) continue;
      const factor = SIZES.find((s) => s.id === it.size)?.factor ?? 1;
      total += Math.round((p.price ?? 0) * factor) * it.qty;
      parts.push(it.qty > 1 ? `${p.name} ×${it.qty}` : (p.name ?? ""));
      await tx.update(products).set({ stock: sql`GREATEST(0, ${products.stock} - ${it.qty})` }).where(eq(products.id, it.id));
    }

    const ids = await tx.select({ id: orders.id }).from(orders);
    const maxNum = ids.reduce((m, r) => {
      const n = parseInt(r.id.replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 28410);
    const id = `#AP-${maxNum + 1}`;

    const now = new Date();
    const order: OrderRow = {
      id,
      customer: input.customer?.trim() || "Online order",
      op: input.op?.trim() || "Storefront",
      product: parts.join(" · ") || "—",
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: money(total),
      status: "Processing",
      created_at: now.toISOString(),
      payment: "Pending",
      lab_production: "Queued",
      recurring: 0,
      items: items.reduce((t, it) => t + it.qty, 0),
    };
    await tx.insert(orders).values(order);
    return order;
  });
}

const GROUP_ACCENT: Record<string, { accent: string; soft: string }> = {
  Soil: { accent: "#4E8A3A", soft: "#E9F0E0" },
  Growth: { accent: "#5BA03C", soft: "#E8F2DE" },
  Protection: { accent: "#C0531C", soft: "#F4E2D6" },
  Yield: { accent: "#B8860B", soft: "#F4ECD6" },
};

export interface NewProductInput {
  name: string; category: string; type: string; group: string;
  price: number; stock?: number; sku?: string; blurb?: string;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";

export async function createProduct(input: NewProductInput): Promise<ProductRow> {
  const db = getDb();
  const taken = async (cand: string) => (await db.select({ id: products.id }).from(products).where(eq(products.id, cand)).limit(1)).length > 0;
  let id = slugify(input.name);
  if (await taken(id)) {
    let i = 2;
    while (await taken(`${id}-${i}`)) i++;
    id = `${id}-${i}`;
  }
  const maxNum = (await db.select({ m: sql<number | null>`max(cast(${products.num} as integer))` }).from(products))[0]?.m ?? 0;
  const accent = GROUP_ACCENT[input.group] ?? { accent: "#4E8A3A", soft: "#E9F0E0" };
  const num = String(maxNum + 1).padStart(2, "0");

  await db.insert(products).values({
    id, num, name: input.name, category: input.category, type: input.type, grp: input.group,
    accent: accent.accent, accentSoft: accent.soft, band: accent.accent,
    price: Math.round(input.price),
    sku: input.sku?.trim() || `AP-${num}-${id.slice(0, 3).toUpperCase()}-6G`,
    rating: 0, reviews: 0, stock: input.stock ?? 0, cap: 200,
    tagline: input.blurb ?? "", blurb: input.blurb ?? "", long: input.blurb ?? "",
    npk: "—", ph: "—", omri: "OMRI-style", rate: "—", crops: JSON.stringify([]),
  });
  return (await getProduct(id))!;
}

const EDITABLE = [
  "name", "category", "type", "group", "price", "stock", "sku", "blurb",
  "tagline", "long", "npk", "ph", "omri", "rate", "image", "crops",
] as const;
type EditableField = (typeof EDITABLE)[number];

export async function updateProduct(id: string, patch: Partial<Record<EditableField, unknown>>): Promise<ProductRow | null> {
  if (!(await getProduct(id))) return null;
  const set: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (patch[key] === undefined) continue;
    if (key === "group") set.grp = String(patch[key] ?? "");
    else if (key === "price" || key === "stock") set[key] = Math.round(Number(patch[key]) || 0);
    else if (key === "crops") {
      const raw = patch[key];
      const arr = Array.isArray(raw)
        ? raw.map((s) => String(s).trim()).filter(Boolean)
        : String(raw ?? "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
      set.crops = JSON.stringify(arr);
    } else set[key] = String(patch[key] ?? "");
  }
  if (Object.keys(set).length) {
    await getDb().update(products).set(set as Partial<typeof products.$inferInsert>).where(eq(products.id, id));
  }
  return getProduct(id);
}

/* ---- Editable pricing program (graduated per-acre tiers + bundles) ----- */
const PRICING_KEY = "pricing_program";

async function getSetting(key: string): Promise<string | undefined> {
  try {
    const r = await getDb().select({ value: settings.value }).from(settings).where(eq(settings.key, key)).limit(1);
    return r[0]?.value ?? undefined;
  } catch {
    return undefined;
  }
}
async function putSetting(key: string, value: string): Promise<void> {
  await getDb().insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function getPricingProgram(): Promise<PricingProgram> {
  const value = await getSetting(PRICING_KEY);
  if (!value) return DEFAULT_PROGRAM;
  try {
    const p = JSON.parse(value) as Partial<PricingProgram>;
    return {
      tiers: Array.isArray(p.tiers) && p.tiers.length ? p.tiers : DEFAULT_PROGRAM.tiers,
      organicPerAc: typeof p.organicPerAc === "number" ? p.organicPerAc : DEFAULT_PROGRAM.organicPerAc,
      conventionalPerAc: typeof p.conventionalPerAc === "number" ? p.conventionalPerAc : DEFAULT_PROGRAM.conventionalPerAc,
      bundles: Array.isArray(p.bundles) && p.bundles.length ? p.bundles : DEFAULT_PROGRAM.bundles,
      soilSamplePrice: typeof p.soilSamplePrice === "number" ? p.soilSamplePrice : DEFAULT_PROGRAM.soilSamplePrice,
    };
  } catch {
    return DEFAULT_PROGRAM;
  }
}

export async function savePricingProgram(input: PricingProgram): Promise<PricingProgram> {
  const snap25 = (n: number) => Math.round(n / 25) * 25;
  const tiers = (input.tiers ?? [])
    .map((t) => ({
      from: Math.max(0, snap25(Number(t.from) || 0)),
      to: t.to == null || t.to === ("" as unknown) ? null : Math.max(25, snap25(Number(t.to))),
      rate: Math.max(0, Math.round(Number(t.rate) || 0)),
    }))
    .sort((a, b) => a.from - b.from);
  if (!tiers.length) throw new Error("At least one pricing tier is required");
  const bundles = (input.bundles ?? DEFAULT_PROGRAM.bundles).map((b) => ({
    id: String(b.id || b.label || "bundle").toLowerCase().replace(/[^a-z0-9]+/g, "") || "bundle",
    label: String(b.label || "Bundle"),
    gallons: Math.max(0, Number(b.gallons) || 0),
    acres: Math.max(25, snap25(Number(b.acres) || 25)),
    note: String(b.note || ""),
    best: !!b.best,
  }));
  const program: PricingProgram = {
    tiers,
    organicPerAc: Math.max(0, Math.round(Number(input.organicPerAc) || DEFAULT_PROGRAM.organicPerAc)),
    conventionalPerAc: Math.max(0, Math.round(Number(input.conventionalPerAc) || DEFAULT_PROGRAM.conventionalPerAc)),
    bundles,
    soilSamplePrice: Math.max(0, Math.round(Number(input.soilSamplePrice ?? DEFAULT_PROGRAM.soilSamplePrice))),
  };
  await putSetting(PRICING_KEY, JSON.stringify(program));
  return program;
}

/* ------------------------------- SEO config ------------------------------- */
const SEO_KEY = "seo_config";

export async function getSeoConfig(): Promise<SeoConfig> {
  const value = await getSetting(SEO_KEY);
  if (!value) return DEFAULT_SEO;
  try {
    const saved = JSON.parse(value) as Partial<SeoConfig>;
    return {
      site: { ...DEFAULT_SITE, ...(saved.site ?? {}) },
      pages: { ...DEFAULT_PAGES, ...(saved.pages ?? {}) },
    };
  } catch {
    return DEFAULT_SEO;
  }
}

export async function saveSeoConfig(input: SeoConfig): Promise<SeoConfig> {
  const clean = (s: unknown) => String(s ?? "").trim();
  const site: SeoSite = {
    siteName: clean(input.site?.siteName) || DEFAULT_SITE.siteName,
    baseUrl: clean(input.site?.baseUrl).replace(/\/$/, "") || DEFAULT_SITE.baseUrl,
    defaultOgImage: clean(input.site?.defaultOgImage),
    twitter: clean(input.site?.twitter),
  };
  const pages: Record<string, SeoEntry> = {};
  for (const { path } of SEO_PAGES) {
    const e = input.pages?.[path] ?? DEFAULT_PAGES[path];
    pages[path] = {
      title: clean(e?.title) || DEFAULT_PAGES[path]?.title || site.siteName,
      description: clean(e?.description) || DEFAULT_PAGES[path]?.description || "",
      keywords: clean(e?.keywords) || undefined,
      ogImage: clean(e?.ogImage) || undefined,
      noindex: !!e?.noindex,
    };
  }
  const config: SeoConfig = { site, pages };
  await putSetting(SEO_KEY, JSON.stringify(config));
  return config;
}

/** Resolve a saved entry for a path, falling back to defaults. */
export async function getSeoEntry(path: string): Promise<{ site: SeoSite; entry: SeoEntry }> {
  const cfg = await getSeoConfig();
  const entry = cfg.pages[path] ?? DEFAULT_PAGES[path] ?? { title: cfg.site.siteName, description: "" };
  return { site: cfg.site, entry };
}

/** Build Next.js Metadata for a static page path from the editable SEO config. */
export async function resolveSeoMetadata(path: string): Promise<Metadata> {
  const { site, entry } = await getSeoEntry(path);
  return buildMetadata(site, entry, path);
}

/** Build Metadata for a product-detail page from the editable template + product data. */
export async function resolveProductMetadata(product: { id: string; name: string; category: string; type?: string; tagline?: string; long?: string; image?: string }): Promise<Metadata> {
  const { site, entry } = await getSeoEntry(PRODUCT_TEMPLATE_PATH);
  const tokens = { name: product.name, category: product.category, type: product.type || product.category, tagline: product.tagline || product.long || "" };
  const resolved: SeoEntry = {
    title: applyTokens(entry.title, tokens),
    description: applyTokens(entry.description, tokens) || product.tagline || product.long || "",
    keywords: entry.keywords ? applyTokens(entry.keywords, tokens) : undefined,
    ogImage: entry.ogImage || (product.image?.trim() ? product.image : `/assets/bottles/${product.id}.png`),
    noindex: entry.noindex,
  };
  return buildMetadata(site, resolved, `/products/${product.id}`);
}

export type Settings = Record<string, string>;
export async function getSettings(): Promise<Settings> {
  const rows = await getDb().select({ key: settings.key, value: settings.value }).from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
}
export async function updateSettings(patch: Settings): Promise<Settings> {
  await getDb().transaction(async (tx) => {
    for (const [k, v] of Object.entries(patch)) {
      await tx.insert(settings).values({ key: k, value: String(v) }).onConflictDoUpdate({ target: settings.key, set: { value: String(v) } });
    }
  });
  return getSettings();
}

export async function deleteProduct(id: string): Promise<{ ok: boolean }> {
  await getDb().delete(products).where(eq(products.id, id));
  return { ok: true };
}

/* ---- Quotes & customer accounts (Order Now flow) ---------------------- */
import { DEFAULT_PROGRAM, type PricingProgram } from "./pricing";
import { quoteForCrops, applyCropPricingOverrides, CROP_PRICING, type CropPricing, type CropPriceOverride } from "./crop-pricing";

/* --------------------------- crop price overrides --------------------------- */

/** The admin-set conventional/organic/list overrides, as stored. */
export async function getCropPriceOverrides(): Promise<CropPriceOverride[]> {
  const rows = await getDb()
    .select({ id: cropPricingOverrides.crop_id, conventional: cropPricingOverrides.conventional, organic: cropPricingOverrides.organic, list: cropPricingOverrides.list })
    .from(cropPricingOverrides);
  return rows as CropPriceOverride[];
}

/**
 * Apply the current DB override set onto the shared crop-pricing data and return
 * the live, effective per-crop pricing. Call from any server entry point that
 * prices crops (quotes, the admin table, pages that hydrate client pricing).
 */
export async function loadCropPricing(): Promise<CropPricing[]> {
  applyCropPricingOverrides(await getCropPriceOverrides());
  return CROP_PRICING;
}

/** Insert/update one crop's conventional/organic/AgriPure-list $/acre. */
export async function saveCropPriceOverride(o: { id: string; conventional: number; organic: number; list: number }): Promise<CropPriceOverride[]> {
  const crop = CROP_PRICING.find((c) => c.id === o.id);
  if (!crop) throw new Error(`Unknown crop: ${o.id}`);
  const clamp = (n: number) => Math.max(0, Math.round(Number(n) || 0));
  const row = { crop_id: o.id, conventional: clamp(o.conventional), organic: clamp(o.organic), list: clamp(o.list), updated_at: new Date().toISOString() };
  await getDb().insert(cropPricingOverrides).values(row).onConflictDoUpdate({
    target: cropPricingOverrides.crop_id,
    set: { conventional: row.conventional, organic: row.organic, list: row.list, updated_at: row.updated_at },
  });
  return getCropPriceOverrides();
}

/** Remove a crop's override, restoring its generated default pricing. */
export async function resetCropPriceOverride(id: string): Promise<CropPriceOverride[]> {
  await getDb().delete(cropPricingOverrides).where(eq(cropPricingOverrides.crop_id, id));
  return getCropPriceOverrides();
}

export interface QuoteInput {
  customer: { name: string; email: string; phone: string; business: string; address: string };
  crops: string[];
  acres: Record<string, number>;
  /** Legacy operation-wide lists; newer quotes use soilByCrop / weedsByCrop. */
  soil?: string[];
  weeds?: string[];
  soilByCrop?: Record<string, string[]>;
  weedsByCrop?: Record<string, string[]>;
  plantHealthByCrop?: Record<string, string[]>;
  pestsByCrop: Record<string, string[]>;
  diseasesByCrop: Record<string, string[]>;
  yieldByCrop: Record<string, boolean>;
}

export interface QuoteRow {
  id: string; number: string; account_id: string; customer_name: string; customer_email: string;
  acres: number; total: number; effective: number; payload: QuoteInput;
  soil_total: number; soil_price: number;
  status: string; payment_status: string; payment_method: string | null; created_at: string;
}

const genPassword = () =>
  Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 5)).join("-");

export async function createQuote(input: QuoteInput) {
  const email = input.customer.email.trim().toLowerCase();
  const totalAcres = Object.values(input.acres).reduce((t, n) => t + (Number(n) || 0), 0);
  const program = await getPricingProgram();
  // Apply any admin per-crop price overrides before pricing this operation, so
  // the stored total matches what the grower saw in the Order Now estimate.
  applyCropPricingOverrides(await getCropPriceOverrides());
  const cq = quoteForCrops(input.acres);
  const soilPrice = program.soilSamplePrice;
  const soilTotal = (input.crops?.length || 0) * soilPrice;
  const grandTotal = cq.total + soilTotal;
  const now = new Date().toISOString();

  return getDb().transaction(async (tx) => {
    let account = (await tx.select({ id: accounts.id }).from(accounts).where(eq(accounts.email, email)).limit(1))[0];
    let isNewAccount = false;
    let tempPassword: string | undefined;
    if (!account) {
      isNewAccount = true;
      tempPassword = genPassword();
      const id = `ac-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
      await tx.insert(accounts).values({
        id, name: input.customer.name, email, phone: input.customer.phone,
        business: input.customer.business, address: input.customer.address, password: tempPassword, created_at: now,
      });
      account = { id };
    }

    const count = (await tx.select({ c: sql<number>`count(*)::int` }).from(quotes))[0]?.c ?? 0;
    const seq = count + 10001;
    const id = `q-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const number = `AP-Q-${seq}`;
    await tx.insert(quotes).values({
      id, number, account_id: account.id,
      customer_name: input.customer.name, customer_email: email,
      acres: totalAcres, total: grandTotal, effective: cq.effective,
      payload: JSON.stringify(input), soil_total: soilTotal, soil_price: soilPrice,
      status: "quote", payment_status: "unpaid", payment_method: null, created_at: now,
    });
    return { id, number, isNewAccount, accountEmail: email, tempPassword };
  });
}

const mapQuote = (r: typeof quotes.$inferSelect): QuoteRow => ({
  ...(r as Omit<QuoteRow, "payload">),
  payload: JSON.parse(r.payload || "{}") as QuoteInput,
});

export async function getQuote(id: string): Promise<QuoteRow | null> {
  const r = (await getDb().select().from(quotes).where(eq(quotes.id, id)).limit(1))[0];
  return r ? mapQuote(r) : null;
}

export async function placeOrder(id: string, method: string): Promise<QuoteRow | null> {
  if (!(await getQuote(id))) return null;
  const paymentStatus = method === "wire" || method === "check" ? "awaiting_payment" : "pending";
  await getDb().update(quotes).set({ status: "ordered", payment_status: paymentStatus, payment_method: method }).where(eq(quotes.id, id));
  return getQuote(id);
}

export async function listQuotes(): Promise<QuoteRow[]> {
  return (await getDb().select().from(quotes).orderBy(desc(quotes.created_at))).map(mapQuote);
}

export interface AccountRow {
  id: string; name: string; email: string; phone: string; business: string; address: string; created_at: string;
}

export async function getAccountById(id: string): Promise<AccountRow | null> {
  const r = (await getDb().select({
    id: accounts.id, name: accounts.name, email: accounts.email, phone: accounts.phone,
    business: accounts.business, address: accounts.address, created_at: accounts.created_at,
  }).from(accounts).where(eq(accounts.id, id)).limit(1))[0];
  return (r as AccountRow | undefined) ?? null;
}

/** Returns the account (without password) if email + password match. */
export async function verifyCustomer(email: string, password: string): Promise<AccountRow | null> {
  const row = (await getDb().select().from(accounts).where(eq(accounts.email, email.trim().toLowerCase())).limit(1))[0];
  if (!row || row.password !== password) return null;
  const { password: _pw, ...account } = row;
  void _pw;
  return account as AccountRow;
}

export async function listQuotesByAccount(accountId: string): Promise<QuoteRow[]> {
  return (await getDb().select().from(quotes).where(eq(quotes.account_id, accountId)).orderBy(desc(quotes.created_at))).map(mapQuote);
}

/* ---- Clients (real customers created when an order is placed) ---------- */
export interface ClientSummary extends AccountRow {
  orders: number; totalSpend: number; lastOrder: string | null;
}

/** Every customer account, with their order count + lifetime value. The admin Clients list. */
export async function listAccounts(): Promise<ClientSummary[]> {
  const rows = await getDb()
    .select({
      id: accounts.id, name: accounts.name, email: accounts.email, phone: accounts.phone,
      business: accounts.business, address: accounts.address, created_at: accounts.created_at,
      orders: sql<number>`count(${quotes.id})::int`,
      totalSpend: sql<number>`coalesce(sum(${quotes.total}), 0)::int`,
      lastOrder: sql<string | null>`max(${quotes.created_at})`,
    })
    .from(accounts)
    .leftJoin(quotes, eq(quotes.account_id, accounts.id))
    .groupBy(accounts.id)
    .orderBy(desc(accounts.created_at));
  return rows as ClientSummary[];
}

/** A single client's full contact record plus every quote/order they've placed. */
export async function getClientWithQuotes(id: string): Promise<{ account: AccountRow; quotes: QuoteRow[] } | null> {
  const account = await getAccountById(id);
  if (!account) return null;
  return { account, quotes: await listQuotesByAccount(id) };
}

/* ---- Crop formula library (lab-only blends, imported from CSV) --------- */
export interface CropFormulaRow {
  id: string; crop: string; crop_id: string; line: string; line_code: string;
  primary_remedy: string; potency: string; blend: string; targets: string;
  rate: string; method: string; stage: string; cadence: string; lab_note: string;
}

const LINE_ORDER = ["RES", "CLN", "STR", "GRO", "PRO", "BST"];
const LINE_NAME: Record<string, string> = {
  RES: "Restore", CLN: "Cleanse", STR: "Strength", GRO: "Grow", PRO: "Protect", BST: "Boost",
};

/** The 6 product-line lab blends for a crop (case-insensitive), in program order. */
export async function getCropFormulas(crop: string): Promise<CropFormulaRow[]> {
  const rows = await getDb().select().from(cropFormulas).where(sql`lower(${cropFormulas.crop}) = lower(${crop})`);
  return (rows as CropFormulaRow[]).sort((a, b) => LINE_ORDER.indexOf(a.line_code) - LINE_ORDER.indexOf(b.line_code));
}

export async function listCropFormulaCrops(): Promise<{ crop: string; count: number }[]> {
  const rows = await getDb()
    .select({ crop: cropFormulas.crop, count: sql<number>`count(*)::int` })
    .from(cropFormulas).groupBy(cropFormulas.crop).orderBy(asc(cropFormulas.crop));
  return rows as { crop: string; count: number }[];
}

export interface CropFormulaInput {
  crop: string; lineCode: string;
  primaryRemedy?: string; potency?: string; blend: string; targets?: string;
  rate?: string; method?: string; stage?: string; cadence?: string; labNote?: string;
}

/** Add or update one product-line formula for a crop (creates a CUSTOM crop_id for new crops). */
export async function upsertCropFormula(input: CropFormulaInput): Promise<CropFormulaRow> {
  const db = getDb();
  const lineCode = input.lineCode.toUpperCase();
  const existing = (await db.select({ crop_id: cropFormulas.crop_id }).from(cropFormulas).where(sql`lower(${cropFormulas.crop}) = lower(${input.crop})`).limit(1))[0];
  const cropId = existing?.crop_id ?? `CUSTOM-${input.crop.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const id = `${cropId}-${lineCode}`;
  const row = {
    id, crop: input.crop, crop_id: cropId, line: LINE_NAME[lineCode] ?? lineCode, line_code: lineCode,
    primary_remedy: input.primaryRemedy ?? "", potency: input.potency ?? "6C", blend: input.blend,
    targets: input.targets ?? "", rate: input.rate ?? "", method: input.method ?? "",
    stage: input.stage ?? "", cadence: input.cadence ?? "", lab_note: input.labNote ?? "",
  };
  await db.insert(cropFormulas).values(row).onConflictDoUpdate({
    target: cropFormulas.id,
    set: {
      primary_remedy: row.primary_remedy, potency: row.potency, blend: row.blend, targets: row.targets,
      rate: row.rate, method: row.method, stage: row.stage, cadence: row.cadence, lab_note: row.lab_note,
    },
  });
  return (await db.select().from(cropFormulas).where(eq(cropFormulas.id, id)).limit(1))[0] as CropFormulaRow;
}

/** Every imported crop formula, flat, ordered by crop then program order — for the Formulas page. */
export async function listAllCropFormulas(): Promise<CropFormulaRow[]> {
  const rows = (await getDb().select().from(cropFormulas)) as CropFormulaRow[];
  return rows.sort((a, b) =>
    a.crop.localeCompare(b.crop) || LINE_ORDER.indexOf(a.line_code) - LINE_ORDER.indexOf(b.line_code));
}

export interface RemedyRollup {
  remedy: string; potency: string; formulaCount: number; cropCount: number; lines: string; sampleTargets: string;
}

const BLEND_COMPONENT = /^(.+?)\s+(\d+\s*[CXMcxm]+)\s*[—–-]/;
const lineRank = (name: string) =>
  LINE_ORDER.indexOf(Object.keys(LINE_NAME).find((k) => LINE_NAME[k] === name) || "");

/** EVERY distinct remedy used across the imported blends (not just each formula's primary). */
export async function listCropRemedies(): Promise<RemedyRollup[]> {
  const rows = await getDb()
    .select({ crop: cropFormulas.crop, line: cropFormulas.line, blend: cropFormulas.blend, targets: cropFormulas.targets })
    .from(cropFormulas);

  const agg = new Map<string, { pots: Set<string>; uses: number; crops: Set<string>; lines: Set<string>; targets: string }>();
  for (const r of rows) {
    for (const part of (r.blend || "").split(";").map((s) => s.trim()).filter(Boolean)) {
      const m = part.match(BLEND_COMPONENT);
      if (!m) continue;
      const name = m[1].trim();
      const pot = m[2].replace(/\s+/g, "");
      let e = agg.get(name);
      if (!e) { e = { pots: new Set(), uses: 0, crops: new Set(), lines: new Set(), targets: "" }; agg.set(name, e); }
      e.pots.add(pot);
      e.uses++;
      e.crops.add(r.crop ?? "");
      if (r.line) e.lines.add(r.line);
      if (!e.targets && r.targets) e.targets = r.targets;
    }
  }

  return Array.from(agg.entries())
    .map(([remedy, e]) => ({
      remedy,
      potency: Array.from(e.pots).sort().join(", "),
      formulaCount: e.uses,
      cropCount: e.crops.size,
      lines: Array.from(e.lines).sort((a, b) => lineRank(a) - lineRank(b)).join(", "),
      sampleTargets: e.targets,
    }))
    .sort((a, b) => b.formulaCount - a.formulaCount || a.remedy.localeCompare(b.remedy));
}

/* ---- Generic CRUD for the dashboard modules ---------------------------- */
/* eslint-disable @typescript-eslint/no-explicit-any */

const today = () =>
  new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

interface EntityCfg {
  table: string;
  prefix: string;
  cols: string[];
  json?: string[];
  order?: string;
  dateField?: string;
}

function crud(cfg: EntityCfg) {
  const json = cfg.json ?? [];
  // Postgres has no rowid; ids are insertion-ordered (seed `xx-1..` then
  // `xx-<base36 time>-n`), so id ordering preserves the original sequence.
  const order = cfg.order ?? `"id" DESC`;
  const tbl = `"${cfg.table}"`;
  const parse = (r: any) => {
    if (!r) return null;
    const o = { ...r };
    for (const f of json) if (typeof o[f] === "string") { try { o[f] = JSON.parse(o[f]); } catch { /* keep */ } }
    return o;
  };
  const ser = (data: any) => {
    const o: Record<string, any> = {};
    for (const c of cfg.cols) {
      if (data[c] === undefined) continue;
      o[c] = json.includes(c) && typeof data[c] !== "string" ? JSON.stringify(data[c]) : data[c];
    }
    return o;
  };
  const row = async (id: string) => (await query<any>(`SELECT * FROM ${tbl} WHERE "id" = $1`, [id]))[0] ?? null;
  let n = 0;
  return {
    list: async (): Promise<any[]> => (await query<any>(`SELECT * FROM ${tbl} ORDER BY ${order}`)).map(parse),
    get: async (id: string): Promise<any> => parse(await row(id)),
    create: async (data: any): Promise<any> => {
      const id = `${cfg.prefix}-${Date.now().toString(36)}-${n++}`;
      const vals = ser(data);
      if (cfg.dateField && !vals[cfg.dateField]) vals[cfg.dateField] = today();
      const cols = Object.keys(vals);
      const all = ["id", ...cols];
      const params = [id, ...cols.map((c) => vals[c])];
      const placeholders = all.map((_, i) => `$${i + 1}`).join(", ");
      const colSql = all.map((c) => `"${c}"`).join(", ");
      await query(`INSERT INTO ${tbl} (${colSql}) VALUES (${placeholders})`, params);
      return parse(await row(id));
    },
    update: async (id: string, data: any): Promise<any> => {
      if (!(await row(id))) return null;
      const vals = ser(data);
      const cols = Object.keys(vals);
      if (cols.length) {
        const setSql = cols.map((c, i) => `"${c}" = $${i + 1}`).join(", ");
        const params = [...cols.map((c) => vals[c]), id];
        await query(`UPDATE ${tbl} SET ${setSql} WHERE "id" = $${cols.length + 1}`, params);
      }
      return parse(await row(id));
    },
    remove: async (id: string): Promise<{ ok: boolean }> => {
      await query(`DELETE FROM ${tbl} WHERE "id" = $1`, [id]);
      return { ok: true };
    },
  };
}

const clientsCrud = crud({ table: "clients", prefix: "cl", order: `"id" ASC`, dateField: "dateCreated",
  cols: ["company", "clientName", "email", "address", "dateCreated"] });
const formulasCrud = crud({ table: "formulas", prefix: "fm", dateField: "dateCreated",
  cols: ["name", "productLine", "crop", "description", "targetPests", "targetDiseases", "applicationMethod", "dosage", "unitPrice", "remedies", "status", "dateCreated"] });
const remediesCrud = crud({ table: "remedies", prefix: "rm", dateField: "dateCreated",
  cols: ["name", "description", "recurring", "status", "dateCreated"] });
const adminsCrud = crud({ table: "admins", prefix: "ad", dateField: "dateCreated",
  cols: ["name", "email", "status", "dateCreated"] });
const teamCrud = crud({ table: "team", prefix: "tm", order: `"sort" ASC`,
  cols: ["name", "role", "status", "sort"] });
const provenCrud = crud({ table: "proven_entries", prefix: "pv", order: `"id" ASC`,
  cols: ["title", "metric1Label", "metric1Value", "metric2Label", "metric2Value", "linkedOrder", "status", "description"] });
const faqsCrud = crud({ table: "faqs", prefix: "fq", order: `"id" ASC`, json: ["questions"],
  cols: ["section", "product", "status", "questions"] });

export const ENTITIES: Record<string, ReturnType<typeof crud>> = {
  clients: clientsCrud,
  formulas: formulasCrud,
  remedies: remediesCrud,
  admins: adminsCrud,
  team: teamCrud,
  proven: provenCrud,
  faqs: faqsCrud,
};

export interface ClientRow { id: string; company: string; clientName: string; email: string; address: string; dateCreated: string }
export interface FormulaRow { id: string; name: string; productLine: string; crop: string; description: string; targetPests: string; targetDiseases: string; applicationMethod: string; dosage: string; unitPrice: number; remedies: string; status: string; dateCreated: string }
export interface RemedyRow { id: string; name: string; description: string; recurring: number; status: string; dateCreated: string }
export interface AdminRow { id: string; name: string; email: string; status: string; dateCreated: string }
export interface TeamRow { id: string; name: string; role: string; status: string; sort: number }
export interface ProvenRow { id: string; title: string; metric1Label: string; metric1Value: string; metric2Label: string; metric2Value: string; linkedOrder: string; status: string; description: string }
export interface FaqRow { id: string; section: string; product: string; status: string; questions: { q: string; a: string }[] }

export const listClients = () => clientsCrud.list() as Promise<ClientRow[]>;
export const listFormulas = () => formulasCrud.list() as Promise<FormulaRow[]>;
export const listRemedies = () => remediesCrud.list() as Promise<RemedyRow[]>;
export const listAdmins = () => adminsCrud.list() as Promise<AdminRow[]>;
export const listTeam = () => teamCrud.list() as Promise<TeamRow[]>;
export const listProven = () => provenCrud.list() as Promise<ProvenRow[]>;
export const listFaqs = () => faqsCrud.list() as Promise<FaqRow[]>;

/* ---- Admin auth (Auth.js credentials + RBAC) -------------------------- */
export interface AdminAuthRow {
  id: string; email: string; name: string | null;
  password_hash: string | null; role: string | null; status: string | null;
}

/** Look up an admin by email (case-insensitive) for credential verification. */
export async function getAdminByEmail(email: string): Promise<AdminAuthRow | null> {
  const rows = await query<AdminAuthRow>(
    `SELECT id, email, name, password_hash, role, status FROM admins WHERE lower(email) = lower($1) LIMIT 1`,
    [email],
  );
  return rows[0] ?? null;
}

/** Create or update an admin's login credentials + role (used by scripts/create-admin). */
export async function setAdminCredentials(input: { email: string; name?: string; passwordHash: string; role?: string }): Promise<{ id: string; email: string; role: string }> {
  const email = input.email.trim().toLowerCase();
  const role = input.role ?? "admin";
  const existing = await getAdminByEmail(email);
  if (existing) {
    await query(
      `UPDATE admins SET password_hash = $1, role = $2, name = COALESCE($3, name), status = 'Active' WHERE id = $4`,
      [input.passwordHash, role, input.name ?? null, existing.id],
    );
    return { id: existing.id, email, role };
  }
  const id = `ad-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  await query(
    `INSERT INTO admins (id, name, email, status, "dateCreated", password_hash, role) VALUES ($1,$2,$3,'Active',$4,$5,$6)`,
    [id, input.name ?? email, email, today(), input.passwordHash, role],
  );
  return { id, email, role };
}

/* ---- Password reset tokens --------------------------------------------- */
import crypto from "crypto";

export async function createPasswordResetToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const id = `prt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await query(
    `INSERT INTO password_reset_tokens (id, email, token, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)`,
    [id, email.trim().toLowerCase(), token, expiresAt, now],
  );
  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<{ email: string } | null> {
  const rows = await query<{ email: string; expires_at: string; used_at: string | null }>(
    `SELECT email, expires_at, used_at FROM password_reset_tokens WHERE token = $1 LIMIT 1`,
    [token],
  );
  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at) < new Date()) return null;
  return { email: row.email };
}

export async function consumePasswordResetToken(token: string): Promise<void> {
  await query(`UPDATE password_reset_tokens SET used_at = $1 WHERE token = $2`, [
    new Date().toISOString(),
    token,
  ]);
}
