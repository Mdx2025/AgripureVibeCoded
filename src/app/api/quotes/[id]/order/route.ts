import { NextRequest, NextResponse } from "next/server";
import { getQuote, placeOrder } from "@/lib/repo";
import { createStripeCheckout, createPlaidLinkToken } from "@/lib/integrations";

export const dynamic = "force-dynamic";

const METHODS = new Set(["card", "ach", "wire", "check"]);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { method } = await req.json().catch(() => ({}));
    if (!METHODS.has(method)) throw new Error("Unknown payment method");
    const quote = await getQuote(params.id);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const origin = req.nextUrl.origin;
    const extra: Record<string, string> = {};

    if (method === "card") {
      const url = await createStripeCheckout({
        amountCents: Math.round(quote.total * 100),
        label: `AgriPure program — ${quote.number}`,
        email: quote.customer_email,
        successUrl: `${origin}/order-now/quote/${quote.id}?paid=1`,
        cancelUrl: `${origin}/order-now/quote/${quote.id}`,
      });
      if (url) extra.checkoutUrl = url; // client redirects to Stripe when configured
    } else if (method === "ach") {
      const token = await createPlaidLinkToken(quote.account_id);
      if (token) extra.plaidLinkToken = token; // hand to Plaid Link UI when configured
    }

    const updated = await placeOrder(params.id, method);
    return NextResponse.json({ ok: true, quote: updated, ...extra });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Order failed" }, { status: 400 });
  }
}
