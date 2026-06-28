import type { Metadata } from "next";
import { getDb } from "./db";
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

interface ProductDbRow extends Omit<ProductRow, "crops" | "group" | "image"> {
  grp: string;
  crops: string;
  image: string | null;
}

const mapProduct = (r: ProductDbRow): ProductRow => {
  const { grp, crops, image, ...rest } = r;
  return { ...rest, group: grp, crops: JSON.parse(crops || "[]") as string[], image: image || "" };
};

export function listProducts(): ProductRow[] {
  return (getDb().prepare("SELECT * FROM products").all() as ProductDbRow[]).map(mapProduct);
}

export function getProduct(id: string): ProductRow | null {
  const r = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductDbRow | undefined;
  return r ? mapProduct(r) : null;
}

export interface CustomerRow {
  id: string; name: string; op: string; location: string; crop: string;
  orders: number; ltv: string; avColor: string;
}
export function listCustomers(): CustomerRow[] {
  return getDb().prepare("SELECT * FROM customers ORDER BY orders DESC").all() as CustomerRow[];
}

export interface OrderRow {
  id: string; customer: string; op: string; product: string; date: string;
  total: string; status: OrderStatus; created_at: string;
  payment: string; lab_production: string; recurring: number; items: number;
}
export function listOrders(status?: string): OrderRow[] {
  const db = getDb();
  const rows =
    status && status !== "All"
      ? (db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC").all(status) as OrderRow[])
      : (db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as OrderRow[]);
  return rows;
}

export interface NewOrderItem {
  id: string;
  size: string;
  qty: number;
}
export interface CreateOrderInput {
  items: NewOrderItem[];
  customer?: string;
  op?: string;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function createOrder(input: CreateOrderInput): OrderRow {
  const db = getDb();
  const items = input.items?.filter((i) => i && i.id && i.qty > 0) ?? [];
  if (!items.length) throw new Error("Order has no items");

  // Build summary + total from current product prices, and draw down stock.
  let total = 0;
  const parts: string[] = [];
  const decStock = db.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?");
  const getPrice = db.prepare("SELECT name, price FROM products WHERE id = ?");

  const tx = db.transaction(() => {
    for (const it of items) {
      const p = getPrice.get(it.id) as { name: string; price: number } | undefined;
      if (!p) continue;
      const factor = SIZES.find((s) => s.id === it.size)?.factor ?? 1;
      total += Math.round(p.price * factor) * it.qty;
      parts.push(it.qty > 1 ? `${p.name} ×${it.qty}` : p.name);
      decStock.run(it.qty, it.id);
    }

    // Next order id from the max numeric suffix.
    const ids = db.prepare("SELECT id FROM orders").all() as { id: string }[];
    const maxNum = ids.reduce((m, r) => {
      const n = parseInt(r.id.replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > m ? n : m;
    }, 28410);
    const id = `#AP-${maxNum + 1}`;

    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const created_at = now.toISOString();

    const order: OrderRow = {
      id,
      customer: input.customer?.trim() || "Online order",
      op: input.op?.trim() || "Storefront",
      product: parts.join(" · ") || "—",
      date,
      total: money(total),
      status: "Processing",
      created_at,
      payment: "Pending",
      lab_production: "Queued",
      recurring: 0,
      items: items.reduce((t, it) => t + it.qty, 0),
    };
    db.prepare(
      `INSERT INTO orders (id,customer,op,product,date,total,status,created_at,payment,lab_production,recurring,items)
       VALUES (@id,@customer,@op,@product,@date,@total,@status,@created_at,@payment,@lab_production,@recurring,@items)`,
    ).run(order);
    return order;
  });

  return tx() as OrderRow;
}

const GROUP_ACCENT: Record<string, { accent: string; soft: string }> = {
  Soil: { accent: "#4E8A3A", soft: "#E9F0E0" },
  Growth: { accent: "#5BA03C", soft: "#E8F2DE" },
  Protection: { accent: "#C0531C", soft: "#F4E2D6" },
  Yield: { accent: "#B8860B", soft: "#F4ECD6" },
};

export interface NewProductInput {
  name: string;
  category: string;
  type: string;
  group: string;
  price: number;
  stock?: number;
  sku?: string;
  blurb?: string;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";

export function createProduct(input: NewProductInput): ProductRow {
  const db = getDb();
  let id = slugify(input.name);
  const exists = db.prepare("SELECT 1 FROM products WHERE id = ?");
  if (exists.get(id)) {
    let i = 2;
    while (exists.get(`${id}-${i}`)) i++;
    id = `${id}-${i}`;
  }
  const maxNum = (db.prepare("SELECT MAX(CAST(num AS INTEGER)) AS m FROM products").get() as { m: number | null }).m ?? 0;
  const accent = GROUP_ACCENT[input.group] ?? { accent: "#4E8A3A", soft: "#E9F0E0" };

  db.prepare(`INSERT INTO products
    (id,num,name,category,type,grp,accent,accentSoft,band,price,sku,rating,reviews,stock,cap,tagline,blurb,long,npk,ph,omri,rate,crops)
    VALUES (@id,@num,@name,@category,@type,@grp,@accent,@accentSoft,@band,@price,@sku,@rating,@reviews,@stock,@cap,@tagline,@blurb,@long,@npk,@ph,@omri,@rate,@crops)`).run({
    id,
    num: String(maxNum + 1).padStart(2, "0"),
    name: input.name,
    category: input.category,
    type: input.type,
    grp: input.group,
    accent: accent.accent,
    accentSoft: accent.soft,
    band: accent.accent,
    price: Math.round(input.price),
    sku: input.sku?.trim() || `AP-${String(maxNum + 1).padStart(2, "0")}-${id.slice(0, 3).toUpperCase()}-6G`,
    rating: 0,
    reviews: 0,
    stock: input.stock ?? 0,
    cap: 200,
    tagline: input.blurb ?? "",
    blurb: input.blurb ?? "",
    long: input.blurb ?? "",
    npk: "—",
    ph: "—",
    omri: "OMRI-style",
    rate: "—",
    crops: JSON.stringify([]),
  });
  return getProduct(id)!;
}

const EDITABLE = [
  "name", "category", "type", "group", "price", "stock", "sku", "blurb",
  "tagline", "long", "npk", "ph", "omri", "rate", "image", "crops",
] as const;
type EditableField = (typeof EDITABLE)[number];

export function updateProduct(id: string, patch: Partial<Record<EditableField, unknown>>): ProductRow | null {
  const db = getDb();
  if (!getProduct(id)) return null;
  const cols: string[] = [];
  const vals: (string | number)[] = [];
  for (const key of EDITABLE) {
    if (patch[key] === undefined) continue;
    const col = key === "group" ? "grp" : key;
    let v: string | number;
    if (key === "price" || key === "stock") v = Math.round(Number(patch[key]) || 0);
    else if (key === "crops") {
      // accept an array or a comma/newline-separated string → JSON array of trimmed tags
      const raw = patch[key];
      const arr = Array.isArray(raw)
        ? raw.map((s) => String(s).trim()).filter(Boolean)
        : String(raw ?? "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
      v = JSON.stringify(arr);
    } else v = String(patch[key] ?? "");
    cols.push(`${col} = ?`);
    vals.push(v);
  }
  if (!cols.length) return getProduct(id);
  vals.push(id);
  db.prepare(`UPDATE products SET ${cols.join(", ")} WHERE id = ?`).run(...vals);
  return getProduct(id);
}

/* ---- Editable pricing program (graduated per-acre tiers + bundles) ----- */
const PRICING_KEY = "pricing_program";

export function getPricingProgram(): PricingProgram {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(PRICING_KEY) as { value: string } | undefined;
  if (!row) return DEFAULT_PROGRAM;
  try {
    const p = JSON.parse(row.value) as Partial<PricingProgram>;
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

export function savePricingProgram(input: PricingProgram): PricingProgram {
  // Acreage is priced in 25-acre increments — snap all acreage values to 25.
  const snap25 = (n: number) => Math.round(n / 25) * 25;
  // normalize + sort tiers by floor; coerce numbers
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
  getDb().prepare("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
    .run(PRICING_KEY, JSON.stringify(program));
  return program;
}

/* ------------------------------- SEO config ------------------------------- */
const SEO_KEY = "seo_config";

export function getSeoConfig(): SeoConfig {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(SEO_KEY) as { value: string } | undefined;
  if (!row) return DEFAULT_SEO;
  try {
    const saved = JSON.parse(row.value) as Partial<SeoConfig>;
    return {
      site: { ...DEFAULT_SITE, ...(saved.site ?? {}) },
      // Merge saved page entries over defaults so newly-added pages still appear.
      pages: { ...DEFAULT_PAGES, ...(saved.pages ?? {}) },
    };
  } catch {
    return DEFAULT_SEO;
  }
}

export function saveSeoConfig(input: SeoConfig): SeoConfig {
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
  getDb().prepare("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
    .run(SEO_KEY, JSON.stringify(config));
  return config;
}

/** Resolve a saved entry for a path, falling back to defaults. */
export function getSeoEntry(path: string): { site: SeoSite; entry: SeoEntry } {
  const cfg = getSeoConfig();
  const entry = cfg.pages[path] ?? DEFAULT_PAGES[path] ?? { title: cfg.site.siteName, description: "" };
  return { site: cfg.site, entry };
}

/** Build Next.js Metadata for a static page path from the editable SEO config. */
export function resolveSeoMetadata(path: string): Metadata {
  const { site, entry } = getSeoEntry(path);
  return buildMetadata(site, entry, path);
}

/** Build Metadata for a product-detail page from the editable template + product data. */
export function resolveProductMetadata(product: { id: string; name: string; category: string; type?: string; tagline?: string; long?: string; image?: string }): Metadata {
  const { site, entry } = getSeoEntry(PRODUCT_TEMPLATE_PATH);
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
export function getSettings(): Settings {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export function updateSettings(patch: Settings): Settings {
  const db = getDb();
  const up = db.prepare(
    "INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
  );
  const tx = db.transaction(() => {
    for (const [k, v] of Object.entries(patch)) up.run(k, String(v));
  });
  tx();
  return getSettings();
}

export function deleteProduct(id: string): { ok: boolean } {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  return { ok: true };
}

/* ---- Quotes & customer accounts (Order Now flow) ---------------------- */
import { DEFAULT_PROGRAM, type PricingProgram } from "./pricing";
import { quoteForCrops, applyCropPricingOverrides, CROP_PRICING, type CropPricing, type CropPriceOverride } from "./crop-pricing";

/* --------------------------- crop price overrides --------------------------- */

/** The admin-set conventional/organic/list overrides, as stored. */
export function getCropPriceOverrides(): CropPriceOverride[] {
  return getDb()
    .prepare("SELECT crop_id AS id, conventional, organic, list FROM crop_pricing_overrides")
    .all() as CropPriceOverride[];
}

/**
 * Apply the current DB override set onto the shared crop-pricing data and return
 * the live, effective per-crop pricing. Call from any server entry point that
 * prices crops (quotes, the admin table, pages that hydrate client pricing).
 */
export function loadCropPricing(): CropPricing[] {
  applyCropPricingOverrides(getCropPriceOverrides());
  return CROP_PRICING;
}

/** Insert/update one crop's conventional/organic/AgriPure-list $/acre. */
export function saveCropPriceOverride(o: { id: string; conventional: number; organic: number; list: number }): CropPriceOverride[] {
  const crop = CROP_PRICING.find((c) => c.id === o.id);
  if (!crop) throw new Error(`Unknown crop: ${o.id}`);
  const clamp = (n: number) => Math.max(0, Math.round(Number(n) || 0));
  getDb()
    .prepare(`INSERT INTO crop_pricing_overrides (crop_id, conventional, organic, list, updated_at)
      VALUES (@id, @conventional, @organic, @list, @updated_at)
      ON CONFLICT(crop_id) DO UPDATE SET conventional=@conventional, organic=@organic, list=@list, updated_at=@updated_at`)
    .run({ id: o.id, conventional: clamp(o.conventional), organic: clamp(o.organic), list: clamp(o.list), updated_at: new Date().toISOString() });
  applyCropPricingOverrides(getCropPriceOverrides());
  return getCropPriceOverrides();
}

/** Remove a crop's override, restoring its generated default pricing. */
export function resetCropPriceOverride(id: string): CropPriceOverride[] {
  getDb().prepare("DELETE FROM crop_pricing_overrides WHERE crop_id = ?").run(id);
  applyCropPricingOverrides(getCropPriceOverrides());
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

export function createQuote(input: QuoteInput) {
  const db = getDb();
  const email = input.customer.email.trim().toLowerCase();
  const totalAcres = Object.values(input.acres).reduce((t, n) => t + (Number(n) || 0), 0);
  const program = getPricingProgram();
  // Apply any admin per-crop price overrides before pricing this operation, so
  // the stored total matches what the grower saw in the Order Now estimate.
  applyCropPricingOverrides(getCropPriceOverrides());
  // Per-crop pricing: each crop priced by type, volume-discounted on its own acreage.
  const cq = quoteForCrops(input.acres);
  // One required soil sample per crop (kit + lab analysis); added to the order total.
  const soilPrice = program.soilSamplePrice;
  const soilTotal = (input.crops?.length || 0) * soilPrice;
  const grandTotal = cq.total + soilTotal;
  const now = new Date().toISOString();

  // Upsert account by email.
  let account = db.prepare("SELECT * FROM accounts WHERE email = ?").get(email) as { id: string } | undefined;
  let isNewAccount = false;
  let tempPassword: string | undefined;
  if (!account) {
    isNewAccount = true;
    tempPassword = genPassword();
    const id = `ac-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`INSERT INTO accounts (id,name,email,phone,business,address,password,created_at)
      VALUES (?,?,?,?,?,?,?,?)`).run(
      id, input.customer.name, email, input.customer.phone, input.customer.business, input.customer.address, tempPassword, now,
    );
    account = { id };
  }

  const seq = (db.prepare("SELECT COUNT(*) AS c FROM quotes").get() as { c: number }).c + 10001;
  const id = `q-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const number = `AP-Q-${seq}`;
  db.prepare(`INSERT INTO quotes
    (id,number,account_id,customer_name,customer_email,acres,total,effective,payload,soil_total,soil_price,status,payment_status,payment_method,created_at)
    VALUES (@id,@number,@account_id,@customer_name,@customer_email,@acres,@total,@effective,@payload,@soil_total,@soil_price,'quote','unpaid',NULL,@created_at)`).run({
    id, number, account_id: account.id,
    customer_name: input.customer.name, customer_email: email,
    acres: totalAcres, total: grandTotal, effective: cq.effective,
    payload: JSON.stringify(input), soil_total: soilTotal, soil_price: soilPrice, created_at: now,
  });

  return { id, number, isNewAccount, accountEmail: email, tempPassword };
}

export function getQuote(id: string): QuoteRow | null {
  const r = getDb().prepare("SELECT * FROM quotes WHERE id = ?").get(id) as (Omit<QuoteRow, "payload"> & { payload: string }) | undefined;
  if (!r) return null;
  return { ...r, payload: JSON.parse(r.payload) as QuoteInput };
}

export function placeOrder(id: string, method: string): QuoteRow | null {
  const db = getDb();
  if (!getQuote(id)) return null;
  const paymentStatus = method === "wire" || method === "check" ? "awaiting_payment" : "pending";
  db.prepare("UPDATE quotes SET status='ordered', payment_status=?, payment_method=? WHERE id=?").run(paymentStatus, method, id);
  return getQuote(id);
}

export const listQuotes = (): QuoteRow[] =>
  (getDb().prepare("SELECT * FROM quotes ORDER BY created_at DESC").all() as (Omit<QuoteRow, "payload"> & { payload: string })[])
    .map((r) => ({ ...r, payload: JSON.parse(r.payload) as QuoteInput }));

export interface AccountRow {
  id: string; name: string; email: string; phone: string; business: string; address: string; created_at: string;
}

export function getAccountById(id: string): AccountRow | null {
  return (getDb().prepare("SELECT id,name,email,phone,business,address,created_at FROM accounts WHERE id = ?").get(id) as AccountRow | undefined) ?? null;
}

/** Returns the account (without password) if email + password match. */
export function verifyCustomer(email: string, password: string): AccountRow | null {
  const row = getDb().prepare("SELECT * FROM accounts WHERE email = ?").get(email.trim().toLowerCase()) as
    (AccountRow & { password: string }) | undefined;
  if (!row || row.password !== password) return null;
  const { password: _pw, ...account } = row;
  void _pw;
  return account;
}

export function listQuotesByAccount(accountId: string): QuoteRow[] {
  return (getDb().prepare("SELECT * FROM quotes WHERE account_id = ? ORDER BY created_at DESC").all(accountId) as (Omit<QuoteRow, "payload"> & { payload: string })[])
    .map((r) => ({ ...r, payload: JSON.parse(r.payload) as QuoteInput }));
}

/* ---- Clients (real customers created when an order is placed) ---------- */
export interface ClientSummary extends AccountRow {
  orders: number; totalSpend: number; lastOrder: string | null;
}

/** Every customer account, with their order count + lifetime value. The admin Clients list. */
export function listAccounts(): ClientSummary[] {
  return getDb().prepare(`
    SELECT a.id, a.name, a.email, a.phone, a.business, a.address, a.created_at,
           COUNT(q.id) AS orders,
           COALESCE(SUM(q.total), 0) AS totalSpend,
           MAX(q.created_at) AS lastOrder
    FROM accounts a
    LEFT JOIN quotes q ON q.account_id = a.id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `).all() as ClientSummary[];
}

/** A single client's full contact record plus every quote/order they've placed. */
export function getClientWithQuotes(id: string): { account: AccountRow; quotes: QuoteRow[] } | null {
  const account = getAccountById(id);
  if (!account) return null;
  return { account, quotes: listQuotesByAccount(id) };
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
export function getCropFormulas(crop: string): CropFormulaRow[] {
  const rows = getDb().prepare("SELECT * FROM crop_formulas WHERE crop = ? COLLATE NOCASE").all(crop) as CropFormulaRow[];
  return rows.sort((a, b) => LINE_ORDER.indexOf(a.line_code) - LINE_ORDER.indexOf(b.line_code));
}

export function listCropFormulaCrops(): { crop: string; count: number }[] {
  return getDb().prepare("SELECT crop, COUNT(*) AS count FROM crop_formulas GROUP BY crop ORDER BY crop").all() as { crop: string; count: number }[];
}

export interface CropFormulaInput {
  crop: string; lineCode: string;
  primaryRemedy?: string; potency?: string; blend: string; targets?: string;
  rate?: string; method?: string; stage?: string; cadence?: string; labNote?: string;
}

/** Add or update one product-line formula for a crop (creates a CUSTOM crop_id for new crops). */
export function upsertCropFormula(input: CropFormulaInput): CropFormulaRow {
  const db = getDb();
  const lineCode = input.lineCode.toUpperCase();
  const existing = db.prepare("SELECT crop_id FROM crop_formulas WHERE crop = ? COLLATE NOCASE LIMIT 1").get(input.crop) as { crop_id: string } | undefined;
  const cropId = existing?.crop_id ?? `CUSTOM-${input.crop.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const id = `${cropId}-${lineCode}`;
  db.prepare(`INSERT INTO crop_formulas
    (id,crop,crop_id,line,line_code,primary_remedy,potency,blend,targets,rate,method,stage,cadence,lab_note)
    VALUES (@id,@crop,@crop_id,@line,@line_code,@primary_remedy,@potency,@blend,@targets,@rate,@method,@stage,@cadence,@lab_note)
    ON CONFLICT(id) DO UPDATE SET
      primary_remedy=excluded.primary_remedy, potency=excluded.potency, blend=excluded.blend, targets=excluded.targets,
      rate=excluded.rate, method=excluded.method, stage=excluded.stage, cadence=excluded.cadence, lab_note=excluded.lab_note`).run({
    id, crop: input.crop, crop_id: cropId, line: LINE_NAME[lineCode] ?? lineCode, line_code: lineCode,
    primary_remedy: input.primaryRemedy ?? "", potency: input.potency ?? "6C", blend: input.blend,
    targets: input.targets ?? "", rate: input.rate ?? "", method: input.method ?? "",
    stage: input.stage ?? "", cadence: input.cadence ?? "", lab_note: input.labNote ?? "",
  });
  return db.prepare("SELECT * FROM crop_formulas WHERE id = ?").get(id) as CropFormulaRow;
}

/** Every imported crop formula, flat, ordered by crop then program order — for the Formulas page. */
export function listAllCropFormulas(): CropFormulaRow[] {
  const rows = getDb().prepare("SELECT * FROM crop_formulas").all() as CropFormulaRow[];
  return rows.sort((a, b) =>
    a.crop.localeCompare(b.crop) || LINE_ORDER.indexOf(a.line_code) - LINE_ORDER.indexOf(b.line_code));
}

export interface RemedyRollup {
  remedy: string; potency: string; formulaCount: number; cropCount: number; lines: string; sampleTargets: string;
}

// One blend component looks like "Silicea 6C — 55.6% (63.1 mL/3gal, …)".
// Capture the remedy name (everything before the potency) and the potency token.
const BLEND_COMPONENT = /^(.+?)\s+(\d+\s*[CXMcxm]+)\s*[—–-]/;
const lineRank = (name: string) =>
  LINE_ORDER.indexOf(Object.keys(LINE_NAME).find((k) => LINE_NAME[k] === name) || "");

/** EVERY distinct remedy used across the imported blends (not just each formula's primary). */
export function listCropRemedies(): RemedyRollup[] {
  const rows = getDb().prepare("SELECT crop, line, blend, targets FROM crop_formulas").all() as
    { crop: string; line: string; blend: string; targets: string }[];

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
      e.crops.add(r.crop);
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
  const order = cfg.order ?? "rowid DESC";
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
  const row = (id: string) => getDb().prepare(`SELECT * FROM ${cfg.table} WHERE id = ?`).get(id);
  let n = 0;
  return {
    list: (): any[] => (getDb().prepare(`SELECT * FROM ${cfg.table} ORDER BY ${order}`).all() as any[]).map(parse),
    get: (id: string): any => parse(row(id)),
    create: (data: any): any => {
      const db = getDb();
      const id = `${cfg.prefix}-${Date.now().toString(36)}-${n++}`;
      const vals = ser(data);
      if (cfg.dateField && !vals[cfg.dateField]) vals[cfg.dateField] = today();
      const cols = Object.keys(vals);
      db.prepare(
        `INSERT INTO ${cfg.table} (id${cols.length ? "," + cols.join(",") : ""}) VALUES (@id${cols.length ? "," + cols.map((c) => "@" + c).join(",") : ""})`,
      ).run({ id, ...vals });
      return parse(row(id));
    },
    update: (id: string, data: any): any => {
      if (!row(id)) return null;
      const vals = ser(data);
      const cols = Object.keys(vals);
      if (cols.length) {
        getDb().prepare(`UPDATE ${cfg.table} SET ${cols.map((c) => `${c}=@${c}`).join(",")} WHERE id=@id`).run({ id, ...vals });
      }
      return parse(row(id));
    },
    remove: (id: string): { ok: boolean } => {
      getDb().prepare(`DELETE FROM ${cfg.table} WHERE id = ?`).run(id);
      return { ok: true };
    },
  };
}

const clientsCrud = crud({ table: "clients", prefix: "cl", order: "rowid ASC", dateField: "dateCreated",
  cols: ["company", "clientName", "email", "address", "dateCreated"] });
const formulasCrud = crud({ table: "formulas", prefix: "fm", dateField: "dateCreated",
  cols: ["name", "productLine", "crop", "description", "targetPests", "targetDiseases", "applicationMethod", "dosage", "unitPrice", "remedies", "status", "dateCreated"] });
const remediesCrud = crud({ table: "remedies", prefix: "rm", dateField: "dateCreated",
  cols: ["name", "description", "recurring", "status", "dateCreated"] });
const adminsCrud = crud({ table: "admins", prefix: "ad", dateField: "dateCreated",
  cols: ["name", "email", "status", "dateCreated"] });
const teamCrud = crud({ table: "team", prefix: "tm", order: "sort ASC",
  cols: ["name", "role", "status", "sort"] });
const provenCrud = crud({ table: "proven_entries", prefix: "pv", order: "rowid ASC",
  cols: ["title", "metric1Label", "metric1Value", "metric2Label", "metric2Value", "linkedOrder", "status", "description"] });
const faqsCrud = crud({ table: "faqs", prefix: "fq", order: "rowid ASC", json: ["questions"],
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

export const listClients = () => clientsCrud.list() as ClientRow[];
export const listFormulas = () => formulasCrud.list() as FormulaRow[];
export const listRemedies = () => remediesCrud.list() as RemedyRow[];
export const listAdmins = () => adminsCrud.list() as AdminRow[];
export const listTeam = () => teamCrud.list() as TeamRow[];
export const listProven = () => provenCrud.list() as ProvenRow[];
export const listFaqs = () => faqsCrud.list() as FaqRow[];
