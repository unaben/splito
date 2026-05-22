/**
 * ─────────────────────────────────────────────────────────────
 * Next.js 16 renamed middleware → proxy.
 *
 * Routing logic:
 *   /api/*              → always pass through
 *   isSeeded: true      → redirect to /register
 *   isSeeded: false + no session → redirect to /login
 *   isSeeded: false + session → let through
 *   auth-free paths     → always accessible
 * ─────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_FREE_PATHS = [
  "/register",
  "/login",
  "/forgot-password",
  "/api/auth",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets always pass through
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protect API routes — return 401 instead of redirecting
  if (pathname.startsWith("/api/")) {
    const isAuthFreeApi = pathname.startsWith("/api/auth");
    if (!isAuthFreeApi && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Check seed status for page routing
  const seedCheckUrl = new URL("/api/auth/seed-status", req.url);
  const seedRes = await fetch(seedCheckUrl);
  const { isSeeded } = (await seedRes.json()) as { isSeeded: boolean };

  const isAuthFreePath = AUTH_FREE_PATHS.some((p) => pathname.startsWith(p));

  // Fresh device — everyone goes to /register
  if (isSeeded) {
    if (pathname === "/register" || pathname === "/forgot-password") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // Account exists, not logged in
  if (!token) {
    if (isAuthFreePath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged-in user visiting auth pages → dashboard
  if (isAuthFreePath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
