/**
 * app/api/auth/seed-status/route.ts
 *
 * GET /api/auth/seed-status
 * Returns { isSeeded: boolean } — used by middleware to decide
 * whether to route to /register or /login.
 *
 */

import { getSeedStatus } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const isSeeded = await getSeedStatus();
  return NextResponse.json({ isSeeded });
}
