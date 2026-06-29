import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Liveness + readiness probe for Fly health checks and the external uptime
// monitor. Pings the database so a failed DB connection fails the check.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await query("SELECT 1");
    return NextResponse.json(
      { status: "ok", service: "agripure", db: "up", time: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return NextResponse.json(
      { status: "error", service: "agripure", db: "down", error: err instanceof Error ? err.message : "db error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
