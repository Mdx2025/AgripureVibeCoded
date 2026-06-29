import { NextRequest, NextResponse } from "next/server";
import { getPricingProgram, savePricingProgram } from "@/lib/repo";
import { getAdminUser } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ program: await getPricingProgram() });
}

export async function POST(req: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!Array.isArray(body?.tiers) || body.tiers.length === 0) throw new Error("At least one pricing tier is required");
    return NextResponse.json({ program: await savePricingProgram(body) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid pricing program" }, { status: 400 });
  }
}
