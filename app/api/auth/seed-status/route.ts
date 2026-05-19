/**
 * app/api/auth/seed-status/route.ts
 *
 * GET /api/auth/seed-status
 * Returns { isSeeded: boolean } — used by middleware to decide
 * whether to route to /register or /login.
 *
 */

import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { findUserOne } from "@/utils";

export async function GET() {
  const db = await readDb();
  const userOne = findUserOne(db);
  return NextResponse.json({ isSeeded: userOne?.isSeeded ?? true });
}
