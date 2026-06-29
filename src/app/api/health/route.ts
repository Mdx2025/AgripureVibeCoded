import { NextResponse } from "next/server";

// Liveness/readiness probe for Fly health checks and the external uptime
// monitor. Stays dependency-light on purpose; a DB ping is added in Phase 0b
// once the data layer is on Drizzle/Neon so a failed DB fails the check too.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "agripure", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
