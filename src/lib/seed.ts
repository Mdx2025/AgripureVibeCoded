// Drizzle seed — recreates the starter dataset on an EMPTY database (fresh Neon
// project or a PR-preview branch). Idempotent per-table: each table is seeded
// only when it has zero rows, mirroring the original better-sqlite3 seed.
//
// Run with:  npm run db:seed   (tsx scripts/seed.ts)
import { sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { getDb } from "./db";
import {
  products, customers, orders, settings, clients, formulas, remedies,
  admins, team, provenEntries, faqs, cropFormulas,
} from "./schema";
import { PRODUCTS } from "./products";
import { ORDERS, CUSTOMERS, INVENTORY } from "./admin-data";
import {
  SEED_CLIENTS, SEED_FORMULAS, SEED_REMEDIES, SEED_ADMINS,
  SEED_TEAM, SEED_PROVEN, SEED_FAQS, ORDER_WORKFLOW,
} from "./seed-extra";
import cropFormulaData from "./data/crop-formulas.json";

type AnyTable = Parameters<ReturnType<typeof getDb>["insert"]>[0];
async function count(table: PgTable): Promise<number> {
  const r = await getDb().select({ c: sql<number>`count(*)::int` }).from(table);
  return r[0]?.c ?? 0;
}

export async function seedDatabase(): Promise<void> {
  const db = getDb();

  if ((await count(products)) === 0) {
    await db.insert(products).values(PRODUCTS.map((p) => {
      const inv = INVENTORY[p.id] ?? { stock: p.stock, cap: 200 };
      return {
        id: p.id, num: p.num, name: p.name, category: p.category, type: p.type, grp: p.group,
        accent: p.accent, accentSoft: p.accentSoft, band: p.band, price: p.price, sku: p.sku,
        rating: p.rating, reviews: p.reviews, stock: inv.stock, cap: inv.cap,
        tagline: p.tagline, blurb: p.blurb, long: p.long, npk: p.npk, ph: p.ph, omri: p.omri,
        rate: p.rate, crops: JSON.stringify(p.crops),
      };
    }));
    console.log(`  products            ${PRODUCTS.length}`);
  }

  if ((await count(customers)) === 0) {
    await db.insert(customers).values(CUSTOMERS.map((c, i) => ({
      id: String(i + 1), name: c.name, op: c.op, location: c.location, crop: c.crop,
      orders: c.orders, ltv: c.ltv, avColor: c.avColor,
    })));
    console.log(`  customers           ${CUSTOMERS.length}`);
  }

  if ((await count(orders)) === 0) {
    await db.insert(orders).values(ORDERS.map((o, i) => {
      const w = ORDER_WORKFLOW[i] ?? { payment: "Pending", lab: "Queued", recurring: 0, items: 1 };
      // "0000-" prefix keeps seeds sorting below real ISO timestamps.
      return { ...o, created_at: `0000-${String(ORDERS.length - i).padStart(4, "0")}`,
        payment: w.payment, lab_production: w.lab, recurring: w.recurring, items: w.items };
    }));
    console.log(`  orders              ${ORDERS.length}`);
  }

  if ((await count(settings)) === 0) {
    const defaults: Record<string, string> = {
      storeName: "AgriPure", supportEmail: "grow@agripure.com",
      fieldOffice: "1820 Vineyard Rd, Napa, CA 94558",
      stock: "true", ship: "true", net30: "true", marketing: "false",
    };
    await db.insert(settings).values(Object.entries(defaults).map(([key, value]) => ({ key, value })));
    console.log(`  settings            ${Object.keys(defaults).length}`);
  }

  const seedRows = async (table: AnyTable, rows: Record<string, unknown>[], idPrefix: string) => {
    if ((await count(table)) > 0) return;
    await db.insert(table).values(rows.map((r, i) => ({ id: `${idPrefix}-${i + 1}`, ...r })) as never);
    console.log(`  ${idPrefix.padEnd(18)} ${rows.length}`);
  };
  await seedRows(clients, SEED_CLIENTS as unknown as Record<string, unknown>[], "cl");
  await seedRows(formulas, SEED_FORMULAS as unknown as Record<string, unknown>[], "fm");
  await seedRows(remedies, SEED_REMEDIES as unknown as Record<string, unknown>[], "rm");
  await seedRows(admins, SEED_ADMINS as unknown as Record<string, unknown>[], "ad");
  await seedRows(team, SEED_TEAM as unknown as Record<string, unknown>[], "tm");
  await seedRows(provenEntries, SEED_PROVEN as unknown as Record<string, unknown>[], "pv");

  if ((await count(faqs)) === 0) {
    await db.insert(faqs).values(SEED_FAQS.map((f, i) => ({
      id: `fq-${i + 1}`, section: f.section, product: f.product, status: f.status, questions: JSON.stringify(f.questions),
    })));
    console.log(`  faqs                ${SEED_FAQS.length}`);
  }

  if ((await count(cropFormulas)) === 0) {
    const rows = cropFormulaData.formulas.map((f) => ({
      id: `${f.cropId}-${f.lineCode}`, crop: f.crop, crop_id: f.cropId, line: f.line, line_code: f.lineCode,
      primary_remedy: f.primaryRemedy, potency: f.potency, blend: f.blend, targets: f.targets,
      rate: f.rate, method: f.method, stage: f.stage, cadence: f.cadence, lab_note: f.labNote,
    }));
    // Chunk: large multi-row insert.
    for (let i = 0; i < rows.length; i += 500) await db.insert(cropFormulas).values(rows.slice(i, i + 500));
    console.log(`  crop_formulas       ${rows.length}`);
  }
}
