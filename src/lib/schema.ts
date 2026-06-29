// Drizzle (Postgres / Neon) schema — mirrors the legacy better-sqlite3 tables
// 1:1 so existing data exports cleanly. Column names are preserved exactly
// (including camelCase) via the explicit name arg, since Drizzle quotes all
// identifiers. JSON-bearing TEXT columns (crops, remedies, questions, payload,
// settings.value) stay text and are (de)serialized in repo.ts, exactly as today.
//
// Notes on what lives where (unchanged from SQLite):
//   • pricing_program  → a JSON row in `settings` (key = 'pricing_program')
//   • seo_config       → a JSON row in `settings` (key = 'seo_config')
import { pgTable, text, integer, doublePrecision, index } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  num: text("num"),
  name: text("name"),
  category: text("category"),
  type: text("type"),
  grp: text("grp"),
  accent: text("accent"),
  accentSoft: text("accentSoft"),
  band: text("band"),
  price: integer("price"),
  sku: text("sku"),
  rating: doublePrecision("rating"),
  reviews: integer("reviews"),
  stock: integer("stock"),
  cap: integer("cap"),
  tagline: text("tagline"),
  blurb: text("blurb"),
  long: text("long"),
  npk: text("npk"),
  ph: text("ph"),
  omri: text("omri"),
  rate: text("rate"),
  crops: text("crops"),
  image: text("image"),
});

export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  name: text("name"),
  op: text("op"),
  location: text("location"),
  crop: text("crop"),
  orders: integer("orders"),
  ltv: text("ltv"),
  avColor: text("avColor"),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customer: text("customer"),
  op: text("op"),
  product: text("product"),
  date: text("date"),
  total: text("total"),
  status: text("status"),
  created_at: text("created_at"),
  payment: text("payment").default("Pending"),
  lab_production: text("lab_production").default("Queued"),
  recurring: integer("recurring").default(0),
  items: integer("items").default(1),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  company: text("company"),
  clientName: text("clientName"),
  email: text("email"),
  address: text("address"),
  dateCreated: text("dateCreated"),
});

export const formulas = pgTable("formulas", {
  id: text("id").primaryKey(),
  name: text("name"),
  productLine: text("productLine"),
  crop: text("crop"),
  description: text("description"),
  targetPests: text("targetPests"),
  targetDiseases: text("targetDiseases"),
  applicationMethod: text("applicationMethod"),
  dosage: text("dosage"),
  unitPrice: integer("unitPrice"),
  remedies: text("remedies"),
  status: text("status"),
  dateCreated: text("dateCreated"),
});

export const remedies = pgTable("remedies", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  recurring: integer("recurring"),
  status: text("status"),
  dateCreated: text("dateCreated"),
});

export const admins = pgTable("admins", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  status: text("status"),
  dateCreated: text("dateCreated"),
});

export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name"),
  role: text("role"),
  status: text("status"),
  sort: integer("sort"),
});

export const provenEntries = pgTable("proven_entries", {
  id: text("id").primaryKey(),
  title: text("title"),
  metric1Label: text("metric1Label"),
  metric1Value: text("metric1Value"),
  metric2Label: text("metric2Label"),
  metric2Value: text("metric2Value"),
  linkedOrder: text("linkedOrder"),
  status: text("status"),
  description: text("description"),
});

export const faqs = pgTable("faqs", {
  id: text("id").primaryKey(),
  section: text("section"),
  product: text("product"),
  status: text("status"),
  questions: text("questions"),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  phone: text("phone"),
  business: text("business"),
  address: text("address"),
  password: text("password"),
  created_at: text("created_at"),
});

export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  number: text("number"),
  account_id: text("account_id"),
  customer_name: text("customer_name"),
  customer_email: text("customer_email"),
  acres: integer("acres"),
  total: integer("total"),
  effective: integer("effective"),
  payload: text("payload"),
  soil_total: integer("soil_total").default(0),
  soil_price: integer("soil_price").default(0),
  status: text("status"),
  payment_status: text("payment_status"),
  payment_method: text("payment_method"),
  created_at: text("created_at"),
});

export const cropFormulas = pgTable(
  "crop_formulas",
  {
    id: text("id").primaryKey(),
    crop: text("crop"),
    crop_id: text("crop_id"),
    line: text("line"),
    line_code: text("line_code"),
    primary_remedy: text("primary_remedy"),
    potency: text("potency"),
    blend: text("blend"),
    targets: text("targets"),
    rate: text("rate"),
    method: text("method"),
    stage: text("stage"),
    cadence: text("cadence"),
    lab_note: text("lab_note"),
  },
  (t) => ({ cropIdx: index("idx_crop_formulas_crop").on(t.crop) }),
);

export const cropPricingOverrides = pgTable("crop_pricing_overrides", {
  crop_id: text("crop_id").primaryKey(),
  conventional: integer("conventional"),
  organic: integer("organic"),
  list: integer("list"),
  updated_at: text("updated_at"),
});

// Convenience: the full set for migrations/seed tooling.
export const schema = {
  products, customers, orders, settings, clients, formulas, remedies, admins,
  team, provenEntries, faqs, accounts, quotes, cropFormulas, cropPricingOverrides,
};
