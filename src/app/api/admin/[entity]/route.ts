import { NextRequest, NextResponse } from "next/server";
import { ENTITIES } from "@/lib/repo";
import { getAdminUser } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { entity: string } }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = ENTITIES[params.entity];
  if (!e) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  return NextResponse.json({ items: e.list() });
}

export async function POST(req: NextRequest, { params }: { params: { entity: string } }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = ENTITIES[params.entity];
  if (!e) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ item: e.create(body) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Create failed" }, { status: 400 });
  }
}
