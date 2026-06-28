import { NextRequest, NextResponse } from "next/server";
import { createQuote } from "@/lib/repo";
import { sendEmail } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const c = b?.customer ?? {};
    if (!c.name || !c.email || !Array.isArray(b?.crops) || b.crops.length === 0) {
      throw new Error("Name, email, and at least one crop are required");
    }
    const result = createQuote({
      customer: {
        name: String(c.name), email: String(c.email), phone: String(c.phone ?? ""),
        business: String(c.business ?? ""), address: String(c.address ?? ""),
      },
      crops: b.crops,
      acres: b.acres ?? {},
      soilByCrop: b.soilByCrop ?? {},
      weedsByCrop: b.weedsByCrop ?? {},
      plantHealthByCrop: b.plantHealthByCrop ?? {},
      pestsByCrop: b.pestsByCrop ?? {},
      diseasesByCrop: b.diseasesByCrop ?? {},
      yieldByCrop: b.yieldByCrop ?? {},
    });
    // Email the quote link + (for new accounts) login details. Real send when
    // RESEND_API_KEY is set; otherwise this is a no-op stub.
    const origin = req.nextUrl.origin;
    const link = `${origin}/order-now/quote/${result.id}`;
    await sendEmail({
      to: result.accountEmail,
      subject: `Your AgriPure quote ${result.number}`,
      html:
        `<p>Thanks for building your AgriPure program.</p>` +
        `<p>View your custom quote <b>${result.number}</b>: <a href="${link}">${link}</a></p>` +
        (result.tempPassword
          ? `<p>Your account is ready — sign in at <a href="${origin}/sign-in">${origin}/sign-in</a> with <b>${result.accountEmail}</b> and temporary password <b>${result.tempPassword}</b>.</p>`
          : ""),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid quote" }, { status: 400 });
  }
}
