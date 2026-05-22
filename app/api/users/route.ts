/**
 * app/api/users/route.ts
 *
 * GET  /api/users          → all users
 * GET  /api/users?ids=a,b  → filter by comma-separated IDs
 * POST /api/users          → create a new user
 */

import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers, getUsersByIds } from "@/lib/db";
import { uid } from "@/helper";
import type { User } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim());
    const users = await getUsersByIds(ids);
    return NextResponse.json(users);
  }

  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, avatarInitials, avatarBg, avatarFg } = body as Omit<
    User,
    "id" | "isSeeded"
  >;

  if (!email || !name) {
    return NextResponse.json(
      { error: "email and name are required" },
      { status: 400 }
    );
  }

  const user = await createUser({
    id: `user-${uid()}`,
    email,
    name,
    avatarInitials: avatarInitials ?? name.slice(0, 2).toUpperCase(),
    avatarBg: avatarBg ?? "#E5E7EB",
    avatarFg: avatarFg ?? "#111827",
    isSeeded: true,
  });

  return NextResponse.json(user, { status: 201 });
}
