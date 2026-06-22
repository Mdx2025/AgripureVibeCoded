import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/repo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ products: listProducts() });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b?.name || !b?.category || !b?.type || !b?.group || !(b?.price >= 0)) {
      throw new Error("name, category, type, group, and price are required");
    }
    const product = createProduct({
      name: String(b.name),
      category: String(b.category),
      type: String(b.type),
      group: String(b.group),
      price: Number(b.price),
      stock: b.stock != null ? Number(b.stock) : 0,
      sku: b.sku ? String(b.sku) : undefined,
      blurb: b.blurb ? String(b.blurb) : undefined,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
