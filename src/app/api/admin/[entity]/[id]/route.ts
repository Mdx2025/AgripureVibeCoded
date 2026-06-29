import { NextRequest, NextResponse } from "next/server";
import { ENTITIES } from "@/lib/repo";
import { getAdminUser } from "@/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: { entity: string; id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = ENTITIES[params.entity];
  if (!e) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const item = e.get(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = ENTITIES[params.entity];
  if (!e) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  try {
    const body = await req.json().catch(() => ({}));
    const item = e.update(params.id, body);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const e = ENTITIES[params.entity];
  if (!e) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  return NextResponse.json(e.remove(params.id));
}
