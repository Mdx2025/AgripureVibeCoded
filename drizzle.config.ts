import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load DATABASE_URL from .env.local (Next convention) then .env as fallback.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations/DDL run over the DIRECT (unpooled) connection — PgBouncer
  // transaction pooling can break DDL. The app runtime uses the pooled URL.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
  // Keep generated SQL readable in PRs.
  verbose: true,
  strict: true,
});
