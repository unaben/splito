/**
 * app/api/users/[id]/route.ts
 *
 * GET    /api/users/:id  → single user
 * PATCH  /api/users/:id  → update user fields
 * DELETE /api/users/:id  → remove user
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getUser, updateUser } from "@/lib/db";
import type { Params, User } from "@/types";

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id: userId } = auth;

  const user = await getUser(id, userId);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id: userId } = auth;

  const existing = await getUser(id, userId);
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<
    Pick<
      User,
      | "name"
      | "email"
      | "avatarInitials"
      | "avatarBg"
      | "avatarFg"
      | "onboardingComplete"
      | "passwordHash"
    >
  >;

  const updated = await updateUser(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json(updated);
}
