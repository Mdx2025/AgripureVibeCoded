// One-time data migration: data/agripure.db (better-sqlite3) → Neon Postgres.
//
// Reads each table via the `sqlite3` CLI (the macOS Node can't load the
// better-sqlite3 native binding) and bulk-inserts over the Neon HTTP driver.
// Idempotent: ON CONFLICT DO NOTHING, so re-running won't duplicate rows.
//
//   NODE_OPTIONS=--experimental-global-webcrypto node scripts/migrate-sqlite-to-neon.mjs
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { execFileSync } from "node:child_process";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) { console.error("Missing DATABASE_URL(_UNPOOLED)"); process.exit(1); }
const pool = new Pool({ connectionString: url });

const SQLITE = "data/agripure.db";
// Order doesn't matter (no FKs), but keep it readable.
const TABLES = [
  "products", "customers", "orders", "settings", "clients", "formulas",
  "remedies", "admins", "team", "proven_entries", "faqs", "accounts",
  "quotes", "crop_formulas", "crop_pricing_overrides",
];

const readTable = (t) => {
  const out = execFileSync("sqlite3", [SQLITE, ".mode json", `SELECT * FROM ${t};`], {
    encoding: "utf8", maxBuffer: 1 << 30,
  }).trim();
  return out ? JSON.parse(out) : [];
};

const CHUNK = 200;
let grand = 0;
for (const t of TABLES) {
  const rows = readTable(t);
  if (!rows.length) { console.log(`  ${t.padEnd(22)} 0 rows (skipped)`); continue; }
  const cols = Object.keys(rows[0]);
  const colSql = cols.map((c) => `"${c}"`).join(", ");
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const params = [];
    const tuples = chunk.map((r) => {
      const ph = cols.map((c) => { params.push(r[c] ?? null); return `$${params.length}`; });
      return `(${ph.join(", ")})`;
    });
    await pool.query(
      `INSERT INTO "${t}" (${colSql}) VALUES ${tuples.join(", ")} ON CONFLICT DO NOTHING`,
      params,
    );
    inserted += chunk.length;
  }
  grand += inserted;
  console.log(`  ${t.padEnd(22)} ${inserted} rows`);
}
console.log(`\nDone. ${grand} rows migrated into Neon.`);
await pool.end();
