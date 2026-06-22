import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { PRODUCTS } from "./products";
import { ORDERS, CUSTOMERS, INVENTORY } from "./admin-data";
import {
  SEED_CLIENTS, SEED_FORMULAS, SEED_REMEDIES, SEED_ADMINS,
  SEED_TEAM, SEED_PROVEN, SEED_FAQS, ORDER_WORKFLOW,
} from "./seed-extra";
import cropFormulaData from "./data/crop-formulas.json";

// Singleton across dev HMR reloads.
const g = globalThis as unknown as { __agripureDb?: Database.Database };

function open(): Database.Database {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "agripure.db"));
  db.pragma("journal_mode = WAL");
  migrate(db);
  seed(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, num TEXT, name TEXT, category TEXT, type TEXT, grp TEXT,
      accent TEXT, accentSoft TEXT, band TEXT, price INTEGER, sku TEXT,
      rating REAL, reviews INTEGER, stock INTEGER, cap INTEGER,
      tagline TEXT, blurb TEXT, long TEXT, npk TEXT, ph TEXT, omri TEXT, rate TEXT,
      crops TEXT, image TEXT
    );
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY, name TEXT, op TEXT, location TEXT, crop TEXT,
      orders INTEGER, ltv TEXT, avColor TEXT
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, customer TEXT, op TEXT, product TEXT, date TEXT,
      total TEXT, status TEXT, created_at TEXT,
      payment TEXT DEFAULT 'Pending', lab_production TEXT DEFAULT 'Queued',
      recurring INTEGER DEFAULT 0, items INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY, company TEXT, clientName TEXT, email TEXT,
      address TEXT, dateCreated TEXT
    );
    CREATE TABLE IF NOT EXISTS formulas (
      id TEXT PRIMARY KEY, name TEXT, productLine TEXT, crop TEXT, description TEXT,
      targetPests TEXT, targetDiseases TEXT, applicationMethod TEXT, dosage TEXT,
      unitPrice INTEGER, remedies TEXT, status TEXT, dateCreated TEXT
    );
    CREATE TABLE IF NOT EXISTS remedies (
      id TEXT PRIMARY KEY, name TEXT, description TEXT, recurring INTEGER,
      status TEXT, dateCreated TEXT
    );
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY, name TEXT, email TEXT, status TEXT, dateCreated TEXT
    );
    CREATE TABLE IF NOT EXISTS team (
      id TEXT PRIMARY KEY, name TEXT, role TEXT, status TEXT, sort INTEGER
    );
    CREATE TABLE IF NOT EXISTS proven_entries (
      id TEXT PRIMARY KEY, title TEXT, metric1Label TEXT, metric1Value TEXT,
      metric2Label TEXT, metric2Value TEXT, linkedOrder TEXT, status TEXT, description TEXT
    );
    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY, section TEXT, product TEXT, status TEXT, questions TEXT
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, phone TEXT, business TEXT,
      address TEXT, password TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY, number TEXT, account_id TEXT, customer_name TEXT, customer_email TEXT,
      acres INTEGER, total INTEGER, effective INTEGER, payload TEXT,
      status TEXT, payment_status TEXT, payment_method TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS crop_formulas (
      id TEXT PRIMARY KEY, crop TEXT, crop_id TEXT, line TEXT, line_code TEXT,
      primary_remedy TEXT, potency TEXT, blend TEXT, targets TEXT, rate TEXT,
      method TEXT, stage TEXT, cadence TEXT, lab_note TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_crop_formulas_crop ON crop_formulas(crop);
  `);

  // Older databases: add order workflow columns if missing.
  const cols = (db.prepare("PRAGMA table_info(orders)").all() as { name: string }[]).map((c) => c.name);
  const add = (name: string, def: string) => {
    if (!cols.includes(name)) db.exec(`ALTER TABLE orders ADD COLUMN ${name} ${def}`);
  };
  add("payment", "TEXT DEFAULT 'Pending'");
  add("lab_production", "TEXT DEFAULT 'Queued'");
  add("recurring", "INTEGER DEFAULT 0");
  add("items", "INTEGER DEFAULT 1");

  // Older databases: add the product image column if missing.
  const pcols = (db.prepare("PRAGMA table_info(products)").all() as { name: string }[]).map((c) => c.name);
  if (!pcols.includes("image")) db.exec(`ALTER TABLE products ADD COLUMN image TEXT`);
}

function seed(db: Database.Database) {
  const count = (t: string) =>
    (db.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get() as { c: number }).c;

  if (count("products") === 0) {
    const ins = db.prepare(`INSERT INTO products
      (id,num,name,category,type,grp,accent,accentSoft,band,price,sku,rating,reviews,stock,cap,tagline,blurb,long,npk,ph,omri,rate,crops)
      VALUES (@id,@num,@name,@category,@type,@grp,@accent,@accentSoft,@band,@price,@sku,@rating,@reviews,@stock,@cap,@tagline,@blurb,@long,@npk,@ph,@omri,@rate,@crops)`);
    const tx = db.transaction(() => {
      for (const p of PRODUCTS) {
        const inv = INVENTORY[p.id] ?? { stock: p.stock, cap: 200 };
        ins.run({
          id: p.id, num: p.num, name: p.name, category: p.category, type: p.type, grp: p.group,
          accent: p.accent, accentSoft: p.accentSoft, band: p.band, price: p.price, sku: p.sku,
          rating: p.rating, reviews: p.reviews, stock: inv.stock, cap: inv.cap,
          tagline: p.tagline, blurb: p.blurb, long: p.long, npk: p.npk, ph: p.ph, omri: p.omri,
          rate: p.rate, crops: JSON.stringify(p.crops),
        });
      }
    });
    tx();
  }

  if (count("customers") === 0) {
    const ins = db.prepare(`INSERT INTO customers (id,name,op,location,crop,orders,ltv,avColor)
      VALUES (@id,@name,@op,@location,@crop,@orders,@ltv,@avColor)`);
    const tx = db.transaction(() => {
      CUSTOMERS.forEach((c, i) =>
        ins.run({ id: String(i + 1), name: c.name, op: c.op, location: c.location, crop: c.crop, orders: c.orders, ltv: c.ltv, avColor: c.avColor }),
      );
    });
    tx();
  }

  if (count("orders") === 0) {
    const ins = db.prepare(`INSERT INTO orders (id,customer,op,product,date,total,status,created_at,payment,lab_production,recurring,items)
      VALUES (@id,@customer,@op,@product,@date,@total,@status,@created_at,@payment,@lab_production,@recurring,@items)`);
    const tx = db.transaction(() => {
      // "0000-" prefix keeps seeds sorting below real ISO timestamps so new
      // orders appear at the top; the suffix preserves the seed display order.
      ORDERS.forEach((o, i) => {
        const w = ORDER_WORKFLOW[i] ?? { payment: "Pending", lab: "Queued", recurring: 0, items: 1 };
        ins.run({
          ...o, created_at: `0000-${String(ORDERS.length - i).padStart(4, "0")}`,
          payment: w.payment, lab_production: w.lab, recurring: w.recurring, items: w.items,
        });
      });
    });
    tx();
  }

  if (count("settings") === 0) {
    const ins = db.prepare(`INSERT INTO settings (key,value) VALUES (?,?)`);
    const defaults: Record<string, string> = {
      storeName: "AgriPure",
      supportEmail: "grow@agripure.com",
      fieldOffice: "1820 Vineyard Rd, Napa, CA 94558",
      stock: "true",
      ship: "true",
      net30: "true",
      marketing: "false",
    };
    const tx = db.transaction(() => {
      Object.entries(defaults).forEach(([k, v]) => ins.run(k, v));
    });
    tx();
  }

  const seedRows = (table: string, rows: object[], cols: string[], idPrefix: string) => {
    if (count(table) > 0) return;
    const placeholders = ["id", ...cols].map((c) => `@${c}`).join(",");
    const ins = db.prepare(`INSERT INTO ${table} (id,${cols.join(",")}) VALUES (${placeholders})`);
    const tx = db.transaction(() => {
      rows.forEach((r, i) => ins.run({ id: `${idPrefix}-${i + 1}`, ...r }));
    });
    tx();
  };

  seedRows("clients", SEED_CLIENTS, ["company", "clientName", "email", "address", "dateCreated"], "cl");
  seedRows("formulas", SEED_FORMULAS,
    ["name", "productLine", "crop", "description", "targetPests", "targetDiseases", "applicationMethod", "dosage", "unitPrice", "remedies", "status", "dateCreated"], "fm");
  seedRows("remedies", SEED_REMEDIES, ["name", "description", "recurring", "status", "dateCreated"], "rm");
  seedRows("admins", SEED_ADMINS, ["name", "email", "status", "dateCreated"], "ad");
  seedRows("team", SEED_TEAM, ["name", "role", "status", "sort"], "tm");
  seedRows("proven_entries", SEED_PROVEN,
    ["title", "metric1Label", "metric1Value", "metric2Label", "metric2Value", "linkedOrder", "status", "description"], "pv");
  if (count("faqs") === 0) {
    const ins = db.prepare("INSERT INTO faqs (id,section,product,status,questions) VALUES (?,?,?,?,?)");
    const tx = db.transaction(() => {
      SEED_FAQS.forEach((f, i) => ins.run(`fq-${i + 1}`, f.section, f.product, f.status, JSON.stringify(f.questions)));
    });
    tx();
  }

  if (count("crop_formulas") === 0) {
    const ins = db.prepare(`INSERT INTO crop_formulas
      (id,crop,crop_id,line,line_code,primary_remedy,potency,blend,targets,rate,method,stage,cadence,lab_note)
      VALUES (@id,@crop,@crop_id,@line,@line_code,@primary_remedy,@potency,@blend,@targets,@rate,@method,@stage,@cadence,@lab_note)`);
    const tx = db.transaction(() => {
      for (const f of cropFormulaData.formulas) {
        ins.run({
          id: `${f.cropId}-${f.lineCode}`, crop: f.crop, crop_id: f.cropId, line: f.line, line_code: f.lineCode,
          primary_remedy: f.primaryRemedy, potency: f.potency, blend: f.blend, targets: f.targets,
          rate: f.rate, method: f.method, stage: f.stage, cadence: f.cadence, lab_note: f.labNote,
        });
      }
    });
    tx();
  }
}

export function getDb(): Database.Database {
  if (!g.__agripureDb) g.__agripureDb = open();
  return g.__agripureDb;
}
