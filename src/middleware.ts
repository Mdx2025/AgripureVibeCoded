import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { CUSTOMER_COOKIE } from "@/lib/auth";

// Edge-safe Auth.js instance — reads/verifies the JWT session only (no DB).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Admin dashboard — require a valid Auth.js admin session.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/sign-in") return NextResponse.next();
    if (!req.auth?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Customer account portal — lightweight session cookie (account id).
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!req.cookies.get(CUSTOMER_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
