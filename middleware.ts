/**
 * middleware.ts
 * ─────────────────────────────────────────────────────────────
 * Runs on every matched request before the page renders.
 *
 * Routing logic:
 *
 *   /api/*              → always pass through (never redirect to /login)
 *   isSeeded: true      → everyone goes to /register (fresh device)
 *   isSeeded: false + no session → /login
 *   isSeeded: false + has session → through to the page
 *   /register, /login, /forgot-password → always accessible
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const seedCheckUrl = new URL("/api/auth/seed-status", req.url);
  const seedRes = await fetch(seedCheckUrl);
  const { isSeeded } = (await seedRes.json()) as { isSeeded: boolean };

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthFreePath = AUTH_FREE_PATHS.some((p) => pathname.startsWith(p));

  if (isSeeded) {
    if (pathname === "/register" || pathname === "/forgot-password") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (!token) {
    if (isAuthFreePath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthFreePath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
