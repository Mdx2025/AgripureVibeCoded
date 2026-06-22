import { NextRequest, NextResponse } from "next/server";
import { getCropFormulas, listCropFormulaCrops, upsertCropFormula } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const crop = req.nextUrl.searchParams.get("crop");
  if (crop) return NextResponse.json({ formulas: getCropFormulas(crop) });
  return NextResponse.json({ crops: listCropFormulaCrops() });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b?.crop || !b?.lineCode || !b?.blend) throw new Error("crop, lineCode, and blend are required");
    return NextResponse.json({ formula: upsertCropFormula(b) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid formula" }, { status: 400 });
  }
}
