import { NextRequest, NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/repo";
import { CUSTOMER_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}) as { email?: string; password?: string });
  const account = email && password ? await verifyCustomer(String(email), String(password)) : null;
  if (!account) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, account.id, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
