import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const patch = await req.json();
    const product = updateProduct(params.id, patch ?? {});
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
