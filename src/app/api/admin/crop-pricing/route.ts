import { NextRequest, NextResponse } from "next/server";
import { getCropPriceOverrides, saveCropPriceOverride, resetCropPriceOverride } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ overrides: getCropPriceOverrides() });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b?.id) throw new Error("A crop id is required");
    const num = (v: unknown, label: string) => {
      const n = Number(v);
      if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be a non-negative number`);
      return n;
    };
    const overrides = saveCropPriceOverride({
      id: String(b.id),
      conventional: num(b.conventional, "Conventional"),
      organic: num(b.organic, "Organic"),
      list: num(b.list, "AgriPure list"),
    });
    return NextResponse.json({ overrides }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid crop pricing" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "A crop id is required" }, { status: 400 });
  return NextResponse.json({ overrides: resetCropPriceOverride(id) }, { status: 200 });
}
