import { NextRequest, NextResponse } from "next/server";
import { getSeoConfig, saveSeoConfig } from "@/lib/repo";
import { getAdminUser } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ config: await getSeoConfig() });
}

export async function POST(req: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body?.site || !body?.pages) throw new Error("Invalid SEO config");
    return NextResponse.json({ config: await saveSeoConfig(body) }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid SEO config" }, { status: 400 });
  }
}
