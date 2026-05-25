/**
 * ─────────────────────────────────────────────────────────────
 * Validates the NextAuth JWT on every API request.
 * Returns the decoded token if valid, or a 401 NextResponse.
 *
 * Usage in any API route:
 *   const auth = await requireAuth(req)
 *   if (auth instanceof NextResponse) return auth
 *   // auth.id is the current user's id
 * ─────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function requireAuth(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return token as { id: string; name?: string; email?: string };
}
