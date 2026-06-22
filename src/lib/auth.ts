import type { NextRequest } from "next/server";

// Demo-grade session: a single shared admin credential + an opaque cookie.
// Replace with real user accounts + signed/JWT sessions for production.
export const SESSION_COOKIE = "ap_admin";
export const SESSION_VALUE = "ap-admin-session-v1";
export const ADMIN_EMAIL = "superadmin@agripure.com";
export const ADMIN_PASSWORD = "agripure";

export function isAdmin(req: NextRequest): boolean {
  return req.cookies.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

// Customer sessions (Order Now accounts). The cookie value is the account id.
export const CUSTOMER_COOKIE = "ap_customer";
export function customerId(req: NextRequest): string | null {
  return req.cookies.get(CUSTOMER_COOKIE)?.value ?? null;
}
