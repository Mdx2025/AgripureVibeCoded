import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_VALUE, CUSTOMER_COOKIE } from "@/lib/auth";

// Gate the admin dashboard and the customer account portal.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/sign-in") return NextResponse.next();
    if (req.cookies.get(SESSION_COOKIE)?.value !== SESSION_VALUE) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!req.cookies.get(CUSTOMER_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
