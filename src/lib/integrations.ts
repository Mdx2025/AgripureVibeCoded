// Key-gated third-party integrations via REST (no SDK dependencies). Each one
// no-ops gracefully when its env keys are absent, so the app runs stubbed until
// you add keys to .env.local. See .env.example.

export function integrationsStatus() {
  return {
    stripe: !!process.env.STRIPE_SECRET_KEY,
    plaid: !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET),
    email: !!process.env.RESEND_API_KEY,
  };
}

/** Send an email via Resend. Returns true if actually sent. */
export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.log(`[email stub] → ${opts.to}: ${opts.subject}`); return false; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "AgriPure <onboarding@resend.dev>",
        to: [opts.to], subject: opts.subject, html: opts.html,
      }),
    });
    if (!r.ok) console.error("[resend]", await r.text());
    return r.ok;
  } catch (e) { console.error("[resend] error", e); return false; }
}

/** Create a Stripe Checkout Session for a one-time payment. Returns the URL or null. */
export async function createStripeCheckout(opts: {
  amountCents: number; label: string; email: string; successUrl: string; cancelUrl: string;
}): Promise<string | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", opts.successUrl);
  form.set("cancel_url", opts.cancelUrl);
  form.set("customer_email", opts.email);
  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", "usd");
  form.set("line_items[0][price_data][product_data][name]", opts.label);
  form.set("line_items[0][price_data][unit_amount]", String(opts.amountCents));
  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!r.ok) { console.error("[stripe]", await r.text()); return null; }
    return (await r.json()).url ?? null;
  } catch (e) { console.error("[stripe] error", e); return null; }
}

/** Create a Plaid Link token for the ACH flow. Returns the token or null. */
export async function createPlaidLinkToken(userId: string): Promise<string | null> {
  const clientId = process.env.PLAID_CLIENT_ID, secret = process.env.PLAID_SECRET;
  if (!clientId || !secret) return null;
  const env = process.env.PLAID_ENV || "sandbox";
  try {
    const r = await fetch(`https://${env}.plaid.com/link/token/create`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId, secret, client_name: "AgriPure",
        products: ["auth"], country_codes: ["US"], language: "en",
        user: { client_user_id: userId },
      }),
    });
    if (!r.ok) { console.error("[plaid]", await r.text()); return null; }
    return (await r.json()).link_token ?? null;
  } catch (e) { console.error("[plaid] error", e); return null; }
}
