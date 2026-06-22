import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") throw new Error("Invalid settings payload");
    return NextResponse.json({ settings: updateSettings(body as Record<string, string>) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
