/**
 * proxy.ts  (was middleware.ts)
 * ─────────────────────────────────────────────────────────────
 * Next.js 16 renamed middleware → proxy.
 *
 * Two breaking changes from the old middleware.ts:
 *   1. File must be named proxy.ts
 *   2. Exported function must be named `proxy` (or default export)
 *   3. `export const runtime` is NOT allowed — proxy always runs
 *      on Node.js in Next.js 16, no declaration needed
 *
 * Routing logic:
 *   /api/*              → always pass through
 *   isSeeded: true      → redirect to /register
 *   isSeeded: false + no session → redirect to /login
 *   isSeeded: false + session → let through
 *   auth-free paths     → always accessible
 * ─────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_FREE_PATHS = ["/register", "/login", "/forgot-password", "/api/auth"]

// Export named `proxy` — required by Next.js 16
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // API routes and static assets always pass through
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // Check seed status via API route
  const seedCheckUrl = new URL("/api/auth/seed-status", req.url)
  const seedRes      = await fetch(seedCheckUrl)
  const { isSeeded } = await seedRes.json() as { isSeeded: boolean }

  const token          = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthFreePath = AUTH_FREE_PATHS.some(p => pathname.startsWith(p))

  // Fresh device — everyone goes to /register
  if (isSeeded) {
    if (pathname === "/register" || pathname === "/forgot-password") {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/register", req.url))
  }

  // Account exists, not logged in
  if (!token) {
    if (isAuthFreePath) return NextResponse.next()
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged-in user visiting auth pages → dashboard
  if (isAuthFreePath) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}