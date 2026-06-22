import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_VALUE, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}) as { email?: string; password?: string });
  if (String(email ?? "").trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
}
