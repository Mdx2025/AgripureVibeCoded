import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct } from "@/lib/repo";
import { getAdminUser } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const patch = await req.json();
    const product = await updateProduct(params.id, patch ?? {});
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
