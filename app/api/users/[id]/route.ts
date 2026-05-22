/**
 * app/api/users/[id]/route.ts
 *
 * GET    /api/users/:id  → single user
 * PATCH  /api/users/:id  → update user fields
 * DELETE /api/users/:id  → remove user
 */

import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser } from "@/lib/db";
import type { Params, User } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as Partial<
    Pick<
      User,
      | "name"
      | "email"
      | "avatarInitials"
      | "avatarBg"
      | "avatarFg"
      | "isSeeded"
      | "passwordHash"
    >
  >;
  const user = await updateUser(id, body);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}
