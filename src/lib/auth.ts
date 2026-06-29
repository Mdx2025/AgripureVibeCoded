import type { NextRequest } from "next/server";

// Admin auth is handled by Auth.js — see src/auth.ts (Credentials + bcrypt +
// RBAC) and src/middleware.ts. This module only holds the lightweight CUSTOMER
// session helpers used by the Order Now account portal.

// Customer sessions (Order Now accounts). The cookie value is the account id.
export const CUSTOMER_COOKIE = "ap_customer";
export function customerId(req: NextRequest): string | null {
  return req.cookies.get(CUSTOMER_COOKIE)?.value ?? null;
}
