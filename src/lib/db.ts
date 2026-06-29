import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "./env"; // validates required env (DATABASE_URL, AUTH_SECRET, …)
import * as schema from "./schema";

// AgriPure runs as a long-lived Node server (Fly), so we connect to Neon over
// standard TCP via node-postgres against the POOLED endpoint. (The Neon
// serverless/WebSocket driver is only needed on edge runtimes and bundles
// badly under Next's webpack — avoided here on purpose.)

// Singleton across dev HMR reloads / warm server instances.
const g = globalThis as unknown as {
  __agripurePool?: Pool;
  __agripureDb?: NodePgDatabase<typeof schema>;
};

function pool(): Pool {
  if (!g.__agripurePool) {
    const connectionString = env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    g.__agripurePool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      // Neon requires TLS; its cert chain is public so default verification is fine.
      ssl: { rejectUnauthorized: true },
    });
  }
  return g.__agripurePool;
}

function client(): NodePgDatabase<typeof schema> {
  if (!g.__agripureDb) g.__agripureDb = drizzle(pool(), { schema });
  return g.__agripureDb;
}

/** The Drizzle client (typed query builder). Queries are awaited. */
export function getDb(): NodePgDatabase<typeof schema> {
  return client();
}

/** Low-level parameterized query helper for the generic dashboard CRUD. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool().query(text, params);
  return res.rows as T[];
}

export { schema };
