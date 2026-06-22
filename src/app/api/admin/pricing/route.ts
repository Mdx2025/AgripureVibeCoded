import { NextRequest, NextResponse } from "next/server";
import { getPricingProgram, savePricingProgram } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ program: getPricingProgram() });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!Array.isArray(body?.tiers) || body.tiers.length === 0) throw new Error("At least one pricing tier is required");
    return NextResponse.json({ program: savePricingProgram(body) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid pricing program" }, { status: 400 });
  }
}
