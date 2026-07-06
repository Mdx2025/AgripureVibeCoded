import { NextResponse } from "next/server";
import { cancelOrders } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ids = body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "ids must be a non-empty array" },
      { status: 400 },
    );
  }

  const filtered = ids.filter((id): id is string => typeof id === "string" && id.length > 0);
  if (filtered.length === 0) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "No valid order IDs provided" },
      { status: 400 },
    );
  }

  await cancelOrders(filtered);
  return NextResponse.json({ status: "ok", canceled: filtered.length });
}
